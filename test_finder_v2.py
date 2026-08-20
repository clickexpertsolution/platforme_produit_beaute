#!/usr/bin/env python3
"""
Test POST /api/finder v2 - Step-by-step routine functionality
Tests the upgraded finder that returns morning/evening routines with ordered steps
"""

import requests
import json
import sys

BASE_URL = "https://reel-showcase-73.preview.emergentagent.com/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'

def log_test(name: str, passed: bool, details: str = ""):
    status = f"{Colors.GREEN}✓ PASS{Colors.END}" if passed else f"{Colors.RED}✗ FAIL{Colors.END}"
    print(f"{status} | {name}")
    if details:
        print(f"       {details}")
    return passed

def main():
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}Testing POST /api/finder v2 - Routine Structure{Colors.END}")
    print(f"{Colors.BLUE}Base URL: {BASE_URL}{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}\n")
    
    test_results = []
    
    # ========== TEST 1: Oily skin profile with mid budget ==========
    print(f"\n{Colors.YELLOW}[1] Testing Oily Skin Profile (mid budget){Colors.END}")
    
    try:
        payload = {
            "skin_type": "oily",
            "concerns": ["acne", "oily"],
            "budget": "mid"
        }
        response = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
        
        if response.status_code != 200:
            log_test("POST /api/finder returns 200", False, f"Got status {response.status_code}")
            print(f"Response: {response.text}")
            return 1
        
        data = response.json()
        log_test("POST /api/finder returns 200", True, f"Status: {response.status_code}")
        
        # Check routine structure
        test_results.append(log_test("Response has 'routine' key", 'routine' in data, f"Keys: {list(data.keys())}"))
        
        if 'routine' not in data:
            print(f"{Colors.RED}CRITICAL: No 'routine' key in response. Cannot continue.{Colors.END}")
            return 1
        
        routine = data['routine']
        test_results.append(log_test("Routine has 'morning' array", 'morning' in routine and isinstance(routine['morning'], list), f"Morning steps: {len(routine.get('morning', []))}"))
        test_results.append(log_test("Routine has 'evening' array", 'evening' in routine and isinstance(routine['evening'], list), f"Evening steps: {len(routine.get('evening', []))}"))
        
        # Check morning routine structure
        morning = routine.get('morning', [])
        if morning:
            print(f"\n{Colors.BLUE}Morning Routine ({len(morning)} steps):{Colors.END}")
            for step in morning:
                product = step.get('product', {})
                print(f"  {step.get('order')}. {step.get('category')} - {product.get('name', 'N/A')} ({product.get('slug', 'N/A')})")
            
            # Check morning routine order and categories
            expected_categories = ['cleanser', 'serum', 'moisturizer', 'sunscreen']
            morning_categories = [s.get('category') for s in morning]
            
            # Check that categories are in expected order (but not all may be present)
            test_results.append(log_test("Morning routine has sequential order", all(morning[i].get('order') == i+1 for i in range(len(morning))), f"Orders: {[s.get('order') for s in morning]}"))
            
            # Check each step has required fields
            for i, step in enumerate(morning):
                test_results.append(log_test(f"Morning step {i+1} has 'order' field", 'order' in step, f"Order: {step.get('order')}"))
                test_results.append(log_test(f"Morning step {i+1} has 'category' field", 'category' in step, f"Category: {step.get('category')}"))
                test_results.append(log_test(f"Morning step {i+1} has 'product' object", 'product' in step and isinstance(step['product'], dict), f"Product keys: {list(step.get('product', {}).keys())}"))
                
                product = step.get('product', {})
                test_results.append(log_test(f"Morning step {i+1} product has 'score'", 'score' in product, f"Score: {product.get('score')}"))
                test_results.append(log_test(f"Morning step {i+1} product has 'match_percent'", 'match_percent' in product, f"Match: {product.get('match_percent')}%"))
                
                if 'match_percent' in product:
                    match_pct = product['match_percent']
                    test_results.append(log_test(f"Morning step {i+1} match_percent in range 5-99", 5 <= match_pct <= 99, f"Match: {match_pct}%"))
                
                test_results.append(log_test(f"Morning step {i+1} product has 'name'", 'name' in product, f"Name: {product.get('name', 'N/A')}"))
                test_results.append(log_test(f"Morning step {i+1} product has 'price_eur'", 'price_eur' in product, f"Price: {product.get('price_eur')}€"))
                test_results.append(log_test(f"Morning step {i+1} product has 'slug'", 'slug' in product, f"Slug: {product.get('slug', 'N/A')}"))
            
            # Check if sunscreen is present in morning routine
            has_sunscreen = any(s.get('category') == 'sunscreen' for s in morning)
            test_results.append(log_test("Morning routine includes sunscreen", has_sunscreen, "Sunscreen present in morning"))
        
        # Check evening routine structure
        evening = routine.get('evening', [])
        if evening:
            print(f"\n{Colors.BLUE}Evening Routine ({len(evening)} steps):{Colors.END}")
            for step in evening:
                product = step.get('product', {})
                print(f"  {step.get('order')}. {step.get('category')} - {product.get('name', 'N/A')} ({product.get('slug', 'N/A')})")
            
            # Check evening routine order
            test_results.append(log_test("Evening routine has sequential order", all(evening[i].get('order') == i+1 for i in range(len(evening))), f"Orders: {[s.get('order') for s in evening]}"))
            
            # Check NO sunscreen in evening
            has_sunscreen_evening = any(s.get('category') == 'sunscreen' for s in evening)
            test_results.append(log_test("Evening routine has NO sunscreen", not has_sunscreen_evening, "No sunscreen in evening"))
            
            # Check each step has required fields
            for i, step in enumerate(evening):
                test_results.append(log_test(f"Evening step {i+1} has 'order' field", 'order' in step, f"Order: {step.get('order')}"))
                test_results.append(log_test(f"Evening step {i+1} has 'category' field", 'category' in step, f"Category: {step.get('category')}"))
                test_results.append(log_test(f"Evening step {i+1} has 'product' object", 'product' in step and isinstance(step['product'], dict), f"Product keys: {list(step.get('product', {}).keys())}"))
        
        # Check if evening serum differs from morning serum when 2+ serums exist
        morning_serums = [s.get('product', {}).get('slug') for s in morning if s.get('category') == 'serum']
        evening_serums = [s.get('product', {}).get('slug') for s in evening if s.get('category') == 'serum']
        
        if morning_serums and evening_serums:
            print(f"\n{Colors.BLUE}Serum Comparison:{Colors.END}")
            print(f"  Morning serum: {morning_serums[0]}")
            print(f"  Evening serum: {evening_serums[0]}")
            
            # Check if they differ (when 2+ serums exist in DB, they should differ)
            # Note: We know from seed data there are at least 3 serums
            serums_differ = morning_serums[0] != evening_serums[0]
            test_results.append(log_test("Evening serum differs from morning serum", serums_differ, f"Morning: {morning_serums[0]}, Evening: {evening_serums[0]}"))
        
        # Check cleanser and moisturizer are the same in morning and evening
        morning_cleanser = [s.get('product', {}).get('slug') for s in morning if s.get('category') == 'cleanser']
        evening_cleanser = [s.get('product', {}).get('slug') for s in evening if s.get('category') == 'cleanser']
        
        if morning_cleanser and evening_cleanser:
            test_results.append(log_test("Morning and evening cleanser are the same", morning_cleanser[0] == evening_cleanser[0], f"Cleanser: {morning_cleanser[0]}"))
        
        morning_moisturizer = [s.get('product', {}).get('slug') for s in morning if s.get('category') == 'moisturizer']
        evening_moisturizer = [s.get('product', {}).get('slug') for s in evening if s.get('category') == 'moisturizer']
        
        if morning_moisturizer and evening_moisturizer:
            test_results.append(log_test("Morning and evening moisturizer are the same", morning_moisturizer[0] == evening_moisturizer[0], f"Moisturizer: {morning_moisturizer[0]}"))
        
        # Check alternatives array
        test_results.append(log_test("Response has 'alternatives' array", 'alternatives' in data and isinstance(data['alternatives'], list), f"Alternatives: {len(data.get('alternatives', []))}"))
        
        alternatives = data.get('alternatives', [])
        if alternatives:
            test_results.append(log_test("Alternatives max 4 items", len(alternatives) <= 4, f"Found {len(alternatives)} alternatives"))
            
            # Check alternatives are NOT in routine
            routine_slugs = set()
            for step in morning + evening:
                routine_slugs.add(step.get('product', {}).get('slug'))
            
            alternatives_in_routine = [alt.get('slug') for alt in alternatives if alt.get('slug') in routine_slugs]
            test_results.append(log_test("Alternatives NOT in routine", len(alternatives_in_routine) == 0, f"Alternatives in routine: {alternatives_in_routine}"))
            
            # Check each alternative has match_percent
            for i, alt in enumerate(alternatives):
                test_results.append(log_test(f"Alternative {i+1} has 'match_percent'", 'match_percent' in alt, f"Match: {alt.get('match_percent')}%"))
        
        # Check legacy compatibility: results array and total
        test_results.append(log_test("Response has 'results' array (legacy compat)", 'results' in data and isinstance(data['results'], list), f"Results: {len(data.get('results', []))}"))
        test_results.append(log_test("Response has 'total' field (legacy compat)", 'total' in data, f"Total: {data.get('total')}"))
        
        results = data.get('results', [])
        if results:
            test_results.append(log_test("Results max 6 items", len(results) <= 6, f"Found {len(results)} results"))
            test_results.append(log_test("Results sorted by score desc", all(results[i].get('score', 0) >= results[i+1].get('score', 0) for i in range(len(results)-1)), "Checking sort order"))
        
    except Exception as e:
        log_test("POST /api/finder test", False, f"Error: {str(e)}")
        return 1
    
    # ========== TEST 2: Dry skin profile with low budget ==========
    print(f"\n{Colors.YELLOW}[2] Testing Dry Skin Profile (low budget){Colors.END}")
    
    try:
        payload = {
            "skin_type": "dry",
            "concerns": ["dryness", "sensitive"],
            "budget": "low"
        }
        response = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
        
        if response.status_code != 200:
            log_test("POST /api/finder (dry skin) returns 200", False, f"Got status {response.status_code}")
        else:
            data = response.json()
            log_test("POST /api/finder (dry skin) returns 200", True, f"Status: {response.status_code}")
            
            routine = data.get('routine', {})
            morning = routine.get('morning', [])
            evening = routine.get('evening', [])
            
            print(f"  Morning steps: {len(morning)}, Evening steps: {len(evening)}")
            
            # Check that products make sense for dry skin
            test_results.append(log_test("Dry skin profile returns routine", len(morning) > 0 or len(evening) > 0, f"Morning: {len(morning)}, Evening: {len(evening)}"))
            
            # Check that highest scored products per category are selected
            if morning:
                for step in morning:
                    product = step.get('product', {})
                    print(f"  {step.get('category')}: {product.get('name')} (score: {product.get('score')})")
    
    except Exception as e:
        log_test("POST /api/finder (dry skin) test", False, f"Error: {str(e)}")
    
    # ========== TEST 3: Normal skin profile with high budget ==========
    print(f"\n{Colors.YELLOW}[3] Testing Normal Skin Profile (high budget){Colors.END}")
    
    try:
        payload = {
            "skin_type": "normal",
            "concerns": ["aging"],
            "budget": "high"
        }
        response = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
        
        if response.status_code != 200:
            log_test("POST /api/finder (normal skin) returns 200", False, f"Got status {response.status_code}")
        else:
            data = response.json()
            log_test("POST /api/finder (normal skin) returns 200", True, f"Status: {response.status_code}")
            
            routine = data.get('routine', {})
            morning = routine.get('morning', [])
            evening = routine.get('evening', [])
            
            print(f"  Morning steps: {len(morning)}, Evening steps: {len(evening)}")
            
            test_results.append(log_test("Normal skin profile returns routine", len(morning) > 0 or len(evening) > 0, f"Morning: {len(morning)}, Evening: {len(evening)}"))
            
            if morning:
                for step in morning:
                    product = step.get('product', {})
                    print(f"  {step.get('category')}: {product.get('name')} (score: {product.get('score')})")
    
    except Exception as e:
        log_test("POST /api/finder (normal skin) test", False, f"Error: {str(e)}")
    
    # ========== TEST 4: Edge case - empty body ==========
    print(f"\n{Colors.YELLOW}[4] Testing Edge Case - Empty Body{Colors.END}")
    
    try:
        payload = {}
        response = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
        
        if response.status_code != 200:
            log_test("POST /api/finder with empty body returns 200", False, f"Got status {response.status_code}")
        else:
            data = response.json()
            log_test("POST /api/finder with empty body returns 200", True, f"Status: {response.status_code}")
            
            # Should still return a routine (no crash)
            test_results.append(log_test("Empty body returns routine structure", 'routine' in data, f"Keys: {list(data.keys())}"))
            
            routine = data.get('routine', {})
            morning = routine.get('morning', [])
            evening = routine.get('evening', [])
            
            print(f"  Morning steps: {len(morning)}, Evening steps: {len(evening)}")
            test_results.append(log_test("Empty body does not crash", True, "Endpoint handled empty body gracefully"))
    
    except Exception as e:
        log_test("POST /api/finder with empty body", False, f"Error: {str(e)}")
    
    # ========== TEST 5: Quick regression - GET /api/products ==========
    print(f"\n{Colors.YELLOW}[5] Quick Regression - GET /api/products{Colors.END}")
    
    try:
        response = requests.get(f"{BASE_URL}/products", timeout=10)
        
        if response.status_code != 200:
            log_test("GET /api/products returns 200", False, f"Got status {response.status_code}")
        else:
            data = response.json()
            products = data.get('products', [])
            
            log_test("GET /api/products returns 200", True, f"Status: {response.status_code}")
            test_results.append(log_test("Products count >= 12 (no reseed duplicates)", len(products) >= 12, f"Found {len(products)} products"))
            
            # Check for duplicates by slug
            slugs = [p.get('slug') for p in products]
            unique_slugs = set(slugs)
            test_results.append(log_test("No duplicate product slugs", len(slugs) == len(unique_slugs), f"Total: {len(slugs)}, Unique: {len(unique_slugs)}"))
    
    except Exception as e:
        log_test("GET /api/products regression test", False, f"Error: {str(e)}")
    
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
        print(f"{Colors.GREEN}✓ All finder v2 tests passed!{Colors.END}\n")
        return 0
    else:
        print(f"{Colors.YELLOW}⚠ Some tests failed. Review the output above.{Colors.END}\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
