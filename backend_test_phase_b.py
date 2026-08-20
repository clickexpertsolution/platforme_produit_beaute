#!/usr/bin/env python3
"""
Backend API Testing Script for Phase B (Authority) - Dermalyze
Tests AI article generation, draft filtering, and regressions
"""

import requests
import json
import sys
import time

# Base URL from environment
BASE_URL = "https://multi-lang-ui-3.preview.emergentagent.com/api"
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
print("PHASE B (AUTHORITY) BACKEND TESTING")
print("=" * 80)
print(f"Base URL: {BASE_URL}")
print()

# ============================================================================
# SCENARIO 1: POST /api/admin/generate WITHOUT Authorization → 401
# ============================================================================
print("\n" + "=" * 80)
print("SCENARIO 1: AI Generation without Authorization")
print("=" * 80)

try:
    payload = {"topic": "Test topic", "vertical": "skincare", "category": "guide"}
    response = requests.post(f"{BASE_URL}/admin/generate", json=payload, timeout=10)
    
    if response.status_code == 401:
        log_test("Generate without auth returns 401", True, f"Status: {response.status_code}")
    else:
        log_test("Generate without auth returns 401", False, f"Expected 401, got {response.status_code}")
except Exception as e:
    log_test("Generate without auth returns 401", False, f"Exception: {str(e)}")

# ============================================================================
# SCENARIO 2: POST /api/admin/generate WITH Bearer + short topic → 400
# ============================================================================
print("\n" + "=" * 80)
print("SCENARIO 2: AI Generation with short topic (validation)")
print("=" * 80)

token = get_admin_token()
if token:
    log_test("Admin login successful", True, f"Token obtained")
    
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {"topic": "ab"}  # Too short, < 3 chars
        response = requests.post(f"{BASE_URL}/admin/generate", json=payload, headers=headers, timeout=10)
        
        if response.status_code == 400:
            log_test("Generate with short topic returns 400", True, f"Status: {response.status_code}")
            error_msg = response.json().get("error", "")
            if "topic" in error_msg.lower() or "3" in error_msg:
                log_test("Error message mentions topic/length", True, f"Error: {error_msg}")
            else:
                log_test("Error message mentions topic/length", False, f"Error: {error_msg}")
        else:
            log_test("Generate with short topic returns 400", False, f"Expected 400, got {response.status_code}")
    except Exception as e:
        log_test("Generate with short topic returns 400", False, f"Exception: {str(e)}")
else:
    log_test("Admin login successful", False, "Failed to get token")

# ============================================================================
# SCENARIO 3: POST /api/admin/generate WITH Bearer + valid topic → 200
# IMPORTANT: CALL ONCE ONLY - REAL LLM CALL (5-20s)
# ============================================================================
print("\n" + "=" * 80)
print("SCENARIO 3: AI Generation with valid topic (REAL LLM CALL - ONCE ONLY)")
print("=" * 80)
print("⚠️  This makes a REAL LLM call and may take 5-20 seconds...")

if token:
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "topic": "Comment choisir un écran solaire adapté à sa peau",
            "vertical": "skincare",
            "category": "guide"
        }
        
        # Use 90s timeout for LLM call
        start_time = time.time()
        response = requests.post(f"{BASE_URL}/admin/generate", json=payload, headers=headers, timeout=90)
        elapsed = time.time() - start_time
        
        print(f"  → LLM call completed in {elapsed:.2f}s")
        
        if response.status_code == 200:
            log_test("Generate with valid topic returns 200", True, f"Status: {response.status_code}, Time: {elapsed:.2f}s")
            
            data = response.json()
            article = data.get("article", {})
            
            # Validate article structure
            if article:
                log_test("Response contains article object", True)
                
                # Check slug
                slug = article.get("slug", "")
                if slug and isinstance(slug, str) and len(slug) > 0:
                    log_test("Article has non-empty slug", True, f"slug: {slug}")
                else:
                    log_test("Article has non-empty slug", False, f"slug: {slug}")
                
                # Check category
                category = article.get("category", "")
                if category and isinstance(category, str):
                    log_test("Article has category", True, f"category: {category}")
                else:
                    log_test("Article has category", False, f"category: {category}")
                
                # Check vertical
                vertical = article.get("vertical", "")
                if vertical == "skincare":
                    log_test("Article vertical is 'skincare'", True, f"vertical: {vertical}")
                else:
                    log_test("Article vertical is 'skincare'", False, f"Expected 'skincare', got: {vertical}")
                
                # Check title.fr and title.en
                title = article.get("title", {})
                if isinstance(title, dict):
                    title_fr = title.get("fr", "")
                    title_en = title.get("en", "")
                    
                    if title_fr and isinstance(title_fr, str) and len(title_fr) > 0:
                        log_test("Article has non-empty title.fr", True, f"title.fr length: {len(title_fr)}")
                    else:
                        log_test("Article has non-empty title.fr", False, f"title.fr: {title_fr}")
                    
                    if title_en and isinstance(title_en, str) and len(title_en) > 0:
                        log_test("Article has non-empty title.en", True, f"title.en length: {len(title_en)}")
                    else:
                        log_test("Article has non-empty title.en", False, f"title.en: {title_en}")
                else:
                    log_test("Article has title object", False, f"title: {title}")
                
                # Check excerpt.fr and excerpt.en
                excerpt = article.get("excerpt", {})
                if isinstance(excerpt, dict):
                    excerpt_fr = excerpt.get("fr", "")
                    excerpt_en = excerpt.get("en", "")
                    
                    if excerpt_fr and isinstance(excerpt_fr, str) and len(excerpt_fr) > 0:
                        log_test("Article has non-empty excerpt.fr", True, f"excerpt.fr length: {len(excerpt_fr)}")
                    else:
                        log_test("Article has non-empty excerpt.fr", False, f"excerpt.fr: {excerpt_fr}")
                    
                    if excerpt_en and isinstance(excerpt_en, str) and len(excerpt_en) > 0:
                        log_test("Article has non-empty excerpt.en", True, f"excerpt.en length: {len(excerpt_en)}")
                    else:
                        log_test("Article has non-empty excerpt.en", False, f"excerpt.en: {excerpt_en}")
                else:
                    log_test("Article has excerpt object", False, f"excerpt: {excerpt}")
                
                # Check content.fr and content.en
                content = article.get("content", {})
                if isinstance(content, dict):
                    content_fr = content.get("fr", "")
                    content_en = content.get("en", "")
                    
                    if content_fr and isinstance(content_fr, str) and len(content_fr) > 0:
                        log_test("Article has non-empty content.fr", True, f"content.fr length: {len(content_fr)} chars")
                    else:
                        log_test("Article has non-empty content.fr", False, f"content.fr: {content_fr}")
                    
                    if content_en and isinstance(content_en, str) and len(content_en) > 0:
                        log_test("Article has non-empty content.en", True, f"content.en length: {len(content_en)} chars")
                    else:
                        log_test("Article has non-empty content.en", False, f"content.en: {content_en}")
                else:
                    log_test("Article has content object", False, f"content: {content}")
            else:
                log_test("Response contains article object", False, "No article in response")
        else:
            log_test("Generate with valid topic returns 200", False, f"Expected 200, got {response.status_code}: {response.text[:200]}")
    except requests.exceptions.Timeout:
        log_test("Generate with valid topic returns 200", False, "Request timed out after 90s")
    except Exception as e:
        log_test("Generate with valid topic returns 200", False, f"Exception: {str(e)}")

# ============================================================================
# SCENARIO 4: Articles draft filtering
# ============================================================================
print("\n" + "=" * 80)
print("SCENARIO 4: Articles draft filtering")
print("=" * 80)

# 4a: GET /api/articles (public) - record total
try:
    response = requests.get(f"{BASE_URL}/articles", timeout=10)
    if response.status_code == 200:
        data = response.json()
        articles = data.get("articles", [])
        total_public = len(articles)
        log_test("GET /api/articles (public) returns articles", True, f"Total: {total_public}")
        
        # Check if expected 4 articles (from seed)
        if total_public == 4:
            log_test("Public articles count is 4 (no drafts)", True, f"Count: {total_public}")
        else:
            log_test("Public articles count is 4 (no drafts)", False, f"Expected 4, got {total_public}")
    else:
        log_test("GET /api/articles (public) returns articles", False, f"Status: {response.status_code}")
        total_public = 0
except Exception as e:
    log_test("GET /api/articles (public) returns articles", False, f"Exception: {str(e)}")
    total_public = 0

# 4b: POST /api/admin/articles - create draft
draft_id = None
if token:
    try:
        headers = {"Authorization": f"Bearer {token}"}
        draft_payload = {
            "slug": "test-draft-xyz",
            "category": "guide",
            "status": "draft",
            "title": {"fr": "Brouillon test", "en": "Test draft"},
            "excerpt": {"fr": "x", "en": "x"},
            "content": {"fr": "x", "en": "x"}
        }
        response = requests.post(f"{BASE_URL}/admin/articles", json=draft_payload, headers=headers, timeout=10)
        
        if response.status_code == 201:
            log_test("Create draft article returns 201", True, f"Status: {response.status_code}")
            data = response.json()
            draft_id = data.get("id")
            if draft_id:
                log_test("Draft article has id", True, f"id: {draft_id}")
            else:
                log_test("Draft article has id", False, "No id in response")
        else:
            log_test("Create draft article returns 201", False, f"Expected 201, got {response.status_code}: {response.text[:200]}")
    except Exception as e:
        log_test("Create draft article returns 201", False, f"Exception: {str(e)}")

# 4c: GET /api/articles (public) - must NOT contain test-draft-xyz
try:
    response = requests.get(f"{BASE_URL}/articles", timeout=10)
    if response.status_code == 200:
        data = response.json()
        articles = data.get("articles", [])
        slugs = [a.get("slug") for a in articles]
        
        if "test-draft-xyz" not in slugs:
            log_test("Public articles do NOT include draft", True, f"Draft slug not found in public list")
        else:
            log_test("Public articles do NOT include draft", False, f"Draft slug found in public list: {slugs}")
    else:
        log_test("Public articles do NOT include draft", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Public articles do NOT include draft", False, f"Exception: {str(e)}")

# 4d: GET /api/articles?all=1 - MUST contain test-draft-xyz
try:
    response = requests.get(f"{BASE_URL}/articles?all=1", timeout=10)
    if response.status_code == 200:
        data = response.json()
        articles = data.get("articles", [])
        slugs = [a.get("slug") for a in articles]
        
        if "test-draft-xyz" in slugs:
            log_test("Articles with all=1 INCLUDES draft", True, f"Draft slug found in all=1 list")
        else:
            log_test("Articles with all=1 INCLUDES draft", False, f"Draft slug NOT found in all=1 list: {slugs}")
    else:
        log_test("Articles with all=1 INCLUDES draft", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Articles with all=1 INCLUDES draft", False, f"Exception: {str(e)}")

# 4e: DELETE /api/admin/articles/{id} - cleanup
if token and draft_id:
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.delete(f"{BASE_URL}/admin/articles/{draft_id}", headers=headers, timeout=10)
        
        if response.status_code == 200:
            log_test("Delete draft article returns 200", True, f"Status: {response.status_code}")
        else:
            log_test("Delete draft article returns 200", False, f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_test("Delete draft article returns 200", False, f"Exception: {str(e)}")

# 4f: Confirm GET /api/articles?all=1 no longer has test-draft-xyz
try:
    response = requests.get(f"{BASE_URL}/articles?all=1", timeout=10)
    if response.status_code == 200:
        data = response.json()
        articles = data.get("articles", [])
        slugs = [a.get("slug") for a in articles]
        
        if "test-draft-xyz" not in slugs:
            log_test("Draft removed from all=1 list after delete", True, f"Draft slug not found after cleanup")
        else:
            log_test("Draft removed from all=1 list after delete", False, f"Draft slug still found: {slugs}")
    else:
        log_test("Draft removed from all=1 list after delete", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("Draft removed from all=1 list after delete", False, f"Exception: {str(e)}")

# ============================================================================
# SCENARIO 5: Regression tests
# ============================================================================
print("\n" + "=" * 80)
print("SCENARIO 5: Regression tests")
print("=" * 80)

# 5a: GET /api/products - should return 30 products
try:
    response = requests.get(f"{BASE_URL}/products", timeout=10)
    if response.status_code == 200:
        data = response.json()
        products = data.get("products", [])
        total_products = len(products)
        
        if total_products == 30:
            log_test("GET /api/products returns 30 products", True, f"Count: {total_products}")
        else:
            log_test("GET /api/products returns 30 products", False, f"Expected 30, got {total_products}")
    else:
        log_test("GET /api/products returns 30 products", False, f"Status: {response.status_code}")
except Exception as e:
    log_test("GET /api/products returns 30 products", False, f"Exception: {str(e)}")

# 5b: GET /api/admin/stats - should include products, subscribers, affiliate_clicks
if token:
    try:
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/admin/stats", headers=headers, timeout=10)
        
        if response.status_code == 200:
            log_test("GET /api/admin/stats returns 200", True, f"Status: {response.status_code}")
            
            data = response.json()
            
            # Check for required fields
            required_fields = ["products", "subscribers", "affiliate_clicks"]
            for field in required_fields:
                if field in data:
                    value = data[field]
                    if isinstance(value, int) and value >= 0:
                        log_test(f"Stats includes numeric {field}", True, f"{field}: {value}")
                    else:
                        log_test(f"Stats includes numeric {field}", False, f"{field}: {value} (not a valid number)")
                else:
                    log_test(f"Stats includes numeric {field}", False, f"{field} not found in response")
        else:
            log_test("GET /api/admin/stats returns 200", False, f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_test("GET /api/admin/stats returns 200", False, f"Exception: {str(e)}")

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
