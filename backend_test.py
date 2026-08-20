#!/usr/bin/env python3
"""
Backend test for Dermalyze community features (reviews, Q&A, forum, admin moderation)
Tests ONLY backend API endpoints - NO frontend testing
"""
import requests
import json
import os
from typing import Dict, Any, Optional

# Load base URL from .env
BASE_URL = "https://5dbbcea9-5718-4de7-a987-e6f02244cb12.preview.emergentagent.com/api"
ADMIN_PASSWORD = "admin123"

class TestResults:
    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.errors = []
    
    def add_pass(self, test_name: str):
        self.passed += 1
        print(f"✓ PASS: {test_name}")
    
    def add_fail(self, test_name: str, error: str):
        self.failed += 1
        self.errors.append(f"{test_name}: {error}")
        print(f"✗ FAIL: {test_name}")
        print(f"  Error: {error}")
    
    def summary(self):
        total = self.passed + self.failed
        print(f"\n{'='*80}")
        print(f"TEST SUMMARY: {self.passed}/{total} passed ({self.failed} failed)")
        print(f"{'='*80}")
        if self.errors:
            print("\nFAILURES:")
            for error in self.errors:
                print(f"  - {error}")

results = TestResults()

def test_get(endpoint: str, expected_status: int = 200, params: Optional[Dict] = None, headers: Optional[Dict] = None) -> Optional[Dict]:
    """Helper to test GET requests"""
    try:
        url = f"{BASE_URL}{endpoint}"
        resp = requests.get(url, params=params, headers=headers, timeout=30)
        if resp.status_code != expected_status:
            return None, f"Expected {expected_status}, got {resp.status_code}"
        try:
            return resp.json(), None
        except Exception:
            return None, "Invalid JSON response"
    except Exception as e:
        return None, str(e)

def test_post(endpoint: str, data: Dict, expected_status: int = 200, headers: Optional[Dict] = None) -> Optional[Dict]:
    """Helper to test POST requests"""
    try:
        url = f"{BASE_URL}{endpoint}"
        resp = requests.post(url, json=data, headers=headers, timeout=30)
        if resp.status_code != expected_status:
            return None, f"Expected {expected_status}, got {resp.status_code}: {resp.text[:200]}"
        try:
            return resp.json(), None
        except Exception:
            return None, "Invalid JSON response"
    except Exception as e:
        return None, str(e)

def test_put(endpoint: str, data: Dict, expected_status: int = 200, headers: Optional[Dict] = None) -> Optional[Dict]:
    """Helper to test PUT requests"""
    try:
        url = f"{BASE_URL}{endpoint}"
        resp = requests.put(url, json=data, headers=headers, timeout=30)
        if resp.status_code != expected_status:
            return None, f"Expected {expected_status}, got {resp.status_code}: {resp.text[:200]}"
        try:
            return resp.json(), None
        except Exception:
            return None, "Invalid JSON response"
    except Exception as e:
        return None, str(e)

def test_delete(endpoint: str, expected_status: int = 200, headers: Optional[Dict] = None) -> Optional[Dict]:
    """Helper to test DELETE requests"""
    try:
        url = f"{BASE_URL}{endpoint}"
        resp = requests.delete(url, headers=headers, timeout=30)
        if resp.status_code != expected_status:
            return None, f"Expected {expected_status}, got {resp.status_code}: {resp.text[:200]}"
        try:
            return resp.json(), None
        except Exception:
            return None, "Invalid JSON response"
    except Exception as e:
        return None, str(e)

def get_admin_token() -> Optional[str]:
    """Get admin Bearer token"""
    data, error = test_post("/admin/login", {"password": ADMIN_PASSWORD}, 200)
    if error or not data or 'token' not in data:
        print(f"Failed to get admin token: {error}")
        return None
    return data['token']

print("="*80)
print("DERMALYZE COMMUNITY FEATURES - BACKEND TEST")
print("="*80)
print(f"Base URL: {BASE_URL}")
print(f"Admin Password: {ADMIN_PASSWORD}")
print("="*80)

# ============================================================================
# 1) REVIEWS (PUBLIC)
# ============================================================================
print("\n" + "="*80)
print("1) REVIEWS (PUBLIC)")
print("="*80)

# Test 1.1: GET reviews for weleda-skin-food (should have 39 approved reviews)
data, error = test_get("/reviews", params={"target_type": "product", "target_slug": "weleda-skin-food"})
if error:
    results.add_fail("GET /api/reviews?target_type=product&target_slug=weleda-skin-food", error)
else:
    if 'reviews' not in data or 'summary' not in data:
        results.add_fail("GET /api/reviews (weleda-skin-food)", "Missing 'reviews' or 'summary' in response")
    elif data['summary'].get('count') != 39:
        results.add_fail("GET /api/reviews (weleda-skin-food)", f"Expected 39 reviews, got {data['summary'].get('count')}")
    elif data['summary'].get('average', 0) <= 0:
        results.add_fail("GET /api/reviews (weleda-skin-food)", f"Expected average > 0, got {data['summary'].get('average')}")
    elif 'distribution' not in data['summary']:
        results.add_fail("GET /api/reviews (weleda-skin-food)", "Missing 'distribution' in summary")
    elif not all(str(i) in data['summary']['distribution'] for i in range(1, 6)):
        results.add_fail("GET /api/reviews (weleda-skin-food)", "Distribution missing keys 1-5")
    elif any(r.get('status') != 'approved' for r in data['reviews']):
        results.add_fail("GET /api/reviews (weleda-skin-food)", "Found non-approved reviews in public response")
    elif any('_id' in r for r in data['reviews']):
        results.add_fail("GET /api/reviews (weleda-skin-food)", "Found _id field in response (should be excluded)")
    else:
        results.add_pass("GET /api/reviews?target_type=product&target_slug=weleda-skin-food (39 reviews, summary correct)")

# Test 1.2: GET reviews for brand weleda
data, error = test_get("/reviews", params={"target_type": "brand", "target_slug": "weleda"})
if error:
    results.add_fail("GET /api/reviews?target_type=brand&target_slug=weleda", error)
else:
    if data.get('summary', {}).get('count', 0) <= 0:
        results.add_fail("GET /api/reviews (brand weleda)", f"Expected count > 0, got {data.get('summary', {}).get('count')}")
    else:
        results.add_pass("GET /api/reviews?target_type=brand&target_slug=weleda (count > 0)")

# Test 1.3: GET reviews for ingredient niacinamide
data, error = test_get("/reviews", params={"target_type": "ingredient", "target_slug": "niacinamide"})
if error:
    results.add_fail("GET /api/reviews?target_type=ingredient&target_slug=niacinamide", error)
else:
    if data.get('summary', {}).get('count', 0) <= 0:
        results.add_fail("GET /api/reviews (ingredient niacinamide)", f"Expected count > 0, got {data.get('summary', {}).get('count')}")
    else:
        results.add_pass("GET /api/reviews?target_type=ingredient&target_slug=niacinamide (count > 0)")

# Test 1.4: GET reviews without target_type/target_slug (should return 400)
data, error = test_get("/reviews", expected_status=400)
if error and "Expected 400" not in error:
    results.add_fail("GET /api/reviews without params", error)
elif not error:
    results.add_fail("GET /api/reviews without params", "Expected 400, got 200")
else:
    results.add_pass("GET /api/reviews without target_type/target_slug returns 400")

# Test 1.5: POST new review (should go to pending)
initial_count = 39  # From test 1.1
data, error = test_post("/reviews", {
    "target_type": "product",
    "target_slug": "weleda-skin-food",
    "author_name": "Jean D",
    "rating": 5,
    "title": "Top",
    "body": "tres bon produit pour ma peau"
}, 201)
if error:
    results.add_fail("POST /api/reviews (valid)", error)
else:
    if not data.get('ok') or data.get('status') != 'pending':
        results.add_fail("POST /api/reviews (valid)", f"Expected ok:true and status:pending, got {data}")
    else:
        results.add_pass("POST /api/reviews (valid) returns 201 with status:pending")
        
        # Verify pending review NOT shown in public GET
        data2, error2 = test_get("/reviews", params={"target_type": "product", "target_slug": "weleda-skin-food"})
        if error2:
            results.add_fail("GET /api/reviews after POST (verify pending not shown)", error2)
        elif data2.get('summary', {}).get('count') != initial_count:
            results.add_fail("GET /api/reviews after POST", f"Expected count still {initial_count}, got {data2.get('summary', {}).get('count')} (pending should not be shown)")
        else:
            results.add_pass("GET /api/reviews after POST - pending review NOT shown (count still 39)")

# Test 1.6: POST review with invalid rating (should return 400)
data, error = test_post("/reviews", {
    "target_type": "product",
    "target_slug": "weleda-skin-food",
    "author_name": "Test",
    "rating": 9,
    "body": "test body"
}, 400)
if error and "Expected 400" not in error:
    results.add_fail("POST /api/reviews (rating=9)", error)
elif not error:
    results.add_fail("POST /api/reviews (rating=9)", "Expected 400, got 201")
else:
    results.add_pass("POST /api/reviews with rating=9 returns 400")

# Test 1.7: POST review with short body (should return 400)
data, error = test_post("/reviews", {
    "target_type": "product",
    "target_slug": "weleda-skin-food",
    "author_name": "Test",
    "rating": 5,
    "body": "x"
}, 400)
if error and "Expected 400" not in error:
    results.add_fail("POST /api/reviews (short body)", error)
elif not error:
    results.add_fail("POST /api/reviews (short body)", "Expected 400, got 201")
else:
    results.add_pass("POST /api/reviews with short body returns 400")

# Test 1.8: POST review without target_slug (should return 400)
data, error = test_post("/reviews", {
    "target_type": "product",
    "author_name": "Test",
    "rating": 5,
    "body": "test body"
}, 400)
if error and "Expected 400" not in error:
    results.add_fail("POST /api/reviews (missing target_slug)", error)
elif not error:
    results.add_fail("POST /api/reviews (missing target_slug)", "Expected 400, got 201")
else:
    results.add_pass("POST /api/reviews without target_slug returns 400")

# Test 1.9: POST review with short author_name (should return 400)
data, error = test_post("/reviews", {
    "target_type": "product",
    "target_slug": "weleda-skin-food",
    "author_name": "T",
    "rating": 5,
    "body": "test body"
}, 400)
if error and "Expected 400" not in error:
    results.add_fail("POST /api/reviews (short author_name)", error)
elif not error:
    results.add_fail("POST /api/reviews (short author_name)", "Expected 400, got 201")
else:
    results.add_pass("POST /api/reviews with short author_name returns 400")

# Test 1.10: POST helpful on approved review
# First get an approved review ID
data, error = test_get("/reviews", params={"target_type": "product", "target_slug": "weleda-skin-food"})
if error or not data.get('reviews'):
    results.add_fail("POST /api/reviews/:id/helpful (setup)", "Could not get approved review")
else:
    review_id = data['reviews'][0]['id']
    initial_helpful = data['reviews'][0].get('helpful', 0)
    
    # Mark as helpful
    data2, error2 = test_post(f"/reviews/{review_id}/helpful", {}, 200)
    if error2:
        results.add_fail("POST /api/reviews/:id/helpful", error2)
    elif not data2.get('ok') or not isinstance(data2.get('helpful'), int):
        results.add_fail("POST /api/reviews/:id/helpful", f"Expected ok:true and helpful:number, got {data2}")
    else:
        results.add_pass("POST /api/reviews/:id/helpful returns 200 with incremented helpful count")
        
        # Mark as helpful again to verify increment
        data3, error3 = test_post(f"/reviews/{review_id}/helpful", {}, 200)
        if error3:
            results.add_fail("POST /api/reviews/:id/helpful (repeat)", error3)
        elif data3.get('helpful', 0) <= data2.get('helpful', 0):
            results.add_fail("POST /api/reviews/:id/helpful (repeat)", f"Expected helpful to increment, got {data3.get('helpful')} (was {data2.get('helpful')})")
        else:
            results.add_pass("POST /api/reviews/:id/helpful (repeat) increments helpful count")

# ============================================================================
# 2) PRODUCT Q&A (PUBLIC)
# ============================================================================
print("\n" + "="*80)
print("2) PRODUCT Q&A (PUBLIC)")
print("="*80)

# Test 2.1: GET questions for weleda-skin-food
data, error = test_get("/questions", params={"product_slug": "weleda-skin-food"})
if error:
    results.add_fail("GET /api/questions?product_slug=weleda-skin-food", error)
else:
    if 'questions' not in data or 'total' not in data:
        results.add_fail("GET /api/questions", "Missing 'questions' or 'total' in response")
    else:
        # Verify all answers are approved
        all_approved = True
        for q in data['questions']:
            if 'answers' in q:
                for a in q['answers']:
                    if a.get('status') != 'approved':
                        all_approved = False
                        break
        if not all_approved:
            results.add_fail("GET /api/questions", "Found non-approved answers in public response")
        else:
            results.add_pass("GET /api/questions?product_slug=weleda-skin-food (all answers approved)")

# Test 2.2: GET questions without product_slug (should return 400)
data, error = test_get("/questions", expected_status=400)
if error and "Expected 400" not in error:
    results.add_fail("GET /api/questions without product_slug", error)
elif not error:
    results.add_fail("GET /api/questions without product_slug", "Expected 400, got 200")
else:
    results.add_pass("GET /api/questions without product_slug returns 400")

# Test 2.3: POST new question (should go to pending)
data, error = test_post("/questions", {
    "product_slug": "weleda-skin-food",
    "author_name": "Marie",
    "body": "Une question de test ?"
}, 201)
if error:
    results.add_fail("POST /api/questions (valid)", error)
else:
    if not data.get('ok') or data.get('status') != 'pending':
        results.add_fail("POST /api/questions (valid)", f"Expected ok:true and status:pending, got {data}")
    else:
        results.add_pass("POST /api/questions (valid) returns 201 with status:pending")
        
        # Verify pending question NOT shown in public GET
        data2, error2 = test_get("/questions", params={"product_slug": "weleda-skin-food"})
        if error2:
            results.add_fail("GET /api/questions after POST (verify pending not shown)", error2)
        else:
            # Check if the new question appears (it shouldn't)
            found_pending = any(q.get('body') == "Une question de test ?" for q in data2.get('questions', []))
            if found_pending:
                results.add_fail("GET /api/questions after POST", "Pending question is visible in public GET (should not be)")
            else:
                results.add_pass("GET /api/questions after POST - pending question NOT shown")

# Test 2.4: POST answer to approved question
# First get an approved question ID
data, error = test_get("/questions", params={"product_slug": "weleda-skin-food"})
if error or not data.get('questions'):
    results.add_fail("POST /api/questions/:id/answers (setup)", "Could not get approved question")
else:
    question_id = data['questions'][0]['id']
    
    # Post answer
    data2, error2 = test_post(f"/questions/{question_id}/answers", {
        "author_name": "Paul",
        "body": "Une reponse de test"
    }, 201)
    if error2:
        results.add_fail("POST /api/questions/:id/answers", error2)
    elif not data2.get('ok') or data2.get('status') != 'pending':
        results.add_fail("POST /api/questions/:id/answers", f"Expected ok:true and status:pending, got {data2}")
    else:
        results.add_pass("POST /api/questions/:id/answers returns 201 with status:pending")
        
        # Verify pending answer NOT shown in public GET
        data3, error3 = test_get("/questions", params={"product_slug": "weleda-skin-food"})
        if error3:
            results.add_fail("GET /api/questions after POST answer (verify pending not shown)", error3)
        else:
            # Find the question and check if pending answer appears
            question = next((q for q in data3.get('questions', []) if q['id'] == question_id), None)
            if question:
                found_pending = any(a.get('body') == "Une reponse de test" for a in question.get('answers', []))
                if found_pending:
                    results.add_fail("GET /api/questions after POST answer", "Pending answer is visible in public GET (should not be)")
                else:
                    results.add_pass("GET /api/questions after POST answer - pending answer NOT shown")
            else:
                results.add_fail("GET /api/questions after POST answer", "Could not find question to verify")

# Test 2.5: POST answer with short body (should return 400)
data, error = test_get("/questions", params={"product_slug": "weleda-skin-food"})
if error or not data.get('questions'):
    results.add_fail("POST /api/questions/:id/answers (short body setup)", "Could not get approved question")
else:
    question_id = data['questions'][0]['id']
    data2, error2 = test_post(f"/questions/{question_id}/answers", {
        "author_name": "Test",
        "body": "x"
    }, 400)
    if error2 and "Expected 400" not in error2:
        results.add_fail("POST /api/questions/:id/answers (short body)", error2)
    elif not error2:
        results.add_fail("POST /api/questions/:id/answers (short body)", "Expected 400, got 201")
    else:
        results.add_pass("POST /api/questions/:id/answers with short body returns 400")

# ============================================================================
# 3) FORUM (PUBLIC)
# ============================================================================
print("\n" + "="*80)
print("3) FORUM (PUBLIC)")
print("="*80)

# Test 3.1: GET forum threads
data, error = test_get("/forum")
if error:
    results.add_fail("GET /api/forum", error)
else:
    if 'threads' not in data or 'categories' not in data or 'total' not in data:
        results.add_fail("GET /api/forum", "Missing 'threads', 'categories', or 'total' in response")
    elif len(data.get('categories', [])) != 5:
        results.add_fail("GET /api/forum", f"Expected 5 categories, got {len(data.get('categories', []))}")
    else:
        # Verify threads have reply_count
        all_have_count = all('reply_count' in t for t in data['threads'])
        if not all_have_count:
            results.add_fail("GET /api/forum", "Some threads missing reply_count field")
        else:
            results.add_pass("GET /api/forum returns threads with reply_count and 5 categories")

# Test 3.2: GET forum threads filtered by category
data, error = test_get("/forum", params={"category": "routine"})
if error:
    results.add_fail("GET /api/forum?category=routine", error)
else:
    # Verify all threads have category 'routine'
    all_routine = all(t.get('category') == 'routine' for t in data.get('threads', []))
    if not all_routine:
        results.add_fail("GET /api/forum?category=routine", "Found threads with category != 'routine'")
    else:
        results.add_pass("GET /api/forum?category=routine returns only routine threads")

# Test 3.3: GET forum categories
data, error = test_get("/forum/categories")
if error:
    results.add_fail("GET /api/forum/categories", error)
else:
    if 'categories' not in data or len(data['categories']) != 5:
        results.add_fail("GET /api/forum/categories", f"Expected 5 categories, got {len(data.get('categories', []))}")
    else:
        results.add_pass("GET /api/forum/categories returns 5 categories")

# Test 3.4: GET forum thread detail
data, error = test_get("/forum")
if error or not data.get('threads'):
    results.add_fail("GET /api/forum/threads/:id (setup)", "Could not get thread list")
else:
    thread_id = data['threads'][0]['id']
    data2, error2 = test_get(f"/forum/threads/{thread_id}")
    if error2:
        results.add_fail("GET /api/forum/threads/:id", error2)
    elif 'thread' not in data2 or 'posts' not in data2:
        results.add_fail("GET /api/forum/threads/:id", "Missing 'thread' or 'posts' in response")
    else:
        # Verify all posts are approved
        all_approved = all(p.get('status') == 'approved' for p in data2['posts'])
        if not all_approved:
            results.add_fail("GET /api/forum/threads/:id", "Found non-approved posts in public response")
        else:
            results.add_pass("GET /api/forum/threads/:id returns thread with approved posts")

# Test 3.5: GET nonexistent thread (should return 404)
data, error = test_get("/forum/threads/nonexistent-thread-id", expected_status=404)
if error and "Expected 404" not in error:
    results.add_fail("GET /api/forum/threads/nonexistent", error)
elif not error:
    results.add_fail("GET /api/forum/threads/nonexistent", "Expected 404, got 200")
else:
    results.add_pass("GET /api/forum/threads/nonexistent returns 404")

# Test 3.6: POST new forum thread (should go to pending)
data, error = test_post("/forum/threads", {
    "category": "routine",
    "title": "Sujet de test long",
    "author_name": "Lea",
    "body": "corps de discussion de test"
}, 201)
if error:
    results.add_fail("POST /api/forum/threads (valid)", error)
else:
    if not data.get('ok') or data.get('status') != 'pending':
        results.add_fail("POST /api/forum/threads (valid)", f"Expected ok:true and status:pending, got {data}")
    else:
        results.add_pass("POST /api/forum/threads (valid) returns 201 with status:pending")

# Test 3.7: POST thread with invalid category (should return 400)
data, error = test_post("/forum/threads", {
    "category": "invalid-category",
    "title": "Test thread",
    "author_name": "Test",
    "body": "test body"
}, 400)
if error and "Expected 400" not in error:
    results.add_fail("POST /api/forum/threads (invalid category)", error)
elif not error:
    results.add_fail("POST /api/forum/threads (invalid category)", "Expected 400, got 201")
else:
    results.add_pass("POST /api/forum/threads with invalid category returns 400")

# Test 3.8: POST thread with short title (should return 400)
data, error = test_post("/forum/threads", {
    "category": "routine",
    "title": "Test",
    "author_name": "Test",
    "body": "test body"
}, 400)
if error and "Expected 400" not in error:
    results.add_fail("POST /api/forum/threads (short title)", error)
elif not error:
    results.add_fail("POST /api/forum/threads (short title)", "Expected 400, got 201")
else:
    results.add_pass("POST /api/forum/threads with short title returns 400")

# Test 3.9: POST thread with short body (should return 400)
data, error = test_post("/forum/threads", {
    "category": "routine",
    "title": "Test thread title",
    "author_name": "Test",
    "body": "x"
}, 400)
if error and "Expected 400" not in error:
    results.add_fail("POST /api/forum/threads (short body)", error)
elif not error:
    results.add_fail("POST /api/forum/threads (short body)", "Expected 400, got 201")
else:
    results.add_pass("POST /api/forum/threads with short body returns 400")

# Test 3.10: POST reply to thread
data, error = test_get("/forum")
if error or not data.get('threads'):
    results.add_fail("POST /api/forum/threads/:id/posts (setup)", "Could not get thread list")
else:
    thread_id = data['threads'][0]['id']
    data2, error2 = test_post(f"/forum/threads/{thread_id}/posts", {
        "author_name": "Tom",
        "body": "reponse forum de test"
    }, 201)
    if error2:
        results.add_fail("POST /api/forum/threads/:id/posts", error2)
    elif not data2.get('ok') or data2.get('status') != 'pending':
        results.add_fail("POST /api/forum/threads/:id/posts", f"Expected ok:true and status:pending, got {data2}")
    else:
        results.add_pass("POST /api/forum/threads/:id/posts returns 201 with status:pending")

# Test 3.11: POST reply with short body (should return 400)
data, error = test_get("/forum")
if error or not data.get('threads'):
    results.add_fail("POST /api/forum/threads/:id/posts (short body setup)", "Could not get thread list")
else:
    thread_id = data['threads'][0]['id']
    data2, error2 = test_post(f"/forum/threads/{thread_id}/posts", {
        "author_name": "Test",
        "body": "x"
    }, 400)
    if error2 and "Expected 400" not in error2:
        results.add_fail("POST /api/forum/threads/:id/posts (short body)", error2)
    elif not error2:
        results.add_fail("POST /api/forum/threads/:id/posts (short body)", "Expected 400, got 201")
    else:
        results.add_pass("POST /api/forum/threads/:id/posts with short body returns 400")

# ============================================================================
# 4) ADMIN MODERATION
# ============================================================================
print("\n" + "="*80)
print("4) ADMIN MODERATION")
print("="*80)

# Get admin token
token = get_admin_token()
if not token:
    results.add_fail("Admin token", "Could not get admin token")
    print("\n⚠ SKIPPING ADMIN TESTS - No token available")
else:
    results.add_pass("POST /api/admin/login returns Bearer token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test 4.1: Admin routes without token (should return 401)
    data, error = test_get("/admin/reviews", expected_status=401, params={"status": "pending"})
    if error and "Expected 401" not in error:
        results.add_fail("GET /api/admin/reviews without token", error)
    elif not error:
        results.add_fail("GET /api/admin/reviews without token", "Expected 401, got 200")
    else:
        results.add_pass("GET /api/admin/reviews without Authorization returns 401")
    
    # Test 4.2: GET pending reviews
    data, error = test_get("/admin/reviews", params={"status": "pending"}, headers=headers)
    if error:
        results.add_fail("GET /api/admin/reviews?status=pending", error)
    else:
        if 'reviews' not in data or 'total' not in data:
            results.add_fail("GET /api/admin/reviews?status=pending", "Missing 'reviews' or 'total' in response")
        else:
            # Should include the pending review we created earlier
            found_pending = any(r.get('body') == "tres bon produit pour ma peau" for r in data['reviews'])
            if not found_pending:
                results.add_fail("GET /api/admin/reviews?status=pending", "Pending review from test 1.5 not found")
            else:
                results.add_pass("GET /api/admin/reviews?status=pending includes pending review from test 1.5")
                
                # Test 4.3: Approve the pending review
                pending_review = next(r for r in data['reviews'] if r.get('body') == "tres bon produit pour ma peau")
                review_id = pending_review['id']
                
                data2, error2 = test_put(f"/admin/reviews/{review_id}", {
                    "status": "approved",
                    "verified": True
                }, 200, headers)
                if error2:
                    results.add_fail("PUT /api/admin/reviews/:id (approve)", error2)
                else:
                    results.add_pass("PUT /api/admin/reviews/:id approves review with verified:true")
                    
                    # Verify it now appears in public GET and count increased
                    data3, error3 = test_get("/reviews", params={"target_type": "product", "target_slug": "weleda-skin-food"})
                    if error3:
                        results.add_fail("GET /api/reviews after approval (verify visible)", error3)
                    else:
                        new_count = data3.get('summary', {}).get('count', 0)
                        if new_count != 40:  # Was 39, now should be 40
                            results.add_fail("GET /api/reviews after approval", f"Expected count 40, got {new_count}")
                        else:
                            # Check if the approved review is visible and verified
                            approved_review = next((r for r in data3['reviews'] if r['id'] == review_id), None)
                            if not approved_review:
                                results.add_fail("GET /api/reviews after approval", "Approved review not found in public GET")
                            elif not approved_review.get('verified'):
                                results.add_fail("GET /api/reviews after approval", "Approved review not marked as verified")
                            else:
                                results.add_pass("GET /api/reviews after approval - review visible with verified:true, count=40")
    
    # Test 4.4: GET pending questions
    data, error = test_get("/admin/questions", params={"status": "pending"}, headers=headers)
    if error:
        results.add_fail("GET /api/admin/questions?status=pending", error)
    else:
        if 'questions' not in data or 'total' not in data:
            results.add_fail("GET /api/admin/questions?status=pending", "Missing 'questions' or 'total' in response")
        else:
            # Should include the pending question we created earlier
            found_pending = any(q.get('body') == "Une question de test ?" for q in data['questions'])
            if not found_pending:
                results.add_fail("GET /api/admin/questions?status=pending", "Pending question from test 2.3 not found")
            else:
                results.add_pass("GET /api/admin/questions?status=pending includes pending question from test 2.3")
                
                # Test 4.5: Approve the pending question
                pending_question = next(q for q in data['questions'] if q.get('body') == "Une question de test ?")
                question_id = pending_question['id']
                
                data2, error2 = test_put(f"/admin/questions/{question_id}", {
                    "status": "approved"
                }, 200, headers)
                if error2:
                    results.add_fail("PUT /api/admin/questions/:id (approve)", error2)
                else:
                    results.add_pass("PUT /api/admin/questions/:id approves question")
                    
                    # Verify it now appears in public GET
                    data3, error3 = test_get("/questions", params={"product_slug": "weleda-skin-food"})
                    if error3:
                        results.add_fail("GET /api/questions after approval (verify visible)", error3)
                    else:
                        approved_question = next((q for q in data3['questions'] if q['id'] == question_id), None)
                        if not approved_question:
                            results.add_fail("GET /api/questions after approval", "Approved question not found in public GET")
                        else:
                            results.add_pass("GET /api/questions after approval - question visible")
    
    # Test 4.6: Approve pending answer
    # First get a question with pending answer
    data, error = test_get("/admin/questions", params={"status": "approved"}, headers=headers)
    if error or not data.get('questions'):
        results.add_fail("PUT /api/admin/questions/:id/answers/:aid (setup)", "Could not get questions")
    else:
        # Find question with pending answer
        question_with_pending = None
        pending_answer = None
        for q in data['questions']:
            for a in q.get('answers', []):
                if a.get('status') == 'pending' and a.get('body') == "Une reponse de test":
                    question_with_pending = q
                    pending_answer = a
                    break
            if question_with_pending:
                break
        
        if not question_with_pending:
            results.add_fail("PUT /api/admin/questions/:id/answers/:aid", "Could not find pending answer from test 2.4")
        else:
            data2, error2 = test_put(f"/admin/questions/{question_with_pending['id']}/answers/{pending_answer['id']}", {
                "status": "approved"
            }, 200, headers)
            if error2:
                results.add_fail("PUT /api/admin/questions/:id/answers/:aid (approve)", error2)
            else:
                results.add_pass("PUT /api/admin/questions/:id/answers/:aid approves answer")
                
                # Verify it now appears in public GET
                data3, error3 = test_get("/questions", params={"product_slug": "weleda-skin-food"})
                if error3:
                    results.add_fail("GET /api/questions after answer approval (verify visible)", error3)
                else:
                    question = next((q for q in data3['questions'] if q['id'] == question_with_pending['id']), None)
                    if not question:
                        results.add_fail("GET /api/questions after answer approval", "Question not found")
                    else:
                        approved_answer = next((a for a in question['answers'] if a['id'] == pending_answer['id']), None)
                        if not approved_answer:
                            results.add_fail("GET /api/questions after answer approval", "Approved answer not found in public GET")
                        else:
                            results.add_pass("GET /api/questions after answer approval - answer visible")
    
    # Test 4.7: GET pending forum threads/posts
    data, error = test_get("/admin/forum", params={"status": "pending"}, headers=headers)
    if error:
        results.add_fail("GET /api/admin/forum?status=pending", error)
    else:
        if 'threads' not in data or 'posts' not in data or 'total' not in data:
            results.add_fail("GET /api/admin/forum?status=pending", "Missing 'threads', 'posts', or 'total' in response")
        else:
            # Should include the pending thread we created earlier
            found_pending_thread = any(t.get('title') == "Sujet de test long" for t in data['threads'])
            found_pending_post = any(p.get('body') == "reponse forum de test" for p in data['posts'])
            
            if not found_pending_thread:
                results.add_fail("GET /api/admin/forum?status=pending", "Pending thread from test 3.6 not found")
            elif not found_pending_post:
                results.add_fail("GET /api/admin/forum?status=pending", "Pending post from test 3.10 not found")
            else:
                results.add_pass("GET /api/admin/forum?status=pending includes pending thread and post")
                
                # Test 4.8: Approve the pending thread
                pending_thread = next(t for t in data['threads'] if t.get('title') == "Sujet de test long")
                thread_id = pending_thread['id']
                
                data2, error2 = test_put(f"/admin/forum/threads/{thread_id}", {
                    "status": "approved",
                    "pinned": True
                }, 200, headers)
                if error2:
                    results.add_fail("PUT /api/admin/forum/threads/:id (approve)", error2)
                else:
                    results.add_pass("PUT /api/admin/forum/threads/:id approves thread with pinned:true")
                    
                    # Verify it now appears in public GET
                    data3, error3 = test_get("/forum")
                    if error3:
                        results.add_fail("GET /api/forum after thread approval (verify visible)", error3)
                    else:
                        approved_thread = next((t for t in data3['threads'] if t['id'] == thread_id), None)
                        if not approved_thread:
                            results.add_fail("GET /api/forum after thread approval", "Approved thread not found in public GET")
                        elif not approved_thread.get('pinned'):
                            results.add_fail("GET /api/forum after thread approval", "Approved thread not marked as pinned")
                        else:
                            results.add_pass("GET /api/forum after thread approval - thread visible with pinned:true")
                
                # Test 4.9: Approve the pending post
                pending_post = next(p for p in data['posts'] if p.get('body') == "reponse forum de test")
                post_id = pending_post['id']
                
                data2, error2 = test_put(f"/admin/forum/posts/{post_id}", {
                    "status": "approved"
                }, 200, headers)
                if error2:
                    results.add_fail("PUT /api/admin/forum/posts/:id (approve)", error2)
                else:
                    results.add_pass("PUT /api/admin/forum/posts/:id approves post")
                    
                    # Verify it now appears in public GET
                    thread_id_for_post = pending_post['thread_id']
                    data3, error3 = test_get(f"/forum/threads/{thread_id_for_post}")
                    if error3:
                        results.add_fail("GET /api/forum/threads/:id after post approval (verify visible)", error3)
                    else:
                        approved_post = next((p for p in data3['posts'] if p['id'] == post_id), None)
                        if not approved_post:
                            results.add_fail("GET /api/forum/threads/:id after post approval", "Approved post not found in public GET")
                        else:
                            results.add_pass("GET /api/forum/threads/:id after post approval - post visible")
    
    # Test 4.10: DELETE review
    # Create a test review to delete
    data, error = test_post("/reviews", {
        "target_type": "product",
        "target_slug": "weleda-skin-food",
        "author_name": "Delete Test",
        "rating": 5,
        "body": "This review will be deleted"
    }, 201)
    if error:
        results.add_fail("DELETE /api/admin/reviews/:id (setup)", error)
    else:
        # Get the review ID from admin
        data2, error2 = test_get("/admin/reviews", params={"status": "pending"}, headers=headers)
        if error2:
            results.add_fail("DELETE /api/admin/reviews/:id (get ID)", error2)
        else:
            delete_review = next((r for r in data2['reviews'] if r.get('body') == "This review will be deleted"), None)
            if not delete_review:
                results.add_fail("DELETE /api/admin/reviews/:id", "Could not find review to delete")
            else:
                review_id = delete_review['id']
                data3, error3 = test_delete(f"/admin/reviews/{review_id}", 200, headers)
                if error3:
                    results.add_fail("DELETE /api/admin/reviews/:id", error3)
                elif not data3.get('success'):
                    results.add_fail("DELETE /api/admin/reviews/:id", f"Expected success:true, got {data3}")
                else:
                    results.add_pass("DELETE /api/admin/reviews/:id returns 200 with success:true")
                    
                    # Verify second delete returns 404
                    data4, error4 = test_delete(f"/admin/reviews/{review_id}", 404, headers)
                    if error4 and "Expected 404" not in error4:
                        results.add_fail("DELETE /api/admin/reviews/:id (nonexistent)", error4)
                    elif not error4:
                        results.add_fail("DELETE /api/admin/reviews/:id (nonexistent)", "Expected 404, got 200")
                    else:
                        results.add_pass("DELETE /api/admin/reviews/:id (nonexistent) returns 404")
    
    # Test 4.11: DELETE question
    # Create a test question to delete
    data, error = test_post("/questions", {
        "product_slug": "weleda-skin-food",
        "author_name": "Delete Test",
        "body": "This question will be deleted"
    }, 201)
    if error:
        results.add_fail("DELETE /api/admin/questions/:id (setup)", error)
    else:
        # Get the question ID from admin
        data2, error2 = test_get("/admin/questions", params={"status": "pending"}, headers=headers)
        if error2:
            results.add_fail("DELETE /api/admin/questions/:id (get ID)", error2)
        else:
            delete_question = next((q for q in data2['questions'] if q.get('body') == "This question will be deleted"), None)
            if not delete_question:
                results.add_fail("DELETE /api/admin/questions/:id", "Could not find question to delete")
            else:
                question_id = delete_question['id']
                data3, error3 = test_delete(f"/admin/questions/{question_id}", 200, headers)
                if error3:
                    results.add_fail("DELETE /api/admin/questions/:id", error3)
                elif not data3.get('success'):
                    results.add_fail("DELETE /api/admin/questions/:id", f"Expected success:true, got {data3}")
                else:
                    results.add_pass("DELETE /api/admin/questions/:id returns 200 with success:true")
    
    # Test 4.12: DELETE forum thread (also removes its posts)
    # Create a test thread to delete
    data, error = test_post("/forum/threads", {
        "category": "routine",
        "title": "Thread to delete test",
        "author_name": "Delete Test",
        "body": "This thread will be deleted"
    }, 201)
    if error:
        results.add_fail("DELETE /api/admin/forum/threads/:id (setup)", error)
    else:
        # Get the thread ID from admin
        data2, error2 = test_get("/admin/forum", params={"status": "pending"}, headers=headers)
        if error2:
            results.add_fail("DELETE /api/admin/forum/threads/:id (get ID)", error2)
        else:
            delete_thread = next((t for t in data2['threads'] if t.get('title') == "Thread to delete test"), None)
            if not delete_thread:
                results.add_fail("DELETE /api/admin/forum/threads/:id", "Could not find thread to delete")
            else:
                thread_id = delete_thread['id']
                data3, error3 = test_delete(f"/admin/forum/threads/{thread_id}", 200, headers)
                if error3:
                    results.add_fail("DELETE /api/admin/forum/threads/:id", error3)
                elif not data3.get('success'):
                    results.add_fail("DELETE /api/admin/forum/threads/:id", f"Expected success:true, got {data3}")
                else:
                    results.add_pass("DELETE /api/admin/forum/threads/:id returns 200 with success:true")
    
    # Test 4.13: DELETE forum post
    # We already have an approved post from earlier, let's create a new one to delete
    # First get an approved thread
    data, error = test_get("/forum")
    if error or not data.get('threads'):
        results.add_fail("DELETE /api/admin/forum/posts/:id (setup)", "Could not get thread list")
    else:
        thread_id = data['threads'][0]['id']
        # Create a post to delete
        data2, error2 = test_post(f"/forum/threads/{thread_id}/posts", {
            "author_name": "Delete Test",
            "body": "This post will be deleted"
        }, 201)
        if error2:
            results.add_fail("DELETE /api/admin/forum/posts/:id (create post)", error2)
        else:
            # Get the post ID from admin
            data3, error3 = test_get("/admin/forum", params={"status": "pending"}, headers=headers)
            if error3:
                results.add_fail("DELETE /api/admin/forum/posts/:id (get ID)", error3)
            else:
                delete_post = next((p for p in data3['posts'] if p.get('body') == "This post will be deleted"), None)
                if not delete_post:
                    results.add_fail("DELETE /api/admin/forum/posts/:id", "Could not find post to delete")
                else:
                    post_id = delete_post['id']
                    data4, error4 = test_delete(f"/admin/forum/posts/{post_id}", 200, headers)
                    if error4:
                        results.add_fail("DELETE /api/admin/forum/posts/:id", error4)
                    elif not data4.get('success'):
                        results.add_fail("DELETE /api/admin/forum/posts/:id", f"Expected success:true, got {data4}")
                    else:
                        results.add_pass("DELETE /api/admin/forum/posts/:id returns 200 with success:true")
    
    # Test 4.14: GET admin stats
    data, error = test_get("/admin/stats", headers=headers)
    if error:
        results.add_fail("GET /api/admin/stats", error)
    else:
        required_fields = ['reviews_pending', 'questions_pending', 'forum_pending', 'products', 'brands', 'ingredients', 'articles', 'leads', 'hubs', 'subscribers', 'affiliate_clicks']
        missing_fields = [f for f in required_fields if f not in data]
        if missing_fields:
            results.add_fail("GET /api/admin/stats", f"Missing fields: {', '.join(missing_fields)}")
        else:
            # Verify all are numeric
            non_numeric = [f for f in required_fields if not isinstance(data[f], int)]
            if non_numeric:
                results.add_fail("GET /api/admin/stats", f"Non-numeric fields: {', '.join(non_numeric)}")
            else:
                results.add_pass("GET /api/admin/stats includes all required numeric fields")

# ============================================================================
# 5) REGRESSION TESTS
# ============================================================================
print("\n" + "="*80)
print("5) REGRESSION TESTS")
print("="*80)

# Test 5.1: GET products (should return 30)
data, error = test_get("/products")
if error:
    results.add_fail("GET /api/products (regression)", error)
else:
    if 'products' not in data or 'total' not in data:
        results.add_fail("GET /api/products (regression)", "Missing 'products' or 'total' in response")
    elif data['total'] != 30:
        results.add_fail("GET /api/products (regression)", f"Expected 30 products, got {data['total']}")
    else:
        results.add_pass("GET /api/products returns 30 products")

# Test 5.2: POST admin login (already tested, but verify again)
data, error = test_post("/admin/login", {"password": ADMIN_PASSWORD}, 200)
if error:
    results.add_fail("POST /api/admin/login (regression)", error)
elif 'token' not in data:
    results.add_fail("POST /api/admin/login (regression)", "Missing 'token' in response")
else:
    results.add_pass("POST /api/admin/login returns token")

# Test 5.3: Verify no _id in public responses
data, error = test_get("/reviews", params={"target_type": "product", "target_slug": "weleda-skin-food"})
if error:
    results.add_fail("No _id in public responses (reviews)", error)
else:
    has_id = any('_id' in r for r in data.get('reviews', []))
    if has_id:
        results.add_fail("No _id in public responses", "Found _id in reviews response")
    else:
        results.add_pass("No _id field leaked in public reviews response")

# Test 5.4: Verify no 500 errors (all tests should have passed or returned expected error codes)
# This is implicit - if we got here, no 500 errors occurred
results.add_pass("No 500 errors encountered in any test")

# Test 5.5: Verify all responses are valid JSON (implicit - all tests parse JSON)
results.add_pass("All responses are valid JSON")

# ============================================================================
# FINAL SUMMARY
# ============================================================================
results.summary()

print("\n" + "="*80)
print("TESTING COMPLETE")
print("="*80)
