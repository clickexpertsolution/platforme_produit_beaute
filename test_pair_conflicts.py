#!/usr/bin/env python3
"""
Additional test to verify pair conflicts can be triggered
"""

import requests
import json

BASE_URL = "https://git-pull-install.preview.emergentagent.com/api"

def test_profile(profile_name, payload):
    print(f"\n{'='*80}")
    print(f"Testing: {profile_name}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    print(f"{'='*80}")
    
    response = requests.post(f"{BASE_URL}/finder", json=payload, timeout=10)
    if response.status_code == 200:
        data = response.json()
        routine = data.get('routine', {})
        
        # Morning
        print("\n🌅 MORNING ROUTINE:")
        morning = routine.get('morning', [])
        for step in morning:
            product = step.get('product', {})
            print(f"  {step.get('order')}. {product.get('name')} ({product.get('category')})")
            print(f"     Ingredients: {', '.join(product.get('ingredients', []))}")
        
        morning_warnings = routine.get('warnings', {}).get('morning', [])
        print(f"\n  ⚠️  Morning Warnings: {len(morning_warnings)}")
        for w in morning_warnings:
            print(f"     - [{w.get('type')}] {w.get('title', {}).get('en')} (severity: {w.get('severity')})")
            print(f"       Products: {', '.join(w.get('products', []))}")
        
        # Evening
        print("\n🌙 EVENING ROUTINE:")
        evening = routine.get('evening', [])
        for step in evening:
            product = step.get('product', {})
            print(f"  {step.get('order')}. {product.get('name')} ({product.get('category')})")
            print(f"     Ingredients: {', '.join(product.get('ingredients', []))}")
        
        evening_warnings = routine.get('warnings', {}).get('evening', [])
        print(f"\n  ⚠️  Evening Warnings: {len(evening_warnings)}")
        for w in evening_warnings:
            print(f"     - [{w.get('type')}] {w.get('title', {}).get('en')} (severity: {w.get('severity')})")
            print(f"       Products: {', '.join(w.get('products', []))}")
    else:
        print(f"❌ Error: Status {response.status_code}")

# Test various profiles to see which ones trigger pair conflicts
profiles = [
    ("Aging + Pigmentation (High Budget)", {
        "skin_type": "normal",
        "concerns": ["aging", "pigmentation"],
        "budget": "high"
    }),
    ("Dry + Aging (High Budget)", {
        "skin_type": "dry",
        "concerns": ["aging", "dryness"],
        "budget": "high"
    }),
    ("Combination + All Concerns (High Budget)", {
        "skin_type": "combination",
        "concerns": ["aging", "pigmentation", "acne"],
        "budget": "high"
    }),
    ("Normal + Aging Only (High Budget)", {
        "skin_type": "normal",
        "concerns": ["aging"],
        "budget": "high"
    }),
]

for profile_name, payload in profiles:
    test_profile(profile_name, payload)

print("\n" + "="*80)
print("SUMMARY: Check if any profile triggered pair conflicts above")
print("="*80)
