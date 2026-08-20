#!/usr/bin/env python3
"""
Backend API Testing Script for Phase A (Conversion) - Dermalyze
Tests multi-vertical finder, avoid_ingredients, newsletter, tracking, admin endpoints, and regressions
"""

import requests
import json
import sys

# Base URL from environment
BASE_URL = "https://58265ec0-e6bb-4222-ae39-6cd7feac918f.preview.emergentagent.com/api"
ADMIN_PASSWORD = "admin123"

# Test counters
tests_passed = 0
tests_failed = 0
test_results = []

def log_test(name, passed, details=""):
    """Log test result"""
    global tests_passed, tests_failed
    if passed:
        tests_passed += 1
        print(f"✓ PASS: {name}")
        if details:
            print(f"  → {details}")
    else:
        tests_failed += 1
        print(f"✗ FAIL: {name}")
        if details:
            print(f"  → {details}")
    test_results.append({"name": name, "passed": passed, "details": details})

def get_admin_token():
    """Get admin Bearer token"""
    try:
        response = requests.post(f"{BASE_URL}/admin/login", json={"password": ADMIN_PASSWORD}, timeout=10)
        if response.status_code == 200:
            return response.json().get("token")
        return None
    except Exception as e:
        print(f"Error getting admin token: {e}")
        return None

print("=" * 80)
print("PHASE A (CONVERSION) BACKEND TESTING")
print("=" * 80)
print(f"Base URL: {BASE_URL}")
print()

# ============================================================================
# TEST 1: Multi-vertical finder - HAIR
# ============================================================================
print("\n" + "=" * 80)
print("TEST 1: Multi-vertical finder - HAIR")
print("=" * 80)

try:
    payload = {"concerns": ["hair-loss"], "budget": "high", "vertical": "hair"}
    response = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        routine = data.get("routine", {})
        sections = routine.get("sections", [])
        
        # Check sections length is 1
        if len(sections) == 1:
            log_test("Hair finder returns 1 section", True, f"sections length: {len(sections)}")
        else:
            log_test("Hair finder returns 1 section", False, f"Expected 1 section, got {len(sections)}")
        
        # Check section id is "routine"
        if sections and sections[0].get("id") == "routine":
            log_test("Hair section id is 'routine'", True)
        else:
            log_test("Hair section id is 'routine'", False, f"Got id: {sections[0].get('id') if sections else 'N/A'}")
        
        # Check step categories
        if sections:
            steps = sections[0].get("steps", [])
            valid_categories = {"shampoo", "conditioner", "hair-treatment", "scalp-serum"}
            step_categories = [step.get("category") for step in steps]
            all_valid = all(cat in valid_categories for cat in step_categories)
            
            if all_valid:
                log_test("Hair step categories valid", True, f"Categories: {step_categories}")
            else:
                log_test("Hair step categories valid", False, f"Invalid categories found: {step_categories}")
            
            # Check all products have vertical="hair"
            all_hair = all(step.get("product", {}).get("vertical") == "hair" for step in steps)
            if all_hair:
                log_test("All hair products have vertical='hair'", True)
            else:
                verticals = [step.get("product", {}).get("vertical") for step in steps]
                log_test("All hair products have vertical='hair'", False, f"Found verticals: {verticals}")
        
        # Check alternatives array present
        alternatives = data.get("alternatives", [])
        if isinstance(alternatives, list):
            log_test("Hair finder has alternatives array", True, f"alternatives count: {len(alternatives)}")
        else:
            log_test("Hair finder has alternatives array", False, "alternatives not an array")
    else:
        log_test("Hair finder API call", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Hair finder API call", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 2: Multi-vertical finder - WELLNESS
# ============================================================================
print("\n" + "=" * 80)
print("TEST 2: Multi-vertical finder - WELLNESS")
print("=" * 80)

try:
    payload = {"concerns": ["sleep"], "budget": "high", "vertical": "wellness"}
    response = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        routine = data.get("routine", {})
        sections = routine.get("sections", [])
        
        # Check sections length is 1
        if len(sections) == 1:
            log_test("Wellness finder returns 1 section", True)
        else:
            log_test("Wellness finder returns 1 section", False, f"Expected 1, got {len(sections)}")
        
        # Check section id is "routine"
        if sections and sections[0].get("id") == "routine":
            log_test("Wellness section id is 'routine'", True)
        else:
            log_test("Wellness section id is 'routine'", False, f"Got: {sections[0].get('id') if sections else 'N/A'}")
        
        # Check step categories
        if sections:
            steps = sections[0].get("steps", [])
            valid_categories = {"supplement", "tea", "bath-body"}
            step_categories = [step.get("category") for step in steps]
            all_valid = all(cat in valid_categories for cat in step_categories)
            
            if all_valid:
                log_test("Wellness step categories valid", True, f"Categories: {step_categories}")
            else:
                log_test("Wellness step categories valid", False, f"Invalid: {step_categories}")
            
            # Check all products have vertical="wellness"
            all_wellness = all(step.get("product", {}).get("vertical") == "wellness" for step in steps)
            if all_wellness:
                log_test("All wellness products have vertical='wellness'", True)
            else:
                verticals = [step.get("product", {}).get("vertical") for step in steps]
                log_test("All wellness products have vertical='wellness'", False, f"Found: {verticals}")
    else:
        log_test("Wellness finder API call", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Wellness finder API call", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 3: Multi-vertical finder - SKINCARE (with legacy fields)
# ============================================================================
print("\n" + "=" * 80)
print("TEST 3: Multi-vertical finder - SKINCARE (with legacy fields)")
print("=" * 80)

try:
    payload = {"skin_type": "oily", "concerns": ["acne"], "budget": "mid", "vertical": "skincare"}
    response = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        routine = data.get("routine", {})
        sections = routine.get("sections", [])
        
        # Check sections has 2 sections (morning & evening)
        if len(sections) == 2:
            log_test("Skincare finder returns 2 sections", True, f"sections: {len(sections)}")
        else:
            log_test("Skincare finder returns 2 sections", False, f"Expected 2, got {len(sections)}")
        
        # Check section ids are morning and evening
        section_ids = [s.get("id") for s in sections]
        if "morning" in section_ids and "evening" in section_ids:
            log_test("Skincare sections have morning & evening ids", True)
        else:
            log_test("Skincare sections have morning & evening ids", False, f"Got ids: {section_ids}")
        
        # Check legacy fields present
        has_morning = "morning" in routine and isinstance(routine["morning"], list)
        has_evening = "evening" in routine and isinstance(routine["evening"], list)
        has_warnings = "warnings" in routine and isinstance(routine["warnings"], dict)
        
        if has_morning:
            morning_steps = routine["morning"]
            log_test("Legacy routine.morning present", True, f"{len(morning_steps)} steps")
            
            # Check morning has 4 steps: cleanser→serum→moisturizer→sunscreen
            if len(morning_steps) == 4:
                categories = [s.get("category") for s in morning_steps]
                expected = ["cleanser", "serum", "moisturizer", "sunscreen"]
                if categories == expected:
                    log_test("Morning routine has correct 4 steps", True, f"Categories: {categories}")
                else:
                    log_test("Morning routine has correct 4 steps", False, f"Expected {expected}, got {categories}")
            else:
                log_test("Morning routine has 4 steps", False, f"Got {len(morning_steps)} steps")
        else:
            log_test("Legacy routine.morning present", False)
        
        if has_evening:
            evening_steps = routine["evening"]
            log_test("Legacy routine.evening present", True, f"{len(evening_steps)} steps")
            
            # Check evening has 3 steps (NO sunscreen)
            if len(evening_steps) == 3:
                categories = [s.get("category") for s in evening_steps]
                has_sunscreen = "sunscreen" in categories
                if not has_sunscreen:
                    log_test("Evening routine has NO sunscreen", True, f"Categories: {categories}")
                else:
                    log_test("Evening routine has NO sunscreen", False, f"Found sunscreen in: {categories}")
            else:
                log_test("Evening routine has 3 steps", False, f"Got {len(evening_steps)} steps")
        else:
            log_test("Legacy routine.evening present", False)
        
        if has_warnings:
            warnings = routine["warnings"]
            has_morning_warnings = "morning" in warnings and isinstance(warnings["morning"], list)
            has_evening_warnings = "evening" in warnings and isinstance(warnings["evening"], list)
            if has_morning_warnings and has_evening_warnings:
                log_test("Legacy routine.warnings present", True, f"morning: {len(warnings['morning'])}, evening: {len(warnings['evening'])}")
            else:
                log_test("Legacy routine.warnings present", False, f"Structure: {warnings}")
        else:
            log_test("Legacy routine.warnings present", False)
    else:
        log_test("Skincare finder API call", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Skincare finder API call", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 4: avoid_ingredients - retinol exclusion
# ============================================================================
print("\n" + "=" * 80)
print("TEST 4: avoid_ingredients - retinol exclusion")
print("=" * 80)

try:
    payload = {
        "skin_type": "normal",
        "concerns": ["aging"],
        "budget": "high",
        "vertical": "skincare",
        "avoid_ingredients": ["retinol"]
    }
    response = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        routine = data.get("routine", {})
        sections = routine.get("sections", [])
        alternatives = data.get("alternatives", [])
        results = data.get("results", [])
        
        # Collect all products from sections, alternatives, and results
        all_products = []
        
        # From sections
        for section in sections:
            for step in section.get("steps", []):
                product = step.get("product", {})
                if product:
                    all_products.append(product)
        
        # From alternatives
        for alt in alternatives:
            if alt:
                all_products.append(alt)
        
        # From results
        for result in results:
            if result:
                all_products.append(result)
        
        # Check if any product contains retinol
        products_with_retinol = []
        for product in all_products:
            ingredients = product.get("ingredients", [])
            if "retinol" in ingredients:
                products_with_retinol.append(product.get("slug", "unknown"))
        
        if len(products_with_retinol) == 0:
            log_test("No products contain retinol", True, f"Checked {len(all_products)} products")
        else:
            log_test("No products contain retinol", False, f"Found retinol in: {products_with_retinol}")
    else:
        log_test("avoid_ingredients retinol API call", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("avoid_ingredients retinol API call", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 5: avoid_ingredients - acide-salicylique exclusion
# ============================================================================
print("\n" + "=" * 80)
print("TEST 5: avoid_ingredients - acide-salicylique exclusion")
print("=" * 80)

try:
    payload = {
        "skin_type": "oily",
        "concerns": ["acne"],
        "budget": "mid",
        "vertical": "skincare",
        "avoid_ingredients": ["acide-salicylique"]
    }
    response = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        routine = data.get("routine", {})
        sections = routine.get("sections", [])
        alternatives = data.get("alternatives", [])
        results = data.get("results", [])
        
        # Collect all products
        all_products = []
        for section in sections:
            for step in section.get("steps", []):
                product = step.get("product", {})
                if product:
                    all_products.append(product)
        for alt in alternatives:
            if alt:
                all_products.append(alt)
        for result in results:
            if result:
                all_products.append(result)
        
        # Check if any product contains acide-salicylique
        products_with_salicylic = []
        for product in all_products:
            ingredients = product.get("ingredients", [])
            if "acide-salicylique" in ingredients:
                products_with_salicylic.append(product.get("slug", "unknown"))
        
        if len(products_with_salicylic) == 0:
            log_test("No products contain acide-salicylique", True, f"Checked {len(all_products)} products")
        else:
            log_test("No products contain acide-salicylique", False, f"Found in: {products_with_salicylic}")
    else:
        log_test("avoid_ingredients salicylic API call", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("avoid_ingredients salicylic API call", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 6: Newsletter - valid email
# ============================================================================
print("\n" + "=" * 80)
print("TEST 6: Newsletter - valid email")
print("=" * 80)

try:
    # Use unique email for testing
    test_email = "tester1@example.com"
    payload = {"email": test_email}
    response = requests.post(f"{BASE_URL}/newsletter", json=payload, timeout=10)
    
    if response.status_code == 201:
        data = response.json()
        if data.get("ok") == True and data.get("already") == False:
            log_test("Newsletter signup - first time", True, f"Response: {data}")
        else:
            log_test("Newsletter signup - first time", False, f"Expected ok:true, already:false, got: {data}")
    elif response.status_code == 200:
        # Email might already exist from previous test
        data = response.json()
        if data.get("ok") == True and data.get("already") == True:
            log_test("Newsletter signup - first time (already exists)", True, f"Email already in DB: {data}")
        else:
            log_test("Newsletter signup - first time", False, f"Status 200 but unexpected data: {data}")
    else:
        log_test("Newsletter signup - first time", False, f"Status: {response.status_code}, Body: {response.text}")
except Exception as e:
    log_test("Newsletter signup - first time", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 7: Newsletter - duplicate email
# ============================================================================
print("\n" + "=" * 80)
print("TEST 7: Newsletter - duplicate email")
print("=" * 80)

try:
    test_email = "tester1@example.com"
    payload = {"email": test_email}
    response = requests.post(f"{BASE_URL}/newsletter", json=payload, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        if data.get("ok") == True and data.get("already") == True:
            log_test("Newsletter signup - duplicate", True, f"Response: {data}")
        else:
            log_test("Newsletter signup - duplicate", False, f"Expected ok:true, already:true, got: {data}")
    else:
        log_test("Newsletter signup - duplicate", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Newsletter signup - duplicate", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 8: Newsletter - invalid email
# ============================================================================
print("\n" + "=" * 80)
print("TEST 8: Newsletter - invalid email")
print("=" * 80)

try:
    payload = {"email": "bad"}
    response = requests.post(f"{BASE_URL}/newsletter", json=payload, timeout=10)
    
    if response.status_code == 400:
        log_test("Newsletter invalid email returns 400", True, f"Response: {response.json()}")
    else:
        log_test("Newsletter invalid email returns 400", False, f"Expected 400, got: {response.status_code}")
except Exception as e:
    log_test("Newsletter invalid email returns 400", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 9: Tracking - affiliate click
# ============================================================================
print("\n" + "=" * 80)
print("TEST 9: Tracking - affiliate click")
print("=" * 80)

try:
    payload = {"type": "affiliate_click", "product_slug": "weleda-skin-food"}
    response = requests.post(f"{BASE_URL}/track", json=payload, timeout=10)
    
    if response.status_code == 201:
        data = response.json()
        if data.get("ok") == True:
            log_test("Tracking affiliate click", True, f"Response: {data}")
        else:
            log_test("Tracking affiliate click", False, f"Expected ok:true, got: {data}")
    else:
        log_test("Tracking affiliate click", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Tracking affiliate click", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 10: Admin - subscribers without auth
# ============================================================================
print("\n" + "=" * 80)
print("TEST 10: Admin - subscribers without auth")
print("=" * 80)

try:
    response = requests.get(f"{BASE_URL}/admin/subscribers", timeout=10)
    
    if response.status_code == 401:
        log_test("Admin subscribers without auth returns 401", True)
    else:
        log_test("Admin subscribers without auth returns 401", False, f"Expected 401, got: {response.status_code}")
except Exception as e:
    log_test("Admin subscribers without auth returns 401", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 11: Admin - get token and test subscribers
# ============================================================================
print("\n" + "=" * 80)
print("TEST 11: Admin - get token and test subscribers")
print("=" * 80)

admin_token = get_admin_token()
if admin_token:
    log_test("Admin login successful", True, f"Token: {admin_token[:20]}...")
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/subscribers", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "subscribers" in data and "total" in data:
                log_test("Admin subscribers with auth", True, f"Total: {data['total']}, Count: {len(data['subscribers'])}")
            else:
                log_test("Admin subscribers with auth", False, f"Missing fields: {data.keys()}")
        else:
            log_test("Admin subscribers with auth", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Admin subscribers with auth", False, f"Exception: {str(e)}")
else:
    log_test("Admin login successful", False, "Could not get token")

# ============================================================================
# TEST 12: Admin - stats includes subscribers and affiliate_clicks
# ============================================================================
print("\n" + "=" * 80)
print("TEST 12: Admin - stats includes subscribers and affiliate_clicks")
print("=" * 80)

if admin_token:
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            has_subscribers = "subscribers" in data and isinstance(data["subscribers"], (int, float))
            has_clicks = "affiliate_clicks" in data and isinstance(data["affiliate_clicks"], (int, float))
            
            if has_subscribers and has_clicks:
                log_test("Admin stats includes subscribers & affiliate_clicks", True, 
                        f"subscribers: {data['subscribers']}, affiliate_clicks: {data['affiliate_clicks']}")
            else:
                missing = []
                if not has_subscribers:
                    missing.append("subscribers")
                if not has_clicks:
                    missing.append("affiliate_clicks")
                log_test("Admin stats includes subscribers & affiliate_clicks", False, 
                        f"Missing fields: {missing}, Got: {list(data.keys())}")
            
            # Also check other expected fields
            expected_fields = ["products", "brands", "ingredients", "articles", "leads", "hubs"]
            all_present = all(field in data for field in expected_fields)
            if all_present:
                log_test("Admin stats has all expected fields", True, f"Fields: {list(data.keys())}")
            else:
                log_test("Admin stats has all expected fields", False, f"Got: {list(data.keys())}")
        else:
            log_test("Admin stats API call", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("Admin stats API call", False, f"Exception: {str(e)}")
else:
    log_test("Admin stats requires token", False, "No token available")

# ============================================================================
# TEST 13: Share-routine regression - POST finder
# ============================================================================
print("\n" + "=" * 80)
print("TEST 13: Share-routine regression - POST finder")
print("=" * 80)

saved_routine = None
saved_alternatives = None
saved_profile = None

try:
    payload = {"skin_type": "oily", "concerns": ["acne"], "budget": "mid", "vertical": "skincare"}
    response = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        saved_routine = data.get("routine")
        saved_alternatives = data.get("alternatives", [])
        saved_profile = {"skin_type": "oily", "concerns": ["acne"], "budget": "mid", "vertical": "skincare"}
        
        if saved_routine and "sections" in saved_routine:
            log_test("Finder returns routine with sections", True, f"sections count: {len(saved_routine['sections'])}")
        else:
            log_test("Finder returns routine with sections", False, f"routine: {saved_routine}")
    else:
        log_test("Finder API call for share-routine", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Finder API call for share-routine", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 14: Share-routine - POST /api/routines
# ============================================================================
print("\n" + "=" * 80)
print("TEST 14: Share-routine - POST /api/routines")
print("=" * 80)

routine_id = None

if saved_routine:
    try:
        payload = {
            "routine": saved_routine,
            "alternatives": saved_alternatives,
            "profile": saved_profile
        }
        response = requests.post(f"{BASE_URL}/routines", json=payload, timeout=10)
        
        if response.status_code == 201:
            data = response.json()
            routine_id = data.get("id")
            if routine_id and len(routine_id) == 10:
                log_test("POST /api/routines returns short id", True, f"id: {routine_id}")
            else:
                log_test("POST /api/routines returns short id", False, f"id: {routine_id}")
        else:
            log_test("POST /api/routines", False, f"Status: {response.status_code}, Body: {response.text}")
    except Exception as e:
        log_test("POST /api/routines", False, f"Exception: {str(e)}")
else:
    log_test("POST /api/routines", False, "No routine to save")

# ============================================================================
# TEST 15: Share-routine - GET /api/routines/:id
# ============================================================================
print("\n" + "=" * 80)
print("TEST 15: Share-routine - GET /api/routines/:id")
print("=" * 80)

if routine_id:
    try:
        response = requests.get(f"{BASE_URL}/routines/{routine_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            # Check structure
            has_id = "id" in data
            has_routine = "routine" in data
            has_alternatives = "alternatives" in data
            has_profile = "profile" in data
            has_created_at = "created_at" in data
            no_mongo_id = "_id" not in data
            
            if all([has_id, has_routine, has_alternatives, has_profile, has_created_at, no_mongo_id]):
                log_test("GET /api/routines/:id returns complete data", True, f"Fields: {list(data.keys())}")
            else:
                log_test("GET /api/routines/:id returns complete data", False, f"Fields: {list(data.keys())}")
            
            # Check routine has sections
            routine = data.get("routine", {})
            if "sections" in routine and isinstance(routine["sections"], list):
                log_test("Retrieved routine has sections", True, f"sections count: {len(routine['sections'])}")
            else:
                log_test("Retrieved routine has sections", False, f"routine keys: {list(routine.keys())}")
        else:
            log_test("GET /api/routines/:id", False, f"Status: {response.status_code}")
    except Exception as e:
        log_test("GET /api/routines/:id", False, f"Exception: {str(e)}")
else:
    log_test("GET /api/routines/:id", False, "No routine id to retrieve")

# ============================================================================
# TEST 16: Share-routine - POST empty body
# ============================================================================
print("\n" + "=" * 80)
print("TEST 16: Share-routine - POST empty body")
print("=" * 80)

try:
    response = requests.post(f"{BASE_URL}/routines", json={}, timeout=10)
    
    if response.status_code == 400:
        log_test("POST /api/routines with empty body returns 400", True)
    else:
        log_test("POST /api/routines with empty body returns 400", False, f"Expected 400, got: {response.status_code}")
except Exception as e:
    log_test("POST /api/routines with empty body returns 400", False, f"Exception: {str(e)}")

# ============================================================================
# TEST 17: Regression - GET /api/products returns 30 products
# ============================================================================
print("\n" + "=" * 80)
print("TEST 17: Regression - GET /api/products returns 30 products")
print("=" * 80)

try:
    response = requests.get(f"{BASE_URL}/products", timeout=10)
    
    if response.status_code == 200:
        data = response.json()
        products = data.get("products", [])
        if len(products) == 30:
            log_test("GET /api/products returns 30 products", True, f"Count: {len(products)}")
        else:
            log_test("GET /api/products returns 30 products", False, f"Expected 30, got: {len(products)}")
    else:
        log_test("GET /api/products", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("GET /api/products", False, f"Exception: {str(e)}")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 80)
print("TEST SUMMARY")
print("=" * 80)
print(f"Total tests: {tests_passed + tests_failed}")
print(f"Passed: {tests_passed}")
print(f"Failed: {tests_failed}")
print(f"Success rate: {(tests_passed / (tests_passed + tests_failed) * 100):.1f}%")
print("=" * 80)

# Exit with appropriate code
sys.exit(0 if tests_failed == 0 else 1)
