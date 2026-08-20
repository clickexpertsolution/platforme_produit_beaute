#!/usr/bin/env python3
"""
Comprehensive test for Finder v3 - Ingredient Conflict Detection
Tests warnings for pair conflicts and duplicate actives in morning/evening routines
"""

import requests
import json
import sys
from typing import Dict, Any, Optional, List

# Load base URL from environment
BASE_URL = "https://multi-lang-ui-3.preview.emergentagent.com/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    END = '\033[0m'

def log_test(name: str, passed: bool, details: str = ""):
    status = f"{Colors.GREEN}✓ PASS{Colors.END}" if passed else f"{Colors.RED}✗ FAIL{Colors.END}"
    print(f"{status} | {name}")
    if details:
        print(f"       {details}")
    return passed

def log_info(message: str):
    print(f"{Colors.CYAN}ℹ {message}{Colors.END}")

def validate_warning_structure(warning: Dict, test_results: List[bool]) -> bool:
    """Validate that a warning has the correct structure"""
    required_fields = ['type', 'severity', 'title', 'message', 'products']
    has_all_fields = all(field in warning for field in required_fields)
    test_results.append(log_test("Warning has all required fields", has_all_fields, 
                                 f"Fields: {', '.join(warning.keys())}"))
    
    if not has_all_fields:
        return False
    
    # Validate type
    valid_type = warning['type'] in ['pair', 'duplicate']
    test_results.append(log_test("Warning type is valid", valid_type, 
                                 f"Type: {warning['type']}"))
    
    # Validate severity
    valid_severity = warning['severity'] in ['high', 'medium', 'low']
    test_results.append(log_test("Warning severity is valid", valid_severity, 
                                 f"Severity: {warning['severity']}"))
    
    # Validate bilingual title
    has_bilingual_title = isinstance(warning['title'], dict) and 'fr' in warning['title'] and 'en' in warning['title']
    test_results.append(log_test("Warning title is bilingual", has_bilingual_title, 
                                 f"FR: {warning['title'].get('fr', 'N/A')[:50]}..."))
    
    # Validate bilingual message
    has_bilingual_message = isinstance(warning['message'], dict) and 'fr' in warning['message'] and 'en' in warning['message']
    test_results.append(log_test("Warning message is bilingual", has_bilingual_message, 
                                 f"EN: {warning['message'].get('en', 'N/A')[:50]}..."))
    
    # Validate products array
    valid_products = isinstance(warning['products'], list) and len(warning['products']) > 0
    test_results.append(log_test("Warning has products array", valid_products, 
                                 f"Products: {', '.join(warning['products'])}"))
    
    return has_all_fields and valid_type and valid_severity and has_bilingual_title and has_bilingual_message and valid_products

def get_product_ingredients(products: List[Dict], product_names: List[str]) -> set:
    """Get all ingredients from specified products"""
    ingredients = set()
    for product in products:
        if product.get('name') in product_names:
            ingredients.update(product.get('ingredients', []))
    return ingredients

def main():
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}Finder v3 - Ingredient Conflict Detection Tests{Colors.END}")
    print(f"{Colors.BLUE}Base URL: {BASE_URL}{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}\n")
    
    test_results = []
    
    # ========== REGRESSION TEST: Products Count ==========
    print(f"\n{Colors.YELLOW}[1] Regression: Products Count (should be 14 now){Colors.END}")
    
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        if response.status_code == 200:
            data = response.json()
            products = data.get('products', [])
            product_count = len(products)
            log_test("GET /api/products returns 14 products", product_count == 14, 
                    f"Found {product_count} products (expected 14)")
            test_results.append(product_count == 14)
            
            # Check for new products
            product_slugs = [p.get('slug') for p in products]
            has_vitamin_c_booster = 'eucerin-vitamin-c-booster' in product_slugs
            has_retinol_serum = 'borlind-retinol-nature-serum' in product_slugs
            
            test_results.append(log_test("New product: eucerin-vitamin-c-booster exists", has_vitamin_c_booster))
            test_results.append(log_test("New product: borlind-retinol-nature-serum exists", has_retinol_serum))
        else:
            log_test("GET /api/products", False, f"Status: {response.status_code}")
            test_results.append(False)
    except Exception as e:
        log_test("GET /api/products", False, f"Error: {str(e)}")
        test_results.append(False)
    
    # ========== REGRESSION TEST: Retinol Product Detail ==========
    print(f"\n{Colors.YELLOW}[2] Regression: Retinol Product Ingredient Details{Colors.END}")
    
    try:
        response = requests.get(f"{BASE_URL}/products/borlind-retinol-nature-serum", timeout=10)
        if response.status_code == 200:
            data = response.json()
            log_test("GET /api/products/borlind-retinol-nature-serum", True, f"Status: {response.status_code}")
            
            # Check ingredient_details
            ingredient_details = data.get('ingredient_details', [])
            has_ingredient_details = len(ingredient_details) > 0
            test_results.append(log_test("Product has ingredient_details array", has_ingredient_details, 
                                        f"Found {len(ingredient_details)} ingredients"))
            
            # Check for retinol in ingredients
            ingredients = data.get('ingredients', [])
            has_retinol = 'retinol' in ingredients
            test_results.append(log_test("Product contains retinol ingredient", has_retinol, 
                                        f"Ingredients: {', '.join(ingredients)}"))
            
            # Check retinol in ingredient_details
            retinol_detail = next((ing for ing in ingredient_details if ing.get('slug') == 'retinol'), None)
            has_retinol_detail = retinol_detail is not None
            test_results.append(log_test("Retinol present in ingredient_details", has_retinol_detail, 
                                        f"Retinol name: {retinol_detail.get('name') if retinol_detail else 'N/A'}"))
        else:
            log_test("GET /api/products/borlind-retinol-nature-serum", False, f"Status: {response.status_code}")
            test_results.append(False)
    except Exception as e:
        log_test("GET /api/products/borlind-retinol-nature-serum", False, f"Error: {str(e)}")
        test_results.append(False)
    
    # ========== TEST 1: Duplicate Salicylic Acid Warning ==========
    print(f"\n{Colors.YELLOW}[3] Test: Duplicate Salicylic Acid Warning (oily/acne/pigmentation/high){Colors.END}")
    
    payload = {
        "skin_type": "oily",
        "concerns": ["acne", "oily", "pigmentation"],
        "budget": "high"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
        if response.status_code == 200:
            data = response.json()
            log_test("POST /api/finder with oily/acne/pigmentation/high", True, f"Status: {response.status_code}")
            
            # Check routine structure
            routine = data.get('routine', {})
            has_routine = 'morning' in routine and 'evening' in routine and 'warnings' in routine
            test_results.append(log_test("Response has routine with morning/evening/warnings", has_routine))
            
            if has_routine:
                warnings = routine.get('warnings', {})
                morning_warnings = warnings.get('morning', [])
                evening_warnings = warnings.get('evening', [])
                
                log_info(f"Morning warnings count: {len(morning_warnings)}")
                log_info(f"Evening warnings count: {len(evening_warnings)}")
                
                # Check morning routine products
                morning_steps = routine.get('morning', [])
                morning_products = [step.get('product', {}).get('name') for step in morning_steps]
                log_info(f"Morning products: {', '.join(morning_products)}")
                
                # Look for duplicate salicylic acid warning in morning
                salicylic_warning = None
                for warning in morning_warnings:
                    if warning.get('type') == 'duplicate' and 'salicylique' in warning.get('title', {}).get('fr', '').lower():
                        salicylic_warning = warning
                        break
                
                has_salicylic_warning = salicylic_warning is not None
                test_results.append(log_test("Morning has duplicate salicylic acid warning", has_salicylic_warning, 
                                            f"Found: {salicylic_warning.get('title', {}).get('en', 'N/A') if salicylic_warning else 'None'}"))
                
                if salicylic_warning:
                    # Validate warning structure
                    log_info("Validating salicylic acid warning structure...")
                    validate_warning_structure(salicylic_warning, test_results)
                    
                    # Check severity
                    correct_severity = salicylic_warning.get('severity') == 'medium'
                    test_results.append(log_test("Salicylic acid warning has medium severity", correct_severity, 
                                                f"Severity: {salicylic_warning.get('severity')}"))
                    
                    # Check products mentioned
                    warning_products = salicylic_warning.get('products', [])
                    has_clear_face = any('Clear Face' in p for p in warning_products)
                    has_dermopure = any('DermoPure' in p or 'Triple Action' in p for p in warning_products)
                    
                    test_results.append(log_test("Warning mentions Clear Face Gel product", has_clear_face, 
                                                f"Products: {', '.join(warning_products)}"))
                    test_results.append(log_test("Warning mentions DermoPure Sérum product", has_dermopure, 
                                                f"Products: {', '.join(warning_products)}"))
                    
                    # Verify both products actually contain salicylic acid
                    log_info("Verifying products actually contain acide-salicylique...")
                    for step in morning_steps:
                        product = step.get('product', {})
                        if product.get('name') in warning_products:
                            ingredients = product.get('ingredients', [])
                            has_salicylic = 'acide-salicylique' in ingredients
                            test_results.append(log_test(f"{product.get('name')} contains acide-salicylique", has_salicylic, 
                                                        f"Ingredients: {', '.join(ingredients)}"))
        else:
            log_test("POST /api/finder", False, f"Status: {response.status_code}")
            test_results.append(False)
    except Exception as e:
        log_test("POST /api/finder", False, f"Error: {str(e)}")
        test_results.append(False)
    
    # ========== TEST 2: Pair Conflicts (Vitamin C + Retinol or BHA) ==========
    print(f"\n{Colors.YELLOW}[4] Test: Pair Conflicts (combination/oily/pigmentation/aging/high){Colors.END}")
    
    payload2 = {
        "skin_type": "combination",
        "concerns": ["oily", "pigmentation", "aging"],
        "budget": "high"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/finder", json=payload2, timeout=10)
        if response.status_code == 200:
            data = response.json()
            log_test("POST /api/finder with combination/oily/pigmentation/aging/high", True, f"Status: {response.status_code}")
            
            routine = data.get('routine', {})
            warnings = routine.get('warnings', {})
            morning_warnings = warnings.get('morning', [])
            evening_warnings = warnings.get('evening', [])
            
            # Check morning routine products
            morning_steps = routine.get('morning', [])
            morning_products = [step.get('product', {}) for step in morning_steps]
            morning_product_names = [p.get('name') for p in morning_products]
            log_info(f"Morning products: {', '.join(morning_product_names)}")
            
            # Get all ingredients in morning routine
            morning_ingredients = set()
            for product in morning_products:
                morning_ingredients.update(product.get('ingredients', []))
            log_info(f"Morning ingredients: {', '.join(morning_ingredients)}")
            
            # Check evening routine products
            evening_steps = routine.get('evening', [])
            evening_products = [step.get('product', {}) for step in evening_steps]
            evening_product_names = [p.get('name') for p in evening_products]
            log_info(f"Evening products: {', '.join(evening_product_names)}")
            
            # Get all ingredients in evening routine
            evening_ingredients = set()
            for product in evening_products:
                evening_ingredients.update(product.get('ingredients', []))
            log_info(f"Evening ingredients: {', '.join(evening_ingredients)}")
            
            # Check for pair conflicts
            all_warnings = morning_warnings + evening_warnings
            pair_warnings = [w for w in all_warnings if w.get('type') == 'pair']
            
            log_info(f"Total pair warnings: {len(pair_warnings)}")
            for pw in pair_warnings:
                log_info(f"  - {pw.get('title', {}).get('en', 'N/A')} (severity: {pw.get('severity')})")
            
            # Validate each pair warning
            for pair_warning in pair_warnings:
                validate_warning_structure(pair_warning, test_results)
                
                # Verify the pair actually exists in the session
                session = 'morning' if pair_warning in morning_warnings else 'evening'
                session_ingredients = morning_ingredients if session == 'morning' else evening_ingredients
                
                title_lower = pair_warning.get('title', {}).get('en', '').lower()
                
                # Check which pair conflict it is
                if 'retinol' in title_lower and 'salicylic' in title_lower:
                    has_both = 'retinol' in session_ingredients and 'acide-salicylique' in session_ingredients
                    test_results.append(log_test(f"Retinol+Salicylic pair exists in {session}", has_both, 
                                                f"Ingredients: {', '.join(session_ingredients)}"))
                    correct_severity = pair_warning.get('severity') == 'high'
                    test_results.append(log_test("Retinol+Salicylic has high severity", correct_severity))
                
                elif 'retinol' in title_lower and 'vitamin c' in title_lower:
                    has_both = 'retinol' in session_ingredients and 'vitamine-c' in session_ingredients
                    test_results.append(log_test(f"Retinol+Vitamin C pair exists in {session}", has_both, 
                                                f"Ingredients: {', '.join(session_ingredients)}"))
                    correct_severity = pair_warning.get('severity') == 'medium'
                    test_results.append(log_test("Retinol+Vitamin C has medium severity", correct_severity))
                
                elif 'salicylic' in title_lower and 'vitamin c' in title_lower:
                    has_both = 'acide-salicylique' in session_ingredients and 'vitamine-c' in session_ingredients
                    test_results.append(log_test(f"Salicylic+Vitamin C pair exists in {session}", has_both, 
                                                f"Ingredients: {', '.join(session_ingredients)}"))
                    correct_severity = pair_warning.get('severity') == 'medium'
                    test_results.append(log_test("Salicylic+Vitamin C has medium severity", correct_severity))
            
            # Check warnings are sorted by severity (high > medium > low)
            for session_name, session_warnings in [('morning', morning_warnings), ('evening', evening_warnings)]:
                if len(session_warnings) > 1:
                    severity_order = {'high': 0, 'medium': 1, 'low': 2}
                    is_sorted = all(
                        severity_order.get(session_warnings[i].get('severity', 'low'), 2) <= 
                        severity_order.get(session_warnings[i+1].get('severity', 'low'), 2)
                        for i in range(len(session_warnings) - 1)
                    )
                    test_results.append(log_test(f"{session_name.capitalize()} warnings sorted by severity", is_sorted, 
                                                f"Order: {' > '.join([w.get('severity') for w in session_warnings])}"))
        else:
            log_test("POST /api/finder", False, f"Status: {response.status_code}")
            test_results.append(False)
    except Exception as e:
        log_test("POST /api/finder", False, f"Error: {str(e)}")
        test_results.append(False)
    
    # ========== TEST 3: No Conflicts (Sensitive Skin) ==========
    print(f"\n{Colors.YELLOW}[5] Test: No Conflicts - Empty Warnings (sensitive/dryness/low){Colors.END}")
    
    payload3 = {
        "skin_type": "sensitive",
        "concerns": ["sensitive", "dryness"],
        "budget": "low"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/finder", json=payload3, timeout=10)
        if response.status_code == 200:
            data = response.json()
            log_test("POST /api/finder with sensitive/dryness/low", True, f"Status: {response.status_code}")
            
            routine = data.get('routine', {})
            warnings = routine.get('warnings', {})
            morning_warnings = warnings.get('morning', [])
            evening_warnings = warnings.get('evening', [])
            
            # Check morning routine products
            morning_steps = routine.get('morning', [])
            morning_products = [step.get('product', {}).get('name') for step in morning_steps]
            log_info(f"Morning products: {', '.join(morning_products)}")
            
            # Check evening routine products
            evening_steps = routine.get('evening', [])
            evening_products = [step.get('product', {}).get('name') for step in evening_steps]
            log_info(f"Evening products: {', '.join(evening_products)}")
            
            # Warnings should be empty arrays (not null)
            morning_is_array = isinstance(morning_warnings, list)
            evening_is_array = isinstance(evening_warnings, list)
            
            test_results.append(log_test("Morning warnings is an array", morning_is_array, 
                                        f"Type: {type(morning_warnings).__name__}"))
            test_results.append(log_test("Evening warnings is an array", evening_is_array, 
                                        f"Type: {type(evening_warnings).__name__}"))
            
            # For sensitive skin with no harsh actives, warnings should likely be empty
            log_info(f"Morning warnings count: {len(morning_warnings)}")
            log_info(f"Evening warnings count: {len(evening_warnings)}")
            
            # If there are warnings, they should still be valid
            for warning in morning_warnings + evening_warnings:
                validate_warning_structure(warning, test_results)
        else:
            log_test("POST /api/finder", False, f"Status: {response.status_code}")
            test_results.append(False)
    except Exception as e:
        log_test("POST /api/finder", False, f"Error: {str(e)}")
        test_results.append(False)
    
    # ========== TEST 4: Empty Body ==========
    print(f"\n{Colors.YELLOW}[6] Test: Empty Body - No Crash{Colors.END}")
    
    try:
        response = requests.post(f"{BASE_URL}/finder", json={}, timeout=10)
        if response.status_code == 200:
            data = response.json()
            log_test("POST /api/finder with empty body {}", True, f"Status: {response.status_code}")
            
            routine = data.get('routine', {})
            has_warnings_key = 'warnings' in routine
            test_results.append(log_test("Response has warnings key", has_warnings_key))
            
            if has_warnings_key:
                warnings = routine.get('warnings', {})
                has_morning = 'morning' in warnings
                has_evening = 'evening' in warnings
                test_results.append(log_test("Warnings has morning key", has_morning))
                test_results.append(log_test("Warnings has evening key", has_evening))
        else:
            log_test("POST /api/finder with empty body", False, f"Status: {response.status_code}")
            test_results.append(False)
    except Exception as e:
        log_test("POST /api/finder with empty body", False, f"Error: {str(e)}")
        test_results.append(False)
    
    # ========== TEST 5: Routine Structure Regression ==========
    print(f"\n{Colors.YELLOW}[7] Regression: Routine Structure Unchanged{Colors.END}")
    
    payload5 = {
        "skin_type": "normal",
        "concerns": ["aging"],
        "budget": "mid"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/finder", json=payload5, timeout=10)
        if response.status_code == 200:
            data = response.json()
            log_test("POST /api/finder for routine structure check", True, f"Status: {response.status_code}")
            
            # Check routine structure
            routine = data.get('routine', {})
            morning = routine.get('morning', [])
            evening = routine.get('evening', [])
            
            # Morning should have 1-4 steps (cleanser, serum, moisturizer, sunscreen)
            morning_count = len(morning)
            test_results.append(log_test("Morning routine has 1-4 steps", 1 <= morning_count <= 4, 
                                        f"Found {morning_count} steps"))
            
            # Evening should have 1-3 steps (cleanser, serum, moisturizer - NO sunscreen)
            evening_count = len(evening)
            test_results.append(log_test("Evening routine has 1-3 steps", 1 <= evening_count <= 3, 
                                        f"Found {evening_count} steps"))
            
            # Check morning order
            if morning:
                orders = [step.get('order') for step in morning]
                is_sequential = orders == list(range(1, len(orders) + 1))
                test_results.append(log_test("Morning steps are sequential (1,2,3,4)", is_sequential, 
                                            f"Orders: {orders}"))
                
                # Check no sunscreen in evening
                evening_categories = [step.get('category') for step in evening]
                no_sunscreen_evening = 'sunscreen' not in evening_categories
                test_results.append(log_test("Evening routine has NO sunscreen", no_sunscreen_evening, 
                                            f"Categories: {', '.join(evening_categories)}"))
            
            # Check alternatives exist
            alternatives = data.get('alternatives', [])
            test_results.append(log_test("Response has alternatives array", isinstance(alternatives, list), 
                                        f"Found {len(alternatives)} alternatives"))
            
            # Check legacy results exist
            results = data.get('results', [])
            test_results.append(log_test("Response has legacy results array", isinstance(results, list), 
                                        f"Found {len(results)} results"))
            
            total_field = data.get('total')
            test_results.append(log_test("Response has legacy total field", total_field is not None, 
                                        f"Total: {total_field}"))
        else:
            log_test("POST /api/finder", False, f"Status: {response.status_code}")
            test_results.append(False)
    except Exception as e:
        log_test("POST /api/finder", False, f"Error: {str(e)}")
        test_results.append(False)
    
    # ========== SUMMARY ==========
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}Test Summary{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}")
    
    passed = sum(1 for r in test_results if r)
    total = len(test_results)
    percentage = (passed / total * 100) if total > 0 else 0
    
    print(f"\nTotal Tests: {total}")
    print(f"{Colors.GREEN}Passed: {passed}{Colors.END}")
    print(f"{Colors.RED}Failed: {total - passed}{Colors.END}")
    print(f"Success Rate: {percentage:.1f}%\n")
    
    if percentage == 100:
        print(f"{Colors.GREEN}✓ All Finder v3 conflict detection tests passed!{Colors.END}\n")
        return 0
    else:
        print(f"{Colors.YELLOW}⚠ Some tests failed. Review the output above.{Colors.END}\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
