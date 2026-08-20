#!/usr/bin/env python3
"""
Backend API Test Suite for Dermalyze - Content Hubs (Étape 2)
Tests the 15 content hubs feature with SEED_VERSION=3
"""

import requests
import sys
from typing import Dict, Any

# Base URL from .env
BASE_URL = "https://share-my-day.preview.emergentagent.com/api"

class TestRunner:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.token = None
        self.test_hub_id = None
    
    def test(self, name: str, condition: bool, error_msg: str = ""):
        if condition:
            print(f"✓ {name}")
            self.passed += 1
        else:
            print(f"✗ {name}")
            if error_msg:
                print(f"  Error: {error_msg}")
            self.failed += 1
        return condition
    
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*60}")
        print(f"Test Results: {self.passed}/{total} passed")
        if self.failed > 0:
            print(f"FAILED: {self.failed} tests")
            sys.exit(1)
        else:
            print("SUCCESS: All tests passed!")
            sys.exit(0)

def main():
    runner = TestRunner()
    
    print("="*60)
    print("DERMALYZE ÉTAPE 2 - CONTENT HUBS BACKEND API TESTS")
    print("="*60)
    
    # ============================================================
    # TEST 1: GET /api/hubs - 15 hubs with correct structure
    # ============================================================
    print("\n[TEST 1] GET /api/hubs - 15 hubs total")
    try:
        resp = requests.get(f"{BASE_URL}/hubs", timeout=10)
        runner.test("Status 200", resp.status_code == 200, f"Got {resp.status_code}")
        
        if resp.status_code == 200:
            data = resp.json()
            hubs = data.get('hubs', [])
            
            runner.test("Total hubs = 15", len(hubs) == 15, f"Got {len(hubs)} hubs")
            
            # Count by vertical
            skincare_count = sum(1 for h in hubs if h.get('vertical') == 'skincare')
            hair_count = sum(1 for h in hubs if h.get('vertical') == 'hair')
            wellness_count = sum(1 for h in hubs if h.get('vertical') == 'wellness')
            
            runner.test("Skincare hubs = 6", skincare_count == 6, f"Got {skincare_count}")
            runner.test("Hair hubs = 4", hair_count == 4, f"Got {hair_count}")
            runner.test("Wellness hubs = 5", wellness_count == 5, f"Got {wellness_count}")
            
            # Check expected slugs
            expected_slugs = [
                'acne', 'sensitive', 'aging', 'dryness', 'oily', 'pigmentation',  # skincare
                'hair-loss', 'dandruff', 'dry-hair', 'sensitive-scalp',  # hair
                'sleep', 'stress', 'energy', 'digestion', 'immunity'  # wellness
            ]
            actual_slugs = [h.get('slug') for h in hubs]
            all_slugs_present = all(slug in actual_slugs for slug in expected_slugs)
            runner.test("All 15 expected slugs present", all_slugs_present, 
                       f"Missing: {set(expected_slugs) - set(actual_slugs)}")
            
            # Check structure of first hub
            if hubs:
                hub = hubs[0]
                runner.test("Hub has 'slug' field", 'slug' in hub)
                runner.test("Hub has 'vertical' field", 'vertical' in hub)
                runner.test("Hub has 'title' with fr/en", 
                           'title' in hub and 'fr' in hub.get('title', {}) and 'en' in hub.get('title', {}))
                runner.test("Hub has 'definition' with fr/en", 
                           'definition' in hub and 'fr' in hub.get('definition', {}) and 'en' in hub.get('definition', {}))
                runner.test("Hub has 'causes' with fr/en arrays", 
                           'causes' in hub and isinstance(hub.get('causes', {}).get('fr'), list) and isinstance(hub.get('causes', {}).get('en'), list))
                runner.test("Hub has 'mistakes' with fr/en arrays", 
                           'mistakes' in hub and isinstance(hub.get('mistakes', {}).get('fr'), list) and isinstance(hub.get('mistakes', {}).get('en'), list))
                runner.test("Hub has 'buying_guide' with fr/en arrays", 
                           'buying_guide' in hub and isinstance(hub.get('buying_guide', {}).get('fr'), list) and isinstance(hub.get('buying_guide', {}).get('en'), list))
                runner.test("Hub has 'key_ingredients' array", 
                           'key_ingredients' in hub and isinstance(hub.get('key_ingredients'), list))
                runner.test("Hub has 'faqs' array", 
                           'faqs' in hub and isinstance(hub.get('faqs'), list))
                
                # Check FAQ structure
                if hub.get('faqs'):
                    faq = hub['faqs'][0]
                    runner.test("FAQ has 'q' with fr/en", 
                               'q' in faq and 'fr' in faq.get('q', {}) and 'en' in faq.get('q', {}))
                    runner.test("FAQ has 'a' with fr/en", 
                               'a' in faq and 'fr' in faq.get('a', {}) and 'en' in faq.get('a', {}))
                    runner.test("Hub has 3 FAQs", len(hub['faqs']) == 3, f"Got {len(hub['faqs'])} FAQs")
    except Exception as e:
        runner.test("GET /api/hubs", False, str(e))
    
    # ============================================================
    # TEST 2: GET /api/hubs?vertical=hair - 4 hair hubs
    # ============================================================
    print("\n[TEST 2] GET /api/hubs?vertical=hair")
    try:
        resp = requests.get(f"{BASE_URL}/hubs?vertical=hair", timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            hubs = data.get('hubs', [])
            
            runner.test("Returns 4 hubs", len(hubs) == 4, f"Got {len(hubs)}")
            
            all_hair = all(h.get('vertical') == 'hair' for h in hubs)
            runner.test("All hubs are vertical=hair", all_hair)
            
            # Check expected hair slugs
            expected_hair_slugs = ['hair-loss', 'dandruff', 'dry-hair', 'sensitive-scalp']
            actual_slugs = [h.get('slug') for h in hubs]
            all_present = all(slug in actual_slugs for slug in expected_hair_slugs)
            runner.test("All hair concern slugs present", all_present)
    except Exception as e:
        runner.test("GET /api/hubs?vertical=hair", False, str(e))
    
    # ============================================================
    # TEST 3: GET /api/hubs/acne - Hub detail with products and ingredients
    # ============================================================
    print("\n[TEST 3] GET /api/hubs/acne - Hub detail with products")
    try:
        resp = requests.get(f"{BASE_URL}/hubs/acne", timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            hub = resp.json()
            
            runner.test("Hub slug is 'acne'", hub.get('slug') == 'acne')
            runner.test("Hub vertical is 'skincare'", hub.get('vertical') == 'skincare')
            runner.test("Hub has 'products' array", 'products' in hub and isinstance(hub.get('products'), list))
            runner.test("Hub has 'ingredient_details' array", 
                       'ingredient_details' in hub and isinstance(hub.get('ingredient_details'), list))
            
            # Check products
            products = hub.get('products', [])
            if products:
                runner.test("Products array is not empty", len(products) > 0)
                
                # All products should have 'acne' in concerns
                all_have_acne = all('acne' in p.get('concerns', []) for p in products)
                runner.test("All products have 'acne' in concerns", all_have_acne)
                
                # Check if sorted by rating desc
                ratings = [p.get('rating', 0) for p in products]
                is_sorted = all(ratings[i] >= ratings[i+1] for i in range(len(ratings)-1))
                runner.test("Products sorted by rating desc", is_sorted, f"Ratings: {ratings}")
            
            # Check ingredient_details
            ingredient_details = hub.get('ingredient_details', [])
            expected_ingredients = ['acide-salicylique', 'niacinamide', 'zinc-pca']
            actual_ingredient_slugs = [ing.get('slug') for ing in ingredient_details]
            
            runner.test("Has acide-salicylique ingredient", 'acide-salicylique' in actual_ingredient_slugs)
            runner.test("Has niacinamide ingredient", 'niacinamide' in actual_ingredient_slugs)
            runner.test("Has zinc-pca ingredient", 'zinc-pca' in actual_ingredient_slugs)
            
            # Check ingredient structure
            if ingredient_details:
                ing = ingredient_details[0]
                runner.test("Ingredient has 'slug' field", 'slug' in ing)
                runner.test("Ingredient has 'name' field", 'name' in ing)
                runner.test("Ingredient has 'description' field", 'description' in ing)
    except Exception as e:
        runner.test("GET /api/hubs/acne", False, str(e))
    
    # ============================================================
    # TEST 4: GET /api/hubs/sleep - Wellness hub with wellness products
    # ============================================================
    print("\n[TEST 4] GET /api/hubs/sleep - Wellness hub")
    try:
        resp = requests.get(f"{BASE_URL}/hubs/sleep", timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            hub = resp.json()
            
            runner.test("Hub slug is 'sleep'", hub.get('slug') == 'sleep')
            runner.test("Hub vertical is 'wellness'", hub.get('vertical') == 'wellness')
            
            # Check products
            products = hub.get('products', [])
            runner.test("Has products array", len(products) > 0, f"Got {len(products)} products")
            
            if products:
                # All products should have 'sleep' in concerns
                all_have_sleep = all('sleep' in p.get('concerns', []) for p in products)
                runner.test("All products have 'sleep' in concerns", all_have_sleep)
                
                # Check for expected wellness products
                product_slugs = [p.get('slug') for p in products]
                expected_products = ['doppelherz-melatonin-spray', 'kneipp-valeriane-nuit', 
                                   'kneipp-huile-bain-relax', 'salus-tisane-nuit-paisible']
                
                found_products = [slug for slug in expected_products if slug in product_slugs]
                runner.test(f"Found {len(found_products)}/4 expected wellness products", 
                           len(found_products) >= 3, f"Found: {found_products}")
            
            # Check ingredient_details
            ingredient_details = hub.get('ingredient_details', [])
            expected_ingredients = ['melatonine', 'valeriane', 'lavande']
            actual_ingredient_slugs = [ing.get('slug') for ing in ingredient_details]
            
            found_ingredients = [slug for slug in expected_ingredients if slug in actual_ingredient_slugs]
            runner.test(f"Found {len(found_ingredients)}/3 expected ingredients", 
                       len(found_ingredients) >= 2, f"Found: {found_ingredients}")
    except Exception as e:
        runner.test("GET /api/hubs/sleep", False, str(e))
    
    # ============================================================
    # TEST 5: GET /api/hubs/unknown-slug - 404 error
    # ============================================================
    print("\n[TEST 5] GET /api/hubs/unknown-slug - 404 error")
    try:
        resp = requests.get(f"{BASE_URL}/hubs/unknown-slug-xyz", timeout=10)
        runner.test("Status 404", resp.status_code == 404, f"Got {resp.status_code}")
    except Exception as e:
        runner.test("GET /api/hubs/unknown-slug", False, str(e))
    
    # ============================================================
    # TEST 6: Admin authentication
    # ============================================================
    print("\n[TEST 6] Admin authentication")
    try:
        resp = requests.post(f"{BASE_URL}/admin/login", 
                           json={"password": "admin123"}, 
                           timeout=10)
        runner.test("Login status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            runner.test("Response has 'token' field", 'token' in data)
            if 'token' in data:
                runner.token = data['token']
                runner.test("Token is not empty", len(runner.token) > 0)
    except Exception as e:
        runner.test("Admin login", False, str(e))
    
    # ============================================================
    # TEST 7: GET /api/admin/stats - includes hubs count
    # ============================================================
    print("\n[TEST 7] GET /api/admin/stats - includes hubs=15")
    if runner.token:
        try:
            headers = {"Authorization": f"Bearer {runner.token}"}
            resp = requests.get(f"{BASE_URL}/admin/stats", headers=headers, timeout=10)
            runner.test("Status 200", resp.status_code == 200)
            
            if resp.status_code == 200:
                stats = resp.json()
                runner.test("Stats has 'hubs' field", 'hubs' in stats)
                runner.test("Hubs count = 15", stats.get('hubs') == 15, f"Got {stats.get('hubs')}")
                runner.test("Products count = 30", stats.get('products') == 30, f"Got {stats.get('products')}")
                runner.test("Brands count = 11", stats.get('brands') == 11, f"Got {stats.get('brands')}")
                runner.test("Ingredients count = 24", stats.get('ingredients') == 24, f"Got {stats.get('ingredients')}")
        except Exception as e:
            runner.test("GET /api/admin/stats", False, str(e))
    else:
        runner.test("GET /api/admin/stats", False, "No token available")
    
    # ============================================================
    # TEST 8: Admin CRUD on hubs - POST (create)
    # ============================================================
    print("\n[TEST 8] POST /api/admin/hubs - Create test hub")
    if runner.token:
        try:
            headers = {"Authorization": f"Bearer {runner.token}"}
            test_hub = {
                "slug": "test-hub-xyz",
                "vertical": "skincare",
                "title": {"fr": "Test Hub FR", "en": "Test Hub EN"},
                "definition": {"fr": "Test definition FR", "en": "Test definition EN"},
                "causes": {"fr": ["Cause 1"], "en": ["Cause 1"]},
                "mistakes": {"fr": ["Mistake 1"], "en": ["Mistake 1"]},
                "buying_guide": {"fr": ["Guide 1"], "en": ["Guide 1"]},
                "key_ingredients": ["niacinamide"],
                "faqs": [
                    {"q": {"fr": "Question?", "en": "Question?"}, "a": {"fr": "Answer", "en": "Answer"}}
                ]
            }
            
            resp = requests.post(f"{BASE_URL}/admin/hubs", 
                               json=test_hub, 
                               headers=headers, 
                               timeout=10)
            runner.test("Create status 201", resp.status_code == 201, f"Got {resp.status_code}")
            
            if resp.status_code == 201:
                data = resp.json()
                runner.test("Response has 'id' field", 'id' in data)
                if 'id' in data:
                    runner.test_hub_id = data['id']
        except Exception as e:
            runner.test("POST /api/admin/hubs", False, str(e))
    else:
        runner.test("POST /api/admin/hubs", False, "No token available")
    
    # ============================================================
    # TEST 9: Admin CRUD - POST without token (401)
    # ============================================================
    print("\n[TEST 9] POST /api/admin/hubs without token - 401")
    try:
        test_hub = {
            "slug": "unauthorized-hub",
            "vertical": "skincare",
            "title": {"fr": "Test", "en": "Test"}
        }
        resp = requests.post(f"{BASE_URL}/admin/hubs", json=test_hub, timeout=10)
        runner.test("Status 401", resp.status_code == 401, f"Got {resp.status_code}")
    except Exception as e:
        runner.test("POST /api/admin/hubs without token", False, str(e))
    
    # ============================================================
    # TEST 10: Admin CRUD - PUT (update)
    # ============================================================
    print("\n[TEST 10] PUT /api/admin/hubs/:id - Update test hub")
    if runner.token and runner.test_hub_id:
        try:
            headers = {"Authorization": f"Bearer {runner.token}"}
            update_data = {
                "title": {"fr": "Updated Hub FR", "en": "Updated Hub EN"}
            }
            
            resp = requests.put(f"{BASE_URL}/admin/hubs/{runner.test_hub_id}", 
                              json=update_data, 
                              headers=headers, 
                              timeout=10)
            runner.test("Update status 200", resp.status_code == 200, f"Got {resp.status_code}")
        except Exception as e:
            runner.test("PUT /api/admin/hubs/:id", False, str(e))
    else:
        runner.test("PUT /api/admin/hubs/:id", False, "No token or hub ID available")
    
    # ============================================================
    # TEST 11: Admin CRUD - DELETE
    # ============================================================
    print("\n[TEST 11] DELETE /api/admin/hubs/:id - Delete test hub")
    if runner.token and runner.test_hub_id:
        try:
            headers = {"Authorization": f"Bearer {runner.token}"}
            resp = requests.delete(f"{BASE_URL}/admin/hubs/{runner.test_hub_id}", 
                                 headers=headers, 
                                 timeout=10)
            runner.test("Delete status 200", resp.status_code == 200, f"Got {resp.status_code}")
            
            # Verify hub count is back to 15
            resp = requests.get(f"{BASE_URL}/hubs", timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                hubs = data.get('hubs', [])
                runner.test("Hub count back to 15", len(hubs) == 15, f"Got {len(hubs)} hubs")
        except Exception as e:
            runner.test("DELETE /api/admin/hubs/:id", False, str(e))
    else:
        runner.test("DELETE /api/admin/hubs/:id", False, "No token or hub ID available")
    
    # ============================================================
    # REGRESSION TESTS
    # ============================================================
    print("\n[REGRESSION TESTS]")
    
    # Test products endpoint
    print("\n[REGRESSION 1] GET /api/products - still 30 products")
    try:
        resp = requests.get(f"{BASE_URL}/products", timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            products = data.get('products', [])
            runner.test("Products count = 30", len(products) == 30, f"Got {len(products)}")
    except Exception as e:
        runner.test("GET /api/products regression", False, str(e))
    
    # Test brands endpoint
    print("\n[REGRESSION 2] GET /api/brands - still 11 brands")
    try:
        resp = requests.get(f"{BASE_URL}/brands", timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            brands = data.get('brands', [])
            runner.test("Brands count = 11", len(brands) == 11, f"Got {len(brands)}")
    except Exception as e:
        runner.test("GET /api/brands regression", False, str(e))
    
    # Test ingredients endpoint
    print("\n[REGRESSION 3] GET /api/ingredients - still 24 ingredients")
    try:
        resp = requests.get(f"{BASE_URL}/ingredients", timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            ingredients = data.get('ingredients', [])
            runner.test("Ingredients count = 24", len(ingredients) == 24, f"Got {len(ingredients)}")
    except Exception as e:
        runner.test("GET /api/ingredients regression", False, str(e))
    
    # Test finder endpoint
    print("\n[REGRESSION 4] POST /api/finder - skincare-only routine")
    try:
        finder_request = {
            "skin_type": "oily",
            "concerns": ["acne"],
            "budget": "mid",
            "vertical": "skincare"
        }
        resp = requests.post(f"{BASE_URL}/finder", json=finder_request, timeout=10)
        runner.test("Finder status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            runner.test("Has 'routine' field", 'routine' in data)
            
            if 'routine' in data:
                routine = data['routine']
                runner.test("Routine has 'morning' array", 'morning' in routine)
                runner.test("Routine has 'evening' array", 'evening' in routine)
                
                # Check all products in routine are skincare
                all_products = []
                if 'morning' in routine:
                    all_products.extend([step.get('product', {}) for step in routine['morning']])
                if 'evening' in routine:
                    all_products.extend([step.get('product', {}) for step in routine['evening']])
                
                all_skincare = all(p.get('vertical') == 'skincare' for p in all_products if p)
                runner.test("All routine products are skincare", all_skincare)
    except Exception as e:
        runner.test("POST /api/finder regression", False, str(e))
    
    # ============================================================
    # SUMMARY
    # ============================================================
    runner.summary()

if __name__ == "__main__":
    main()
