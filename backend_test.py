#!/usr/bin/env python3
"""
Comprehensive backend API test for bilingual skincare platform
Tests all endpoints: products, ingredients, brands, articles, compare, finder, leads, admin
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Load base URL from environment
BASE_URL = "https://ingredient-db.preview.emergentagent.com/api"
ADMIN_PASSWORD = "admin123"

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

def test_get(endpoint: str, expected_status: int = 200, description: str = "") -> Optional[Dict]:
    """Test GET endpoint"""
    try:
        url = f"{BASE_URL}/{endpoint}"
        response = requests.get(url, timeout=10)
        passed = response.status_code == expected_status
        
        if passed and expected_status == 200:
            data = response.json()
            log_test(description or f"GET /{endpoint}", True, f"Status: {response.status_code}")
            return data
        elif passed:
            log_test(description or f"GET /{endpoint}", True, f"Status: {response.status_code} (expected)")
            return None
        else:
            log_test(description or f"GET /{endpoint}", False, f"Expected {expected_status}, got {response.status_code}")
            return None
    except Exception as e:
        log_test(description or f"GET /{endpoint}", False, f"Error: {str(e)}")
        return None

def test_post(endpoint: str, payload: Dict, expected_status: int = 200, description: str = "", headers: Dict = None) -> Optional[Dict]:
    """Test POST endpoint"""
    try:
        url = f"{BASE_URL}/{endpoint}"
        response = requests.post(url, json=payload, headers=headers or {}, timeout=10)
        passed = response.status_code == expected_status
        
        if passed and expected_status in [200, 201]:
            data = response.json()
            log_test(description or f"POST /{endpoint}", True, f"Status: {response.status_code}")
            return data
        elif passed:
            log_test(description or f"POST /{endpoint}", True, f"Status: {response.status_code} (expected)")
            return None
        else:
            log_test(description or f"POST /{endpoint}", False, f"Expected {expected_status}, got {response.status_code}")
            return None
    except Exception as e:
        log_test(description or f"POST /{endpoint}", False, f"Error: {str(e)}")
        return None

def test_put(endpoint: str, payload: Dict, expected_status: int = 200, description: str = "", headers: Dict = None) -> Optional[Dict]:
    """Test PUT endpoint"""
    try:
        url = f"{BASE_URL}/{endpoint}"
        response = requests.put(url, json=payload, headers=headers or {}, timeout=10)
        passed = response.status_code == expected_status
        
        if passed and expected_status == 200:
            data = response.json()
            log_test(description or f"PUT /{endpoint}", True, f"Status: {response.status_code}")
            return data
        elif passed:
            log_test(description or f"PUT /{endpoint}", True, f"Status: {response.status_code} (expected)")
            return None
        else:
            log_test(description or f"PUT /{endpoint}", False, f"Expected {expected_status}, got {response.status_code}")
            return None
    except Exception as e:
        log_test(description or f"PUT /{endpoint}", False, f"Error: {str(e)}")
        return None

def test_delete(endpoint: str, expected_status: int = 200, description: str = "", headers: Dict = None) -> bool:
    """Test DELETE endpoint"""
    try:
        url = f"{BASE_URL}/{endpoint}"
        response = requests.delete(url, headers=headers or {}, timeout=10)
        passed = response.status_code == expected_status
        
        if passed:
            log_test(description or f"DELETE /{endpoint}", True, f"Status: {response.status_code}")
            return True
        else:
            log_test(description or f"DELETE /{endpoint}", False, f"Expected {expected_status}, got {response.status_code}")
            return False
    except Exception as e:
        log_test(description or f"DELETE /{endpoint}", False, f"Error: {str(e)}")
        return False

def main():
    print(f"\n{Colors.BLUE}{'='*80}{Colors.END}")
    print(f"{Colors.BLUE}Starting Backend API Tests{Colors.END}")
    print(f"{Colors.BLUE}Base URL: {BASE_URL}{Colors.END}")
    print(f"{Colors.BLUE}{'='*80}{Colors.END}\n")
    
    test_results = []
    admin_token = None
    test_product_id = None
    test_brand_id = None
    test_ingredient_id = None
    test_article_id = None
    
    # ========== 1. TEST PRODUCTS ENDPOINT ==========
    print(f"\n{Colors.YELLOW}[1] Testing Products Endpoints{Colors.END}")
    
    # Get all products (should return at least 12 seeded products)
    data = test_get("products", 200, "GET /api/products - all products")
    if data:
        test_results.append(log_test("Products count >= 12", len(data.get('products', [])) >= 12, f"Found {len(data.get('products', []))} products"))
        test_results.append(log_test("No _id field in products", all('_id' not in p for p in data.get('products', [])), "Checking NOID projection"))
    
    # Test filters
    data = test_get("products?category=serum", 200, "GET /api/products?category=serum")
    if data:
        test_results.append(log_test("Filter by category=serum", all(p.get('category') == 'serum' for p in data.get('products', [])), f"Found {len(data.get('products', []))} serums"))
    
    data = test_get("products?concern=acne", 200, "GET /api/products?concern=acne")
    if data:
        test_results.append(log_test("Filter by concern=acne", all('acne' in p.get('concerns', []) for p in data.get('products', [])), f"Found {len(data.get('products', []))} products"))
    
    data = test_get("products?skin_type=oily", 200, "GET /api/products?skin_type=oily")
    if data:
        test_results.append(log_test("Filter by skin_type=oily", all('oily' in p.get('skin_types', []) for p in data.get('products', [])), f"Found {len(data.get('products', []))} products"))
    
    data = test_get("products?brand=eucerin", 200, "GET /api/products?brand=eucerin")
    if data:
        test_results.append(log_test("Filter by brand=eucerin", all(p.get('brand_slug') == 'eucerin' for p in data.get('products', [])), f"Found {len(data.get('products', []))} products"))
    
    data = test_get("products?german=true", 200, "GET /api/products?german=true")
    if data:
        test_results.append(log_test("Filter by german=true", all(p.get('german_made') == True for p in data.get('products', [])), f"Found {len(data.get('products', []))} products"))
    
    data = test_get("products?search=eucerin", 200, "GET /api/products?search=eucerin (case-insensitive)")
    if data:
        products = data.get('products', [])
        test_results.append(log_test("Search by 'eucerin'", len(products) > 0, f"Found {len(products)} products"))
    
    # ========== 2. TEST PRODUCT DETAIL ENDPOINT ==========
    print(f"\n{Colors.YELLOW}[2] Testing Product Detail Endpoints{Colors.END}")
    
    data = test_get("products/eucerin-dermopure-serum", 200, "GET /api/products/eucerin-dermopure-serum")
    if data:
        test_results.append(log_test("Product has ingredient_details array", 'ingredient_details' in data and isinstance(data['ingredient_details'], list), f"Found {len(data.get('ingredient_details', []))} ingredients"))
        test_results.append(log_test("Product has brand object", 'brand' in data and isinstance(data['brand'], dict), f"Brand: {data.get('brand', {}).get('name', 'N/A')}"))
        test_results.append(log_test("No _id in product detail", '_id' not in data, "NOID projection working"))
    
    test_get("products/nonexistent-product-xyz", 404, "GET /api/products/nonexistent → 404")
    
    # ========== 3. TEST INGREDIENTS ENDPOINTS ==========
    print(f"\n{Colors.YELLOW}[3] Testing Ingredients Endpoints{Colors.END}")
    
    data = test_get("ingredients", 200, "GET /api/ingredients - all ingredients")
    if data:
        test_results.append(log_test("Ingredients count >= 12", len(data.get('ingredients', [])) >= 12, f"Found {len(data.get('ingredients', []))} ingredients"))
        test_results.append(log_test("No _id field in ingredients", all('_id' not in i for i in data.get('ingredients', [])), "Checking NOID projection"))
    
    data = test_get("ingredients/niacinamide", 200, "GET /api/ingredients/niacinamide")
    if data:
        test_results.append(log_test("Ingredient has products array", 'products' in data and isinstance(data['products'], list), f"Found in {len(data.get('products', []))} products"))
    
    test_get("ingredients/unknown-ingredient-xyz", 404, "GET /api/ingredients/unknown → 404")
    
    # ========== 4. TEST BRANDS ENDPOINTS ==========
    print(f"\n{Colors.YELLOW}[4] Testing Brands Endpoints{Colors.END}")
    
    data = test_get("brands", 200, "GET /api/brands - all brands")
    if data:
        test_results.append(log_test("Brands count >= 6", len(data.get('brands', [])) >= 6, f"Found {len(data.get('brands', []))} brands"))
    
    data = test_get("brands?german=true", 200, "GET /api/brands?german=true")
    if data:
        brands = data.get('brands', [])
        test_results.append(log_test("German brands >= 5", len(brands) >= 5, f"Found {len(brands)} German brands"))
        test_results.append(log_test("All brands are German", all(b.get('german') == True for b in brands), "Checking german flag"))
    
    data = test_get("brands/sebamed", 200, "GET /api/brands/sebamed")
    if data:
        test_results.append(log_test("Brand has products array", 'products' in data and isinstance(data['products'], list), f"Found {len(data.get('products', []))} products"))
    
    # ========== 5. TEST ARTICLES ENDPOINTS ==========
    print(f"\n{Colors.YELLOW}[5] Testing Articles Endpoints{Colors.END}")
    
    data = test_get("articles", 200, "GET /api/articles - all articles")
    if data:
        articles = data.get('articles', [])
        test_results.append(log_test("Articles count >= 4", len(articles) >= 4, f"Found {len(articles)} articles"))
        # Check if sorted by published_at desc
        if len(articles) >= 2:
            test_results.append(log_test("Articles sorted by published_at desc", articles[0].get('published_at', '') >= articles[1].get('published_at', ''), "Checking sort order"))
    
    data = test_get("articles?category=learn", 200, "GET /api/articles?category=learn")
    if data:
        articles = data.get('articles', [])
        test_results.append(log_test("Filter by category=learn", all(a.get('category') == 'learn' for a in articles), f"Found {len(articles)} articles"))
    
    data = test_get("articles/comprendre-peau-sensible", 200, "GET /api/articles/comprendre-peau-sensible")
    if data:
        test_results.append(log_test("Article has bilingual title", 'title' in data and 'fr' in data['title'] and 'en' in data['title'], "Checking bilingual fields"))
    
    # ========== 6. TEST COMPARE ENDPOINT ==========
    print(f"\n{Colors.YELLOW}[6] Testing Compare Endpoint{Colors.END}")
    
    data = test_get("compare?a=weleda-skin-food&b=dr-hauschka-creme-jour-rose", 200, "GET /api/compare?a=weleda-skin-food&b=dr-hauschka-creme-jour-rose")
    if data:
        test_results.append(log_test("Compare returns product a", 'a' in data and data['a'].get('slug') == 'weleda-skin-food', "Product A present"))
        test_results.append(log_test("Compare returns product b", 'b' in data and data['b'].get('slug') == 'dr-hauschka-creme-jour-rose', "Product B present"))
        test_results.append(log_test("Compare returns common_ingredients", 'common_ingredients' in data and isinstance(data['common_ingredients'], list), f"Found {len(data.get('common_ingredients', []))} common ingredients"))
        
        # Check for specific shared ingredients
        common = data.get('common_ingredients', [])
        expected_common = ['glycerine', 'squalane', 'aloe-vera']
        found_common = [ing for ing in expected_common if ing in common]
        test_results.append(log_test("Common ingredients include glycerine, squalane, aloe-vera", len(found_common) >= 2, f"Found: {', '.join(found_common)}"))
        
        test_results.append(log_test("Compare returns ingredient_details", 'ingredient_details' in data and isinstance(data['ingredient_details'], list), f"Found {len(data.get('ingredient_details', []))} ingredient details"))
    
    test_get("compare?a=weleda-skin-food&b=nonexistent-product", 404, "GET /api/compare with invalid slug → 404")
    
    # ========== 7. TEST FINDER ENDPOINT ==========
    print(f"\n{Colors.YELLOW}[7] Testing Product Finder Endpoint{Colors.END}")
    
    payload = {
        "skin_type": "oily",
        "concerns": ["acne", "oily"],
        "budget": "low"
    }
    data = test_post("finder", payload, 200, "POST /api/finder with skin_type=oily, concerns=[acne,oily], budget=low")
    if data:
        results = data.get('results', [])
        test_results.append(log_test("Finder returns results array", isinstance(results, list), f"Found {len(results)} results"))
        test_results.append(log_test("Finder returns max 6 results", len(results) <= 6, f"Returned {len(results)} results"))
        
        if results:
            test_results.append(log_test("Results sorted by score desc", all(results[i].get('score', 0) >= results[i+1].get('score', 0) for i in range(len(results)-1)), "Checking sort order"))
            test_results.append(log_test("Each result has score", all('score' in r for r in results), "Checking score field"))
            test_results.append(log_test("Each result has match_percent", all('match_percent' in r for r in results), "Checking match_percent field"))
            test_results.append(log_test("Each result has matched_concerns", all('matched_concerns' in r for r in results), "Checking matched_concerns field"))
            
            # Check budget low favors products <=15€
            low_budget_products = [r for r in results if r.get('price_eur', 999) <= 15]
            test_results.append(log_test("Budget low favors products <=15€", len(low_budget_products) > 0, f"Found {len(low_budget_products)} products <=15€"))
    
    # Test with budget high
    payload_high = {
        "skin_type": "dry",
        "concerns": ["aging", "dryness"],
        "budget": "high"
    }
    data = test_post("finder", payload_high, 200, "POST /api/finder with budget=high")
    if data:
        results = data.get('results', [])
        test_results.append(log_test("Finder works with budget=high", len(results) > 0, f"Found {len(results)} results"))
    
    # ========== 8. TEST LEADS ENDPOINT ==========
    print(f"\n{Colors.YELLOW}[8] Testing Leads Endpoint{Colors.END}")
    
    lead_payload = {
        "brand_name": "GlowLab Cosmetics",
        "email": "contact@glowlab-cosmetics.com",
        "contact_name": "Sophie Martin",
        "message": "Interested in featuring our organic skincare line on your platform."
    }
    data = test_post("leads", lead_payload, 201, "POST /api/leads with valid data")
    if data:
        test_results.append(log_test("Lead created with uuid id", 'id' in data and len(data['id']) > 0, f"ID: {data.get('id', 'N/A')[:8]}..."))
        test_lead_id = data.get('id')
    
    # Test missing email
    test_post("leads", {"brand_name": "TestBrand"}, 400, "POST /api/leads without email → 400")
    
    # Test missing brand_name
    test_post("leads", {"email": "test@test.com"}, 400, "POST /api/leads without brand_name → 400")
    
    # ========== 9. TEST ADMIN AUTH ==========
    print(f"\n{Colors.YELLOW}[9] Testing Admin Authentication{Colors.END}")
    
    data = test_post("admin/login", {"password": ADMIN_PASSWORD}, 200, "POST /api/admin/login with correct password")
    if data:
        admin_token = data.get('token')
        test_results.append(log_test("Login returns Bearer token", admin_token is not None and len(admin_token) > 0, f"Token: {admin_token[:8] if admin_token else 'N/A'}..."))
    
    test_post("admin/login", {"password": "wrongpassword"}, 401, "POST /api/admin/login with wrong password → 401")
    
    # ========== 10. TEST ADMIN PROTECTED ROUTES WITHOUT AUTH ==========
    print(f"\n{Colors.YELLOW}[10] Testing Admin Protected Routes (No Auth){Colors.END}")
    
    test_get("admin/stats", 401, "GET /api/admin/stats without auth → 401")
    test_get("admin/leads", 401, "GET /api/admin/leads without auth → 401")
    test_post("admin/products", {"slug": "test"}, 401, "POST /api/admin/products without auth → 401")
    
    # ========== 11. TEST ADMIN PROTECTED ROUTES WITH AUTH ==========
    if admin_token:
        print(f"\n{Colors.YELLOW}[11] Testing Admin Protected Routes (With Auth){Colors.END}")
        
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Test stats
        try:
            url = f"{BASE_URL}/admin/stats"
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                log_test("GET /api/admin/stats with auth", True, f"Status: {response.status_code}")
                test_results.append(log_test("Stats returns counts", all(k in data for k in ['products', 'brands', 'ingredients', 'articles', 'leads']), f"Products: {data.get('products')}, Brands: {data.get('brands')}, Ingredients: {data.get('ingredients')}, Articles: {data.get('articles')}, Leads: {data.get('leads')}"))
            else:
                log_test("GET /api/admin/stats with auth", False, f"Status: {response.status_code}")
        except Exception as e:
            log_test("GET /api/admin/stats with auth", False, f"Error: {str(e)}")
        
        # Test leads list
        try:
            url = f"{BASE_URL}/admin/leads"
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                leads = data.get('leads', [])
                log_test("GET /api/admin/leads with auth", True, f"Found {len(leads)} leads")
                # Check if our test lead is in the list
                if test_lead_id:
                    test_results.append(log_test("Test lead present in admin leads", any(l.get('id') == test_lead_id for l in leads), "Checking for created lead"))
            else:
                log_test("GET /api/admin/leads with auth", False, f"Status: {response.status_code}")
        except Exception as e:
            log_test("GET /api/admin/leads with auth", False, f"Error: {str(e)}")
        
        # ========== 12. TEST ADMIN CRUD LIFECYCLE ==========
        print(f"\n{Colors.YELLOW}[12] Testing Admin CRUD Lifecycle{Colors.END}")
        
        # CREATE product
        product_payload = {
            "slug": "test-product-xyz-2025",
            "name": "Test Hydrating Serum",
            "brand_name": "TestLab",
            "brand_slug": "testlab",
            "category": "serum",
            "price_eur": 10.0,
            "rating": 4.0,
            "concerns": ["acne"],
            "skin_types": ["oily"],
            "ingredients": ["niacinamide"],
            "description": {"fr": "Sérum test", "en": "Test serum"},
            "german_made": False
        }
        
        try:
            url = f"{BASE_URL}/admin/products"
            response = requests.post(url, json=product_payload, headers=headers, timeout=10)
            if response.status_code == 201:
                data = response.json()
                test_product_id = data.get('id')
                log_test("POST /api/admin/products - create product", True, f"Created with ID: {test_product_id[:8] if test_product_id else 'N/A'}...")
                test_results.append(log_test("Created product has uuid id", test_product_id is not None, f"ID: {test_product_id[:8] if test_product_id else 'N/A'}..."))
            else:
                log_test("POST /api/admin/products - create product", False, f"Status: {response.status_code}")
        except Exception as e:
            log_test("POST /api/admin/products - create product", False, f"Error: {str(e)}")
        
        # Test duplicate slug → 409
        try:
            url = f"{BASE_URL}/admin/products"
            response = requests.post(url, json=product_payload, headers=headers, timeout=10)
            passed = response.status_code == 409
            log_test("POST /api/admin/products with duplicate slug → 409", passed, f"Status: {response.status_code}")
        except Exception as e:
            log_test("POST /api/admin/products with duplicate slug → 409", False, f"Error: {str(e)}")
        
        # Test missing slug → 400
        try:
            url = f"{BASE_URL}/admin/products"
            response = requests.post(url, json={"name": "Test"}, headers=headers, timeout=10)
            passed = response.status_code == 400
            log_test("POST /api/admin/products without slug → 400", passed, f"Status: {response.status_code}")
        except Exception as e:
            log_test("POST /api/admin/products without slug → 400", False, f"Error: {str(e)}")
        
        # UPDATE product
        if test_product_id:
            update_payload = {"name": "Updated Test Serum Pro"}
            try:
                url = f"{BASE_URL}/admin/products/{test_product_id}"
                response = requests.put(url, json=update_payload, headers=headers, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    log_test("PUT /api/admin/products/{id} - update product", True, f"Updated name: {data.get('name')}")
                    test_results.append(log_test("Product name updated", data.get('name') == "Updated Test Serum Pro", f"New name: {data.get('name')}"))
                else:
                    log_test("PUT /api/admin/products/{id} - update product", False, f"Status: {response.status_code}")
            except Exception as e:
                log_test("PUT /api/admin/products/{id} - update product", False, f"Error: {str(e)}")
            
            # Verify update via public endpoint
            data = test_get(f"products/test-product-xyz-2025", 200, "GET /api/products/test-product-xyz-2025 - verify update")
            if data:
                test_results.append(log_test("Public endpoint reflects update", data.get('name') == "Updated Test Serum Pro", f"Name: {data.get('name')}"))
        
        # DELETE product
        if test_product_id:
            try:
                url = f"{BASE_URL}/admin/products/{test_product_id}"
                response = requests.delete(url, headers=headers, timeout=10)
                passed = response.status_code == 200
                log_test("DELETE /api/admin/products/{id} - delete product", passed, f"Status: {response.status_code}")
            except Exception as e:
                log_test("DELETE /api/admin/products/{id} - delete product", False, f"Error: {str(e)}")
            
            # Test delete again → 404
            try:
                url = f"{BASE_URL}/admin/products/{test_product_id}"
                response = requests.delete(url, headers=headers, timeout=10)
                passed = response.status_code == 404
                log_test("DELETE /api/admin/products/{id} again → 404", passed, f"Status: {response.status_code}")
            except Exception as e:
                log_test("DELETE /api/admin/products/{id} again → 404", False, f"Error: {str(e)}")
        
        # ========== 13. TEST CRUD FOR OTHER COLLECTIONS ==========
        print(f"\n{Colors.YELLOW}[13] Testing CRUD for Brands, Ingredients, Articles{Colors.END}")
        
        # Test brand CRUD
        brand_payload = {
            "slug": "test-brand-xyz-2025",
            "name": "TestBrand GmbH",
            "country": "Allemagne",
            "german": True,
            "founded": 2025,
            "city": "Berlin",
            "website": "https://testbrand.com",
            "description": {"fr": "Marque test", "en": "Test brand"}
        }
        
        try:
            url = f"{BASE_URL}/admin/brands"
            response = requests.post(url, json=brand_payload, headers=headers, timeout=10)
            if response.status_code == 201:
                data = response.json()
                test_brand_id = data.get('id')
                log_test("POST /api/admin/brands - create brand", True, f"Created with ID: {test_brand_id[:8] if test_brand_id else 'N/A'}...")
                
                # Delete brand
                url = f"{BASE_URL}/admin/brands/{test_brand_id}"
                response = requests.delete(url, headers=headers, timeout=10)
                log_test("DELETE /api/admin/brands/{id} - delete brand", response.status_code == 200, f"Status: {response.status_code}")
            else:
                log_test("POST /api/admin/brands - create brand", False, f"Status: {response.status_code}")
        except Exception as e:
            log_test("Brand CRUD test", False, f"Error: {str(e)}")
        
        # Test ingredient CRUD
        ingredient_payload = {
            "slug": "test-ingredient-xyz-2025",
            "name": "Test Peptide",
            "inci": "Palmitoyl Tripeptide-1",
            "safety": "green",
            "evidence": "moderate",
            "comedogenic": 0,
            "good_for": ["aging"],
            "description": {"fr": "Peptide test", "en": "Test peptide"},
            "benefits": {"fr": ["Test"], "en": ["Test"]}
        }
        
        try:
            url = f"{BASE_URL}/admin/ingredients"
            response = requests.post(url, json=ingredient_payload, headers=headers, timeout=10)
            if response.status_code == 201:
                data = response.json()
                test_ingredient_id = data.get('id')
                log_test("POST /api/admin/ingredients - create ingredient", True, f"Created with ID: {test_ingredient_id[:8] if test_ingredient_id else 'N/A'}...")
                
                # Delete ingredient
                url = f"{BASE_URL}/admin/ingredients/{test_ingredient_id}"
                response = requests.delete(url, headers=headers, timeout=10)
                log_test("DELETE /api/admin/ingredients/{id} - delete ingredient", response.status_code == 200, f"Status: {response.status_code}")
            else:
                log_test("POST /api/admin/ingredients - create ingredient", False, f"Status: {response.status_code}")
        except Exception as e:
            log_test("Ingredient CRUD test", False, f"Error: {str(e)}")
        
        # Test article CRUD
        article_payload = {
            "slug": "test-article-xyz-2025",
            "category": "learn",
            "image": "https://example.com/image.jpg",
            "published_at": "2025-06-15",
            "title": {"fr": "Article test", "en": "Test article"},
            "excerpt": {"fr": "Extrait test", "en": "Test excerpt"},
            "content": {"fr": "Contenu test", "en": "Test content"}
        }
        
        try:
            url = f"{BASE_URL}/admin/articles"
            response = requests.post(url, json=article_payload, headers=headers, timeout=10)
            if response.status_code == 201:
                data = response.json()
                test_article_id = data.get('id')
                log_test("POST /api/admin/articles - create article", True, f"Created with ID: {test_article_id[:8] if test_article_id else 'N/A'}...")
                
                # Delete article
                url = f"{BASE_URL}/admin/articles/{test_article_id}"
                response = requests.delete(url, headers=headers, timeout=10)
                log_test("DELETE /api/admin/articles/{id} - delete article", response.status_code == 200, f"Status: {response.status_code}")
            else:
                log_test("POST /api/admin/articles - create article", False, f"Status: {response.status_code}")
        except Exception as e:
            log_test("Article CRUD test", False, f"Error: {str(e)}")
    
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
        print(f"{Colors.GREEN}✓ All backend API tests passed!{Colors.END}\n")
        return 0
    else:
        print(f"{Colors.YELLOW}⚠ Some tests failed. Review the output above.{Colors.END}\n")
        return 1

if __name__ == "__main__":
    sys.exit(main())
