#!/usr/bin/env python3
"""
Backend API Testing for Dermalyze - SEED_VERSION=4 Product Sheet Enrichment
Tests certifications, awards, and studies fields added to products and ingredients.
"""

import requests
import json
import sys
from typing import Dict, List, Any

# Base URL from environment
BASE_URL = "https://eddc6e9b-ad88-4b75-96c8-5fd66b9478e1.preview.emergentagent.com/api"
ADMIN_PASSWORD = "admin123"

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
    
    def add_pass(self, test_name: str):
        self.passed += 1
        print(f"✓ PASS: {test_name}")
    
    def add_fail(self, test_name: str, reason: str):
        self.failed += 1
        error_msg = f"✗ FAIL: {test_name} - {reason}"
        self.errors.append(error_msg)
        print(error_msg)
    
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*80}")
        print(f"TEST SUMMARY: {self.passed}/{total} passed ({self.failed} failed)")
        print(f"{'='*80}")
        if self.errors:
            print("\nFAILURES:")
            for error in self.errors:
                print(f"  {error}")
        return self.failed == 0

results = TestResults()

def test_api_call(method: str, endpoint: str, headers: Dict = None, json_data: Dict = None) -> tuple:
    """Make API call and return (status_code, response_data)"""
    try:
        url = f"{BASE_URL}{endpoint}"
        if method == "GET":
            resp = requests.get(url, headers=headers, timeout=30)
        elif method == "POST":
            resp = requests.post(url, headers=headers, json=json_data, timeout=30)
        else:
            return (0, {"error": f"Unsupported method: {method}"})
        
        try:
            data = resp.json()
        except Exception:
            data = {"error": "Invalid JSON response", "text": resp.text[:200]}
        
        return (resp.status_code, data)
    except Exception as e:
        return (0, {"error": str(e)})

print("="*80)
print("DERMALYZE API BACKEND TESTING - SEED_VERSION=4 ENRICHMENT")
print("="*80)
print(f"Base URL: {BASE_URL}")
print(f"Admin Password: {ADMIN_PASSWORD}")
print("="*80)

# ============================================================================
# TEST 1: Counts Regression
# ============================================================================
print("\n[TEST 1] Counts Regression - Products, Brands, Ingredients")

status, data = test_api_call("GET", "/products")
if status == 200 and "products" in data:
    products = data["products"]
    if len(products) == 30:
        results.add_pass("GET /api/products returns exactly 30 products")
    else:
        results.add_fail("GET /api/products count", f"Expected 30, got {len(products)}")
    
    # Check no _id field
    has_id = any("_id" in p for p in products)
    if not has_id:
        results.add_pass("Products have no _id field")
    else:
        results.add_fail("Products _id field", "Found _id in products")
else:
    results.add_fail("GET /api/products", f"Status {status}, data: {data}")

status, data = test_api_call("GET", "/brands")
if status == 200 and "brands" in data:
    brands = data["brands"]
    if len(brands) == 11:
        results.add_pass("GET /api/brands returns exactly 11 brands")
    else:
        results.add_fail("GET /api/brands count", f"Expected 11, got {len(brands)}")
    
    # Check no _id field
    has_id = any("_id" in b for b in brands)
    if not has_id:
        results.add_pass("Brands have no _id field")
    else:
        results.add_fail("Brands _id field", "Found _id in brands")
else:
    results.add_fail("GET /api/brands", f"Status {status}, data: {data}")

status, data = test_api_call("GET", "/ingredients")
if status == 200 and "ingredients" in data:
    ingredients = data["ingredients"]
    if len(ingredients) == 24:
        results.add_pass("GET /api/ingredients returns exactly 24 ingredients")
    else:
        results.add_fail("GET /api/ingredients count", f"Expected 24, got {len(ingredients)}")
    
    # Check no _id field
    has_id = any("_id" in i for i in ingredients)
    if not has_id:
        results.add_pass("Ingredients have no _id field")
    else:
        results.add_fail("Ingredients _id field", "Found _id in ingredients")
else:
    results.add_fail("GET /api/ingredients", f"Status {status}, data: {data}")

# ============================================================================
# TEST 2: Product Enrichment Fields (certifications, awards, studies)
# ============================================================================
print("\n[TEST 2] Product Enrichment - Every product has certifications, awards, studies")

status, data = test_api_call("GET", "/products")
if status == 200 and "products" in data:
    products = data["products"]
    all_have_certs = True
    all_have_awards = True
    all_have_studies = True
    
    for p in products:
        # Check certifications
        if "certifications" not in p or not isinstance(p["certifications"], list):
            all_have_certs = False
            results.add_fail(f"Product {p.get('slug', 'unknown')} certifications", "Missing or not array")
            break
        
        # Validate certification structure
        for cert in p["certifications"]:
            if not all(k in cert for k in ["name", "scope"]):
                results.add_fail(f"Product {p.get('slug')} certification structure", f"Missing fields: {cert}")
                all_have_certs = False
                break
            if not isinstance(cert["name"], dict) or "fr" not in cert["name"] or "en" not in cert["name"]:
                results.add_fail(f"Product {p.get('slug')} certification name", "name must have fr and en")
                all_have_certs = False
                break
            if cert["scope"] not in ["EU", "US", "global"]:
                results.add_fail(f"Product {p.get('slug')} certification scope", f"Invalid scope: {cert['scope']}")
                all_have_certs = False
                break
        
        # Check awards (array, may be empty)
        if "awards" not in p or not isinstance(p["awards"], list):
            all_have_awards = False
            results.add_fail(f"Product {p.get('slug')} awards", "Missing or not array")
            break
        
        # Validate award structure if not empty
        for award in p["awards"]:
            if not all(k in award for k in ["year", "title"]):
                results.add_fail(f"Product {p.get('slug')} award structure", f"Missing fields: {award}")
                all_have_awards = False
                break
            if not isinstance(award["title"], dict) or "fr" not in award["title"] or "en" not in award["title"]:
                results.add_fail(f"Product {p.get('slug')} award title", "title must have fr and en")
                all_have_awards = False
                break
        
        # Check studies
        if "studies" not in p or not isinstance(p["studies"], list) or len(p["studies"]) == 0:
            all_have_studies = False
            results.add_fail(f"Product {p.get('slug')} studies", "Missing, not array, or empty")
            break
        
        # Validate study structure
        for study in p["studies"]:
            if not all(k in study for k in ["title", "source", "year", "url"]):
                results.add_fail(f"Product {p.get('slug')} study structure", f"Missing fields: {study}")
                all_have_studies = False
                break
            if not isinstance(study["title"], dict) or "fr" not in study["title"] or "en" not in study["title"]:
                results.add_fail(f"Product {p.get('slug')} study title", "title must have fr and en")
                all_have_studies = False
                break
    
    if all_have_certs:
        results.add_pass("All products have valid certifications array with {name:{fr,en}, scope}")
    if all_have_awards:
        results.add_pass("All products have valid awards array (may be empty) with {year, title:{fr,en}}")
    if all_have_studies:
        results.add_pass("All products have valid studies array with {title:{fr,en}, source, year, url}")

# ============================================================================
# TEST 3: Award Label - High-rated product with specific award
# ============================================================================
print("\n[TEST 3] Award Label - High-rated product has 'Label 2026 — Meilleur produit certifié'")

status, data = test_api_call("GET", "/products")
if status == 200 and "products" in data:
    products = data["products"]
    
    # Find eucerin-hyaluron-filler-serum (rating 4.6)
    target_product = None
    for p in products:
        if p.get("slug") == "eucerin-hyaluron-filler-serum":
            target_product = p
            break
    
    if target_product:
        # Check rating
        if target_product.get("rating", 0) >= 4.6:
            results.add_pass("eucerin-hyaluron-filler-serum has rating >= 4.6")
        else:
            results.add_fail("eucerin-hyaluron-filler-serum rating", f"Expected >= 4.6, got {target_product.get('rating')}")
        
        # Check award
        awards = target_product.get("awards", [])
        has_label = False
        for award in awards:
            if award.get("title", {}).get("fr") == "Label 2026 — Meilleur produit certifié":
                has_label = True
                results.add_pass("eucerin-hyaluron-filler-serum has award 'Label 2026 — Meilleur produit certifié'")
                break
        
        if not has_label:
            results.add_fail("eucerin-hyaluron-filler-serum award", f"Missing 'Label 2026 — Meilleur produit certifié', awards: {awards}")
        
        # Check certifications include US scope
        certs = target_product.get("certifications", [])
        has_us = any(c.get("scope") == "US" for c in certs)
        if has_us:
            results.add_pass("eucerin-hyaluron-filler-serum has certification with scope 'US'")
        else:
            results.add_fail("eucerin-hyaluron-filler-serum US certification", f"No US scope found, certs: {certs}")
    else:
        results.add_fail("eucerin-hyaluron-filler-serum", "Product not found")

# ============================================================================
# TEST 4: Product Detail - eucerin-hyaluron-filler-serum
# ============================================================================
print("\n[TEST 4] Product Detail - eucerin-hyaluron-filler-serum enrichment")

status, data = test_api_call("GET", "/products/eucerin-hyaluron-filler-serum")
if status == 200:
    product = data
    
    # (a) Product-level studies with url and summary
    studies = product.get("studies", [])
    if len(studies) >= 1:
        study = studies[0]
        if study.get("url") and study.get("summary", {}).get("fr") and study.get("summary", {}).get("en"):
            results.add_pass("Product has study with non-empty url and summary.fr & summary.en")
        else:
            results.add_fail("Product study fields", f"Missing url or summary: {study}")
    else:
        results.add_fail("Product studies", "No studies found")
    
    # (b) ingredient_details populated and EACH has studies[] with url
    ingredient_details = product.get("ingredient_details", [])
    if len(ingredient_details) > 0:
        results.add_pass(f"Product has ingredient_details array ({len(ingredient_details)} ingredients)")
        
        all_have_studies = True
        for ing in ingredient_details:
            ing_studies = ing.get("studies", [])
            if len(ing_studies) == 0:
                results.add_fail(f"Ingredient {ing.get('slug')} studies", "No studies found")
                all_have_studies = False
                break
            
            # Check each study has url
            for s in ing_studies:
                if not s.get("url"):
                    results.add_fail(f"Ingredient {ing.get('slug')} study url", f"Missing url: {s}")
                    all_have_studies = False
                    break
        
        if all_have_studies:
            results.add_pass("All ingredients in ingredient_details have studies[] with non-empty url")
    else:
        results.add_fail("ingredient_details", "Empty or missing")
    
    # (c) ingredients array length === 4 and equals {acide-hyaluronique, glycerine, panthenol, squalane}
    ingredients = product.get("ingredients", [])
    expected_set = {"acide-hyaluronique", "glycerine", "panthenol", "squalane"}
    actual_set = set(ingredients)
    
    if len(ingredients) == 4:
        results.add_pass("Product has exactly 4 ingredients")
    else:
        results.add_fail("Product ingredients count", f"Expected 4, got {len(ingredients)}: {ingredients}")
    
    if actual_set == expected_set:
        results.add_pass("Product ingredients match expected set {acide-hyaluronique, glycerine, panthenol, squalane}")
    else:
        results.add_fail("Product ingredients set", f"Expected {expected_set}, got {actual_set}")
else:
    results.add_fail("GET /api/products/eucerin-hyaluron-filler-serum", f"Status {status}, data: {data}")

# ============================================================================
# TEST 5: Ingredient Studies - All ingredients have studies with url
# ============================================================================
print("\n[TEST 5] Ingredient Studies - Every ingredient has studies[] with url")

status, data = test_api_call("GET", "/ingredients")
if status == 200 and "ingredients" in data:
    ingredients = data["ingredients"]
    
    all_have_studies = True
    for ing in ingredients:
        studies = ing.get("studies", [])
        if len(studies) == 0:
            results.add_fail(f"Ingredient {ing.get('slug')} studies", "No studies found")
            all_have_studies = False
            continue
        
        # Check each study has url
        for s in studies:
            if not s.get("url"):
                results.add_fail(f"Ingredient {ing.get('slug')} study url", f"Missing url: {s}")
                all_have_studies = False
                break
    
    if all_have_studies:
        results.add_pass("All ingredients have studies[] with non-empty url")
    
    # Check specific ingredients have curated pubmed urls (not generic ?term= fallback)
    curated_ingredients = ["niacinamide", "retinol", "vitamine-c"]
    for slug in curated_ingredients:
        ing = next((i for i in ingredients if i.get("slug") == slug), None)
        if ing:
            studies = ing.get("studies", [])
            if len(studies) > 0:
                url = studies[0].get("url", "")
                # Check it's a specific pubmed URL, not the generic ?term= fallback
                if "pubmed.ncbi.nlm.nih.gov/" in url and "?term=" not in url:
                    results.add_pass(f"Ingredient {slug} has curated pubmed URL (not generic ?term= fallback)")
                else:
                    results.add_fail(f"Ingredient {slug} study url", f"Expected curated pubmed URL, got: {url}")
            else:
                results.add_fail(f"Ingredient {slug} studies", "No studies found")
        else:
            results.add_fail(f"Ingredient {slug}", "Not found")

# ============================================================================
# TEST 6: Regression - Filters and Search
# ============================================================================
print("\n[TEST 6] Regression - Filters and Search")

# vertical=hair returns 8
status, data = test_api_call("GET", "/products?vertical=hair")
if status == 200 and "products" in data:
    count = len(data["products"])
    if count == 8:
        results.add_pass("GET /api/products?vertical=hair returns 8 products")
    else:
        results.add_fail("vertical=hair count", f"Expected 8, got {count}")
else:
    results.add_fail("GET /api/products?vertical=hair", f"Status {status}")

# category=serum returns only serum products
status, data = test_api_call("GET", "/products?category=serum")
if status == 200 and "products" in data:
    products = data["products"]
    all_serum = all(p.get("category") == "serum" for p in products)
    if all_serum and len(products) > 0:
        results.add_pass(f"GET /api/products?category=serum returns only serum products ({len(products)} found)")
    else:
        results.add_fail("category=serum filter", f"Not all products are serum: {[p.get('category') for p in products]}")
else:
    results.add_fail("GET /api/products?category=serum", f"Status {status}")

# concern=acne returns products all containing 'acne'
status, data = test_api_call("GET", "/products?concern=acne")
if status == 200 and "products" in data:
    products = data["products"]
    all_have_acne = all("acne" in p.get("concerns", []) for p in products)
    if all_have_acne and len(products) > 0:
        results.add_pass(f"GET /api/products?concern=acne returns products all containing 'acne' ({len(products)} found)")
    else:
        results.add_fail("concern=acne filter", f"Not all products have acne concern")
else:
    results.add_fail("GET /api/products?concern=acne", f"Status {status}")

# search=retinol returns borlind-retinol-nature-serum
status, data = test_api_call("GET", "/products?search=retinol")
if status == 200 and "products" in data:
    products = data["products"]
    found = any(p.get("slug") == "borlind-retinol-nature-serum" for p in products)
    if found:
        results.add_pass("GET /api/products?search=retinol returns borlind-retinol-nature-serum")
    else:
        results.add_fail("search=retinol", f"borlind-retinol-nature-serum not found, got: {[p.get('slug') for p in products]}")
else:
    results.add_fail("GET /api/products?search=retinol", f"Status {status}")

# search=r%C3%A9tinol (rétinol with accent) returns borlind-retinol-nature-serum
status, data = test_api_call("GET", "/products?search=r%C3%A9tinol")
if status == 200 and "products" in data:
    products = data["products"]
    found = any(p.get("slug") == "borlind-retinol-nature-serum" for p in products)
    if found:
        results.add_pass("GET /api/products?search=rétinol returns borlind-retinol-nature-serum")
    else:
        results.add_fail("search=rétinol", f"borlind-retinol-nature-serum not found, got: {[p.get('slug') for p in products]}")
else:
    results.add_fail("GET /api/products?search=rétinol", f"Status {status}")

# ============================================================================
# TEST 7: Regression - Other Endpoints
# ============================================================================
print("\n[TEST 7] Regression - Other Endpoints")

# Compare endpoint
status, data = test_api_call("GET", "/compare?a=weleda-skin-food&b=dr-hauschka-creme-jour-rose")
if status == 200:
    if all(k in data for k in ["a", "b", "common_ingredients", "ingredient_details"]):
        results.add_pass("GET /api/compare returns 200 with a, b, common_ingredients, ingredient_details")
    else:
        results.add_fail("Compare response structure", f"Missing fields: {data.keys()}")
else:
    results.add_fail("GET /api/compare", f"Status {status}, data: {data}")

# Admin login
status, data = test_api_call("POST", "/admin/login", json_data={"password": ADMIN_PASSWORD})
if status == 200 and "token" in data:
    token = data["token"]
    results.add_pass("POST /api/admin/login with admin123 returns token")
    
    # Admin stats
    headers = {"Authorization": f"Bearer {token}"}
    status, data = test_api_call("GET", "/admin/stats", headers=headers)
    if status == 200:
        if data.get("products") == 30 and data.get("brands") == 11 and data.get("ingredients") == 24:
            results.add_pass("GET /api/admin/stats returns products=30, brands=11, ingredients=24")
        else:
            results.add_fail("Admin stats counts", f"Expected products=30, brands=11, ingredients=24, got: {data}")
    else:
        results.add_fail("GET /api/admin/stats", f"Status {status}, data: {data}")
else:
    results.add_fail("POST /api/admin/login", f"Status {status}, data: {data}")

# ============================================================================
# TEST 8: No 500 Errors - All responses valid JSON
# ============================================================================
print("\n[TEST 8] No 500 Errors - All responses valid JSON")

# All previous tests already checked for valid JSON and status codes
# This is a summary check
if results.failed == 0:
    results.add_pass("All API endpoints returned valid JSON with no 500 errors")
else:
    print("Note: Some tests failed, check individual test results above")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "="*80)
success = results.summary()
print("="*80)

sys.exit(0 if success else 1)
