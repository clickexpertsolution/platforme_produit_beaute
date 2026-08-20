#!/usr/bin/env python3
"""
Backend API Test Suite for Dermalyze - Share Routine Feature
Tests POST /api/routines and GET /api/routines/:id endpoints
"""

import requests
import sys
from typing import Dict, Any

# Base URL from .env
BASE_URL = "https://58265ec0-e6bb-4222-ae39-6cd7feac918f.preview.emergentagent.com/api"

class TestRunner:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.saved_routine_id = None
    
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
    print("DERMALYZE - SHARE ROUTINE BACKEND API TESTS")
    print("="*60)
    
    # ============================================================
    # SCENARIO 1: END-TO-END HAPPY PATH
    # ============================================================
    print("\n[SCENARIO 1] End-to-End Happy Path")
    print("-" * 60)
    
    # Step 1: POST /api/finder to get a real routine
    print("\nStep 1: POST /api/finder to get routine...")
    finder_payload = {
        "skin_type": "oily",
        "concerns": ["acne"],
        "budget": "mid",
        "vertical": "skincare"
    }
    
    try:
        finder_resp = requests.post(f"{BASE_URL}/finder", json=finder_payload, timeout=10)
        runner.test(
            "POST /api/finder returns 200",
            finder_resp.status_code == 200,
            f"Expected 200, got {finder_resp.status_code}"
        )
        
        if finder_resp.status_code == 200:
            finder_data = finder_resp.json()
            
            # Verify routine structure
            runner.test(
                "Finder response has 'routine' key",
                'routine' in finder_data,
                f"Keys: {list(finder_data.keys())}"
            )
            
            if 'routine' in finder_data:
                routine = finder_data['routine']
                runner.test(
                    "Routine has 'morning' array",
                    'morning' in routine and isinstance(routine['morning'], list),
                    f"morning: {routine.get('morning')}"
                )
                runner.test(
                    "Routine has 'evening' array",
                    'evening' in routine and isinstance(routine['evening'], list),
                    f"evening: {routine.get('evening')}"
                )
                runner.test(
                    "Routine has 'warnings' object",
                    'warnings' in routine,
                    f"warnings: {routine.get('warnings')}"
                )
                
                # Verify morning routine structure
                if routine.get('morning'):
                    morning_step = routine['morning'][0]
                    runner.test(
                        "Morning step has 'order' field",
                        'order' in morning_step,
                        f"Step: {morning_step}"
                    )
                    runner.test(
                        "Morning step has 'category' field",
                        'category' in morning_step,
                        f"Step: {morning_step}"
                    )
                    runner.test(
                        "Morning step has 'product' object",
                        'product' in morning_step and isinstance(morning_step['product'], dict),
                        f"Step: {morning_step}"
                    )
                    
                    if 'product' in morning_step:
                        product = morning_step['product']
                        runner.test(
                            "Product has required fields (name, slug, price_eur)",
                            all(k in product for k in ['name', 'slug', 'price_eur']),
                            f"Product keys: {list(product.keys())}"
                        )
                
                # Verify evening routine structure
                if routine.get('evening'):
                    evening_step = routine['evening'][0]
                    runner.test(
                        "Evening step has 'product' object",
                        'product' in evening_step and isinstance(evening_step['product'], dict),
                        f"Step: {evening_step}"
                    )
            
            runner.test(
                "Finder response has 'alternatives' array",
                'alternatives' in finder_data and isinstance(finder_data['alternatives'], list),
                f"alternatives: {finder_data.get('alternatives')}"
            )
            
            # Step 2: POST /api/routines to save the routine
            print("\nStep 2: POST /api/routines to save routine...")
            save_payload = {
                "routine": finder_data.get('routine'),
                "alternatives": finder_data.get('alternatives', []),
                "profile": {
                    "skin_type": "oily",
                    "concerns": ["acne"],
                    "budget": "mid"
                }
            }
            
            save_resp = requests.post(f"{BASE_URL}/routines", json=save_payload, timeout=10)
            runner.test(
                "POST /api/routines returns 201",
                save_resp.status_code == 201,
                f"Expected 201, got {save_resp.status_code}. Response: {save_resp.text}"
            )
            
            if save_resp.status_code == 201:
                save_data = save_resp.json()
                runner.test(
                    "Response has 'id' field",
                    'id' in save_data,
                    f"Response: {save_data}"
                )
                
                if 'id' in save_data:
                    routine_id = save_data['id']
                    runner.test(
                        "ID is a short string (~10 chars)",
                        isinstance(routine_id, str) and 8 <= len(routine_id) <= 12,
                        f"ID: {routine_id}, length: {len(routine_id)}"
                    )
                    
                    runner.saved_routine_id = routine_id
                    
                    # Step 3: GET /api/routines/:id to retrieve the saved routine
                    print(f"\nStep 3: GET /api/routines/{routine_id} to retrieve routine...")
                    get_resp = requests.get(f"{BASE_URL}/routines/{routine_id}", timeout=10)
                    runner.test(
                        "GET /api/routines/:id returns 200",
                        get_resp.status_code == 200,
                        f"Expected 200, got {get_resp.status_code}"
                    )
                    
                    if get_resp.status_code == 200:
                        retrieved_data = get_resp.json()
                        
                        # Verify NO _id field
                        runner.test(
                            "Response has NO '_id' field",
                            '_id' not in retrieved_data,
                            f"Found _id in response: {retrieved_data.get('_id')}"
                        )
                        
                        # Verify all expected fields
                        runner.test(
                            "Response has 'id' field",
                            'id' in retrieved_data,
                            f"Keys: {list(retrieved_data.keys())}"
                        )
                        runner.test(
                            "Response has 'routine' field",
                            'routine' in retrieved_data,
                            f"Keys: {list(retrieved_data.keys())}"
                        )
                        runner.test(
                            "Response has 'alternatives' field",
                            'alternatives' in retrieved_data,
                            f"Keys: {list(retrieved_data.keys())}"
                        )
                        runner.test(
                            "Response has 'profile' field",
                            'profile' in retrieved_data,
                            f"Keys: {list(retrieved_data.keys())}"
                        )
                        runner.test(
                            "Response has 'created_at' field",
                            'created_at' in retrieved_data,
                            f"Keys: {list(retrieved_data.keys())}"
                        )
                        
                        # Verify ID matches
                        runner.test(
                            "Retrieved ID matches saved ID",
                            retrieved_data.get('id') == routine_id,
                            f"Expected {routine_id}, got {retrieved_data.get('id')}"
                        )
                        
                        # Verify routine structure is preserved
                        if 'routine' in retrieved_data:
                            retrieved_routine = retrieved_data['routine']
                            runner.test(
                                "Retrieved routine has 'morning' array",
                                'morning' in retrieved_routine and isinstance(retrieved_routine['morning'], list),
                                f"morning: {retrieved_routine.get('morning')}"
                            )
                            runner.test(
                                "Retrieved routine has 'evening' array",
                                'evening' in retrieved_routine and isinstance(retrieved_routine['evening'], list),
                                f"evening: {retrieved_routine.get('evening')}"
                            )
                            
                            # Verify morning array has product objects
                            if retrieved_routine.get('morning'):
                                morning_count = len(retrieved_routine['morning'])
                                runner.test(
                                    f"Morning routine has {morning_count} steps",
                                    morning_count > 0,
                                    f"Morning: {retrieved_routine['morning']}"
                                )
                                
                                first_morning = retrieved_routine['morning'][0]
                                runner.test(
                                    "Morning step has product object with fields",
                                    'product' in first_morning and isinstance(first_morning['product'], dict),
                                    f"Step: {first_morning}"
                                )
                                
                                if 'product' in first_morning:
                                    product = first_morning['product']
                                    runner.test(
                                        "Product has NO '_id' field",
                                        '_id' not in product,
                                        f"Found _id in product: {product.get('_id')}"
                                    )
                            
                            # Verify evening array has product objects
                            if retrieved_routine.get('evening'):
                                evening_count = len(retrieved_routine['evening'])
                                runner.test(
                                    f"Evening routine has {evening_count} steps",
                                    evening_count > 0,
                                    f"Evening: {retrieved_routine['evening']}"
                                )
                                
                                first_evening = retrieved_routine['evening'][0]
                                runner.test(
                                    "Evening step has product object with fields",
                                    'product' in first_evening and isinstance(first_evening['product'], dict),
                                    f"Step: {first_evening}"
                                )
                        
                        # Verify profile matches
                        if 'profile' in retrieved_data:
                            profile = retrieved_data['profile']
                            runner.test(
                                "Profile skin_type matches",
                                profile.get('skin_type') == 'oily',
                                f"Expected 'oily', got {profile.get('skin_type')}"
                            )
                            runner.test(
                                "Profile concerns matches",
                                profile.get('concerns') == ['acne'],
                                f"Expected ['acne'], got {profile.get('concerns')}"
                            )
                            runner.test(
                                "Profile budget matches",
                                profile.get('budget') == 'mid',
                                f"Expected 'mid', got {profile.get('budget')}"
                            )
    
    except requests.exceptions.RequestException as e:
        runner.test("POST /api/finder request", False, str(e))
    
    # ============================================================
    # SCENARIO 2: VALIDATION TESTS
    # ============================================================
    print("\n[SCENARIO 2] Validation Tests")
    print("-" * 60)
    
    # Test 1: Empty body
    print("\nTest 1: POST /api/routines with empty body...")
    try:
        empty_resp = requests.post(f"{BASE_URL}/routines", json={}, timeout=10)
        runner.test(
            "Empty body returns 400",
            empty_resp.status_code == 400,
            f"Expected 400, got {empty_resp.status_code}"
        )
    except requests.exceptions.RequestException as e:
        runner.test("POST /api/routines with empty body", False, str(e))
    
    # Test 2: Missing routine field
    print("\nTest 2: POST /api/routines with missing routine...")
    try:
        missing_routine_resp = requests.post(
            f"{BASE_URL}/routines",
            json={"profile": {"skin_type": "oily"}},
            timeout=10
        )
        runner.test(
            "Missing routine returns 400",
            missing_routine_resp.status_code == 400,
            f"Expected 400, got {missing_routine_resp.status_code}"
        )
    except requests.exceptions.RequestException as e:
        runner.test("POST /api/routines with missing routine", False, str(e))
    
    # Test 3: Empty routine (no morning/evening arrays)
    print("\nTest 3: POST /api/routines with empty routine...")
    try:
        empty_routine_resp = requests.post(
            f"{BASE_URL}/routines",
            json={"routine": {"morning": [], "evening": []}},
            timeout=10
        )
        runner.test(
            "Empty routine (no steps) returns 400",
            empty_routine_resp.status_code == 400,
            f"Expected 400, got {empty_routine_resp.status_code}"
        )
    except requests.exceptions.RequestException as e:
        runner.test("POST /api/routines with empty routine", False, str(e))
    
    # ============================================================
    # SCENARIO 3: NOT FOUND TEST
    # ============================================================
    print("\n[SCENARIO 3] Not Found Test")
    print("-" * 60)
    
    print("\nTest: GET /api/routines/nonexistent-id-xyz...")
    try:
        notfound_resp = requests.get(f"{BASE_URL}/routines/nonexistent-id-xyz", timeout=10)
        runner.test(
            "Non-existent ID returns 404",
            notfound_resp.status_code == 404,
            f"Expected 404, got {notfound_resp.status_code}"
        )
        
        if notfound_resp.status_code == 404:
            notfound_data = notfound_resp.json()
            runner.test(
                "404 response has error message",
                'error' in notfound_data,
                f"Response: {notfound_data}"
            )
    except requests.exceptions.RequestException as e:
        runner.test("GET /api/routines/nonexistent", False, str(e))
    
    # ============================================================
    # SCENARIO 4: REGRESSION TESTS
    # ============================================================
    print("\n[SCENARIO 4] Regression Tests")
    print("-" * 60)
    
    # Test 1: POST /api/finder still works
    print("\nTest 1: POST /api/finder regression...")
    try:
        finder_regression_payload = {
            "skin_type": "dry",
            "concerns": ["aging", "dryness"],
            "budget": "high",
            "vertical": "skincare"
        }
        finder_reg_resp = requests.post(f"{BASE_URL}/finder", json=finder_regression_payload, timeout=10)
        runner.test(
            "POST /api/finder returns 200",
            finder_reg_resp.status_code == 200,
            f"Expected 200, got {finder_reg_resp.status_code}"
        )
        
        if finder_reg_resp.status_code == 200:
            finder_reg_data = finder_reg_resp.json()
            runner.test(
                "Finder returns routine with morning array",
                'routine' in finder_reg_data and 'morning' in finder_reg_data['routine'],
                f"Keys: {list(finder_reg_data.keys())}"
            )
            runner.test(
                "Finder returns routine with evening array",
                'routine' in finder_reg_data and 'evening' in finder_reg_data['routine'],
                f"Keys: {list(finder_reg_data.keys())}"
            )
            runner.test(
                "Finder returns routine with warnings",
                'routine' in finder_reg_data and 'warnings' in finder_reg_data['routine'],
                f"Keys: {list(finder_reg_data.keys())}"
            )
    except requests.exceptions.RequestException as e:
        runner.test("POST /api/finder regression", False, str(e))
    
    # Test 2: GET /api/products still returns 30 products
    print("\nTest 2: GET /api/products regression...")
    try:
        products_resp = requests.get(f"{BASE_URL}/products", timeout=10)
        runner.test(
            "GET /api/products returns 200",
            products_resp.status_code == 200,
            f"Expected 200, got {products_resp.status_code}"
        )
        
        if products_resp.status_code == 200:
            products_data = products_resp.json()
            runner.test(
                "Products response has 'products' array",
                'products' in products_data and isinstance(products_data['products'], list),
                f"Keys: {list(products_data.keys())}"
            )
            
            if 'products' in products_data:
                product_count = len(products_data['products'])
                runner.test(
                    "GET /api/products returns 30 products",
                    product_count == 30,
                    f"Expected 30, got {product_count}"
                )
    except requests.exceptions.RequestException as e:
        runner.test("GET /api/products regression", False, str(e))
    
    # ============================================================
    # SUMMARY
    # ============================================================
    runner.summary()

if __name__ == "__main__":
    main()
