#!/usr/bin/env python3
"""
Backend API Test Suite for Dermalyze V2 Catalog Expansion
Tests the 3-vertical catalog (skincare, hair, wellness) with 30 products, 11 brands, 24 ingredients
"""

import requests
import sys
from typing import Dict, Any

# Base URL from .env
BASE_URL = "https://c31ecce2-b7f5-4688-a9d9-6f7bdf63635f.preview.emergentagent.com/api"

class TestRunner:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.token = None
        self.test_product_id = None
    
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
    print("DERMALYZE V2 CATALOG EXPANSION - BACKEND API TESTS")
    print("="*60)
    
    # ============================================================
    # TEST 1: GET /api/products - 30 products with vertical field
    # ============================================================
    print("\n[TEST 1] GET /api/products - Total count and vertical field")
    try:
        resp = requests.get(f"{BASE_URL}/products", timeout=10)
        runner.test("Status 200", resp.status_code == 200, f"Got {resp.status_code}")
        
        if resp.status_code == 200:
            data = resp.json()
            products = data.get('products', [])
            
            runner.test("Total products = 30", len(products) == 30, f"Got {len(products)} products")
            
            # Check all products have vertical field
            all_have_vertical = all('vertical' in p for p in products)
            runner.test("All products have 'vertical' field", all_have_vertical)
            
            # Count by vertical
            skincare_count = sum(1 for p in products if p.get('vertical') == 'skincare')
            hair_count = sum(1 for p in products if p.get('vertical') == 'hair')
            wellness_count = sum(1 for p in products if p.get('vertical') == 'wellness')
            
            runner.test("Skincare products = 14", skincare_count == 14, f"Got {skincare_count}")
            runner.test("Hair products = 8", hair_count == 8, f"Got {hair_count}")
            runner.test("Wellness products = 8", wellness_count == 8, f"Got {wellness_count}")
    except Exception as e:
        runner.test("GET /api/products", False, str(e))
    
    # ============================================================
    # TEST 2: GET /api/products?vertical=hair - 8 hair products
    # ============================================================
    print("\n[TEST 2] GET /api/products?vertical=hair")
    try:
        resp = requests.get(f"{BASE_URL}/products?vertical=hair", timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            products = data.get('products', [])
            
            runner.test("Returns 8 products", len(products) == 8, f"Got {len(products)}")
            
            all_hair = all(p.get('vertical') == 'hair' for p in products)
            runner.test("All products are vertical=hair", all_hair)
    except Exception as e:
        runner.test("GET /api/products?vertical=hair", False, str(e))
    
    # ============================================================
    # TEST 3: GET /api/products?vertical=wellness - 8 wellness products
    # ============================================================
    print("\n[TEST 3] GET /api/products?vertical=wellness")
    try:
        resp = requests.get(f"{BASE_URL}/products?vertical=wellness", timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            products = data.get('products', [])
            
            runner.test("Returns 8 products", len(products) == 8, f"Got {len(products)}")
            
            all_wellness = all(p.get('vertical') == 'wellness' for p in products)
            runner.test("All products are vertical=wellness", all_wellness)
    except Exception as e:
        runner.test("GET /api/products?vertical=wellness", False, str(e))
    
    # ============================================================
    # TEST 4: GET /api/products?vertical=skincare - 14 skincare products
    # ============================================================
    print("\n[TEST 4] GET /api/products?vertical=skincare")
    try:
        resp = requests.get(f"{BASE_URL}/products?vertical=skincare", timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            products = data.get('products', [])
            
            runner.test("Returns 14 products", len(products) == 14, f"Got {len(products)}")
            
            all_skincare = all(p.get('vertical') == 'skincare' for p in products)
            runner.test("All products are vertical=skincare", all_skincare)
    except Exception as e:
        runner.test("GET /api/products?vertical=skincare", False, str(e))
    
    # ============================================================
    # TEST 5: Filter combinations
    # ============================================================
    print("\n[TEST 5] Filter combinations")
    
    # 5a: ?vertical=hair&concern=hair-loss
    try:
        resp = requests.get(f"{BASE_URL}/products?vertical=hair&concern=hair-loss", timeout=10)
        runner.test("?vertical=hair&concern=hair-loss - Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            products = data.get('products', [])
            
            # Should return alpecin products + weleda-huile-cheveux-romarin
            runner.test("Returns hair-loss products", len(products) >= 3, f"Got {len(products)}")
            
            all_correct = all(
                p.get('vertical') == 'hair' and 'hair-loss' in p.get('concerns', [])
                for p in products
            )
            runner.test("All are hair + hair-loss concern", all_correct)
            
            # Check for specific products mentioned in review_request
            slugs = [p.get('slug') for p in products]
            has_alpecin = any('alpecin' in slug for slug in slugs)
            has_weleda = 'weleda-huile-cheveux-romarin' in slugs
            runner.test("Includes alpecin products", has_alpecin)
            runner.test("Includes weleda-huile-cheveux-romarin", has_weleda)
    except Exception as e:
        runner.test("?vertical=hair&concern=hair-loss", False, str(e))
    
    # 5b: ?vertical=wellness&category=supplement
    try:
        resp = requests.get(f"{BASE_URL}/products?vertical=wellness&category=supplement", timeout=10)
        runner.test("?vertical=wellness&category=supplement - Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            products = data.get('products', [])
            
            runner.test("Returns 5 supplements", len(products) == 5, f"Got {len(products)}")
            
            all_correct = all(
                p.get('vertical') == 'wellness' and p.get('category') == 'supplement'
                for p in products
            )
            runner.test("All are wellness + supplement", all_correct)
    except Exception as e:
        runner.test("?vertical=wellness&category=supplement", False, str(e))
    
    # 5c: ?concern=sleep
    try:
        resp = requests.get(f"{BASE_URL}/products?concern=sleep", timeout=10)
        runner.test("?concern=sleep - Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            products = data.get('products', [])
            
            runner.test("Returns sleep products", len(products) >= 3, f"Got {len(products)}")
            
            all_have_sleep = all('sleep' in p.get('concerns', []) for p in products)
            runner.test("All have sleep concern", all_have_sleep)
            
            # Should be wellness products
            wellness_products = [p for p in products if p.get('vertical') == 'wellness']
            runner.test("Sleep products are wellness vertical", len(wellness_products) >= 3)
    except Exception as e:
        runner.test("?concern=sleep", False, str(e))
    
    # 5d: ?vertical=hair&category=shampoo
    try:
        resp = requests.get(f"{BASE_URL}/products?vertical=hair&category=shampoo", timeout=10)
        runner.test("?vertical=hair&category=shampoo - Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            products = data.get('products', [])
            
            runner.test("Returns 5 shampoos", len(products) == 5, f"Got {len(products)}")
            
            all_correct = all(
                p.get('vertical') == 'hair' and p.get('category') == 'shampoo'
                for p in products
            )
            runner.test("All are hair + shampoo", all_correct)
    except Exception as e:
        runner.test("?vertical=hair&category=shampoo", False, str(e))
    
    # ============================================================
    # TEST 6: GET /api/products/alpecin-caffeine-shampoo-c1
    # ============================================================
    print("\n[TEST 6] GET /api/products/alpecin-caffeine-shampoo-c1")
    try:
        resp = requests.get(f"{BASE_URL}/products/alpecin-caffeine-shampoo-c1", timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            product = resp.json()
            
            runner.test("Product has ingredient_details array", 'ingredient_details' in product)
            
            if 'ingredient_details' in product:
                ingredient_slugs = [ing.get('slug') for ing in product['ingredient_details']]
                runner.test("ingredient_details contains 'cafeine'", 'cafeine' in ingredient_slugs, 
                           f"Got: {ingredient_slugs}")
            
            runner.test("Product has brand object", 'brand' in product and isinstance(product['brand'], dict))
            
            if 'brand' in product and isinstance(product['brand'], dict):
                runner.test("Brand slug is 'alpecin'", product['brand'].get('slug') == 'alpecin',
                           f"Got: {product['brand'].get('slug')}")
    except Exception as e:
        runner.test("GET /api/products/alpecin-caffeine-shampoo-c1", False, str(e))
    
    # ============================================================
    # TEST 7: GET /api/brands - 11 brands with manufacturer & certifications
    # ============================================================
    print("\n[TEST 7] GET /api/brands - 11 brands with enriched fields")
    try:
        resp = requests.get(f"{BASE_URL}/brands", timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            brands = data.get('brands', [])
            
            runner.test("Total brands = 11", len(brands) == 11, f"Got {len(brands)}")
            
            # Check all brands have manufacturer and certifications
            all_have_manufacturer = all('manufacturer' in b for b in brands)
            runner.test("All brands have 'manufacturer' field", all_have_manufacturer)
            
            all_have_certifications = all('certifications' in b and isinstance(b['certifications'], list) 
                                         for b in brands)
            runner.test("All brands have 'certifications' array", all_have_certifications)
            
            # Check for new brands
            brand_slugs = [b.get('slug') for b in brands]
            new_brands = ['alpecin', 'schwarzkopf', 'doppelherz', 'kneipp', 'salus']
            for new_brand in new_brands:
                runner.test(f"New brand '{new_brand}' exists", new_brand in brand_slugs)
    except Exception as e:
        runner.test("GET /api/brands", False, str(e))
    
    # ============================================================
    # TEST 8: GET /api/brands/doppelherz - has products array
    # ============================================================
    print("\n[TEST 8] GET /api/brands/doppelherz")
    try:
        resp = requests.get(f"{BASE_URL}/brands/doppelherz", timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            brand = resp.json()
            
            runner.test("Brand has products array", 'products' in brand and isinstance(brand['products'], list))
            
            if 'products' in brand:
                products = brand['products']
                runner.test("Doppelherz has 3 products", len(products) == 3, f"Got {len(products)}")
                
                # All should be supplements
                all_supplements = all(p.get('category') == 'supplement' for p in products)
                runner.test("All doppelherz products are supplements", all_supplements)
    except Exception as e:
        runner.test("GET /api/brands/doppelherz", False, str(e))
    
    # ============================================================
    # TEST 9: GET /api/ingredients - 24 ingredients
    # ============================================================
    print("\n[TEST 9] GET /api/ingredients - 24 ingredients")
    try:
        resp = requests.get(f"{BASE_URL}/ingredients", timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            ingredients = data.get('ingredients', [])
            
            runner.test("Total ingredients = 24", len(ingredients) == 24, f"Got {len(ingredients)}")
    except Exception as e:
        runner.test("GET /api/ingredients", False, str(e))
    
    # ============================================================
    # TEST 10: GET /api/ingredients/melatonine - has regulatory fields
    # ============================================================
    print("\n[TEST 10] GET /api/ingredients/melatonine")
    try:
        resp = requests.get(f"{BASE_URL}/ingredients/melatonine", timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            ingredient = resp.json()
            
            runner.test("Has regulatory object", 'regulatory' in ingredient and isinstance(ingredient['regulatory'], dict))
            
            if 'regulatory' in ingredient:
                regulatory = ingredient['regulatory']
                runner.test("Has regulatory.fr", 'fr' in regulatory and isinstance(regulatory['fr'], str))
                runner.test("Has regulatory.en", 'en' in regulatory and isinstance(regulatory['en'], str))
    except Exception as e:
        runner.test("GET /api/ingredients/melatonine", False, str(e))
    
    # ============================================================
    # TEST 11: GET /api/ingredients/cafeine - products array includes alpecin
    # ============================================================
    print("\n[TEST 11] GET /api/ingredients/cafeine")
    try:
        resp = requests.get(f"{BASE_URL}/ingredients/cafeine", timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            ingredient = resp.json()
            
            runner.test("Has products array", 'products' in ingredient and isinstance(ingredient['products'], list))
            
            if 'products' in ingredient:
                products = ingredient['products']
                product_slugs = [p.get('slug') for p in products]
                
                has_alpecin = any('alpecin' in slug for slug in product_slugs)
                runner.test("Products array includes alpecin products", has_alpecin,
                           f"Got products: {product_slugs}")
    except Exception as e:
        runner.test("GET /api/ingredients/cafeine", False, str(e))
    
    # ============================================================
    # TEST 12: POST /api/finder with vertical=skincare
    # ============================================================
    print("\n[TEST 12] POST /api/finder with vertical=skincare")
    try:
        payload = {
            "skin_type": "oily",
            "concerns": ["acne"],
            "budget": "mid",
            "vertical": "skincare"
        }
        resp = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
        runner.test("Status 200", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            
            runner.test("Has routine object", 'routine' in data)
            
            if 'routine' in data:
                routine = data['routine']
                
                runner.test("Routine has morning array", 'morning' in routine and isinstance(routine['morning'], list))
                runner.test("Routine has evening array", 'evening' in routine and isinstance(routine['evening'], list))
                runner.test("Routine has warnings object", 'warnings' in routine)
                
                # Check morning routine structure
                if 'morning' in routine:
                    morning = routine['morning']
                    runner.test("Morning routine has steps", len(morning) > 0)
                    
                    if len(morning) > 0:
                        # Check for expected categories
                        categories = [step.get('category') for step in morning]
                        runner.test("Morning has cleanser", 'cleanser' in categories)
                        runner.test("Morning has serum", 'serum' in categories)
                        runner.test("Morning has moisturizer", 'moisturizer' in categories)
                        runner.test("Morning has sunscreen", 'sunscreen' in categories)
                        
                        # Check all products are skincare
                        all_skincare = all(
                            step.get('product', {}).get('vertical') == 'skincare'
                            for step in morning
                        )
                        runner.test("All morning products are vertical=skincare", all_skincare)
                        
                        # Check NO hair/wellness products
                        no_shampoo = all(step.get('category') != 'shampoo' for step in morning)
                        runner.test("Morning routine has NO shampoo", no_shampoo)
                
                # Check evening routine
                if 'evening' in routine:
                    evening = routine['evening']
                    runner.test("Evening routine has steps", len(evening) > 0)
                    
                    if len(evening) > 0:
                        # Check NO sunscreen in evening
                        categories = [step.get('category') for step in evening]
                        runner.test("Evening has NO sunscreen", 'sunscreen' not in categories)
                        
                        # Check all products are skincare
                        all_skincare = all(
                            step.get('product', {}).get('vertical') == 'skincare'
                            for step in evening
                        )
                        runner.test("All evening products are vertical=skincare", all_skincare)
            
            # Check results array
            runner.test("Has results array", 'results' in data and isinstance(data['results'], list))
            
            if 'results' in data:
                results = data['results']
                
                # All results should be skincare
                all_skincare = all(p.get('vertical') == 'skincare' for p in results)
                runner.test("All results are vertical=skincare", all_skincare)
                
                # Check NO hair/wellness products in results
                no_hair_wellness = all(
                    p.get('category') not in ['shampoo', 'conditioner', 'hair-treatment', 'scalp-serum', 
                                              'supplement', 'tea', 'bath-body']
                    for p in results
                )
                runner.test("Results have NO hair/wellness products", no_hair_wellness)
    except Exception as e:
        runner.test("POST /api/finder with vertical=skincare", False, str(e))
    
    # ============================================================
    # TEST 13: REGRESSIONS
    # ============================================================
    print("\n[TEST 13] Regression tests")
    
    # 13a: GET /api/compare
    try:
        resp = requests.get(f"{BASE_URL}/compare?a=weleda-skin-food&b=dr-hauschka-creme-jour-rose", timeout=10)
        runner.test("Compare endpoint works", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            runner.test("Compare has product a", 'a' in data)
            runner.test("Compare has product b", 'b' in data)
            runner.test("Compare has common_ingredients", 'common_ingredients' in data)
    except Exception as e:
        runner.test("GET /api/compare", False, str(e))
    
    # 13b: POST /api/leads
    try:
        payload = {
            "brand_name": "Test Brand GmbH",
            "email": "contact@testbrand.de",
            "contact_name": "Hans Mueller",
            "message": "Interested in partnership"
        }
        resp = requests.post(f"{BASE_URL}/leads", json=payload, timeout=10)
        runner.test("Leads endpoint works", resp.status_code == 201)
        
        if resp.status_code == 201:
            lead = resp.json()
            runner.test("Lead has id", 'id' in lead)
    except Exception as e:
        runner.test("POST /api/leads", False, str(e))
    
    # 13c: POST /api/admin/login
    try:
        payload = {"password": "admin123"}
        resp = requests.post(f"{BASE_URL}/admin/login", json=payload, timeout=10)
        runner.test("Admin login works", resp.status_code == 200)
        
        if resp.status_code == 200:
            data = resp.json()
            runner.test("Login returns token", 'token' in data)
            if 'token' in data:
                runner.token = data['token']
    except Exception as e:
        runner.test("POST /api/admin/login", False, str(e))
    
    # 13d: GET /api/admin/stats
    if runner.token:
        try:
            headers = {"Authorization": f"Bearer {runner.token}"}
            resp = requests.get(f"{BASE_URL}/admin/stats", headers=headers, timeout=10)
            runner.test("Admin stats works", resp.status_code == 200)
            
            if resp.status_code == 200:
                stats = resp.json()
                runner.test("Stats: products = 30", stats.get('products') == 30, f"Got {stats.get('products')}")
                runner.test("Stats: brands = 11", stats.get('brands') == 11, f"Got {stats.get('brands')}")
                runner.test("Stats: ingredients = 24", stats.get('ingredients') == 24, f"Got {stats.get('ingredients')}")
                runner.test("Stats: articles = 4", stats.get('articles') == 4, f"Got {stats.get('articles')}")
        except Exception as e:
            runner.test("GET /api/admin/stats", False, str(e))
    
    # 13e: Admin CRUD lifecycle on products
    if runner.token:
        headers = {"Authorization": f"Bearer {runner.token}"}
        
        # CREATE test product
        try:
            payload = {
                "slug": "test-product-v2-catalog",
                "name": "Test Product V2",
                "brand_slug": "eucerin",
                "brand_name": "Eucerin",
                "vertical": "skincare",
                "category": "serum",
                "price_eur": 19.99,
                "rating": 4.5,
                "image": "https://example.com/test.jpg",
                "german_made": True,
                "concerns": ["acne"],
                "skin_types": ["oily"],
                "ingredients": ["niacinamide"],
                "description": {"fr": "Test FR", "en": "Test EN"}
            }
            resp = requests.post(f"{BASE_URL}/admin/products", json=payload, headers=headers, timeout=10)
            runner.test("Admin CREATE product works", resp.status_code == 201)
            
            if resp.status_code == 201:
                product = resp.json()
                runner.test("Created product has id", 'id' in product)
                if 'id' in product:
                    runner.test_product_id = product['id']
        except Exception as e:
            runner.test("Admin CREATE product", False, str(e))
        
        # UPDATE test product
        if runner.test_product_id:
            try:
                payload = {"name": "Test Product V2 Updated"}
                resp = requests.put(f"{BASE_URL}/admin/products/{runner.test_product_id}", 
                                   json=payload, headers=headers, timeout=10)
                runner.test("Admin UPDATE product works", resp.status_code == 200)
            except Exception as e:
                runner.test("Admin UPDATE product", False, str(e))
        
        # DELETE test product (cleanup)
        if runner.test_product_id:
            try:
                resp = requests.delete(f"{BASE_URL}/admin/products/{runner.test_product_id}", 
                                      headers=headers, timeout=10)
                runner.test("Admin DELETE product works", resp.status_code == 200)
            except Exception as e:
                runner.test("Admin DELETE product", False, str(e))
        
        # 13f: Verify 401 without token
        try:
            resp = requests.get(f"{BASE_URL}/admin/stats", timeout=10)
            runner.test("Admin endpoints return 401 without token", resp.status_code == 401)
        except Exception as e:
            runner.test("Admin 401 check", False, str(e))
    
    # ============================================================
    # FINAL SUMMARY
    # ============================================================
    runner.summary()

if __name__ == "__main__":
    main()
