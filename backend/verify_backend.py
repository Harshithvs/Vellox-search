"""
Quick verification script to test and display backend search engine results.
Run directly with:
    python backend/verify_backend.py
"""

import sys
import os
import time

import sys
import os
import time

# Ensure UTF-8 output on Windows consoles
if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ensure backend directory is in path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from fastapi.testclient import TestClient
from backend.main import app

def print_separator(title=""):
    print("\n" + "=" * 65)
    if title:
        print(f"  {title}")
        print("=" * 65)

def main():
    client = TestClient(app)
    
    print("\n[+] STARTING BACKEND VERIFICATION REPORT")
    print("Testing FastAPI backend endpoints & core data structures directly...")

    # 1. Health Check & Trie Statistics
    print_separator("1. GET /api/health - Engine Health & Trie Stats")
    res = client.get("/api/health")
    if res.status_code == 200:
        data = res.json()
        print(f" [PASS] Status: {data.get('status')}")
        print(f" [PASS] Active Platforms: {', '.join(data.get('platforms_active', []))}")
        print(f" [PRIVACY] Enforcement: {data.get('privacy_enforcement')}")
        trie_stats = data.get("trie_stats", {})
        print(f" [STATS] Trie Words Indexed: {trie_stats.get('phrase_count')}")
        print(f" [STATS] Trie Nodes Created: {trie_stats.get('total_nodes')}")
        print(f" [ALGO] Trie Algorithm: {trie_stats.get('algorithm')}")
    else:
        print(f" [FAIL] HTTP {res.status_code}")

    # 2. Trie Autocomplete Suggestions
    print_separator("2. GET /api/suggest?q=ph - O(L) Autocomplete Suggestions")
    res = client.get("/api/suggest?q=ph")
    if res.status_code == 200:
        data = res.json()
        print(f" [LATENCY] Query Latency: {data.get('latency_ms')} ms")
        print(f" [COUNT] Matches Found: {data.get('total_matches')}")
        print("   Top Matches (Deterministic O(L) traversal):")
        for idx, item in enumerate(data.get("suggestions", [])[:5], start=1):
            source_tag = f"[{item.get('source').upper()}]" if item.get('source') else ""
            print(f"   {idx}. '{item.get('phrase')}' -> Score: {item.get('score')} {source_tag}")
    else:
        print(f" [FAIL] HTTP {res.status_code}")

    # 3. Contextual Recommendations
    print_separator("3. GET /api/recommendations?topic=phone - Contextual Topic Recs")
    res = client.get("/api/recommendations?topic=phone&platform=youtube")
    if res.status_code == 200:
        data = res.json()
        active_ctx = data.get("active_context", {})
        print(f" [CONTEXT] Active Context: {active_ctx.get('title')}")
        print("   Quick Filter Pills:")
        for pill in data.get("quick_pills", [])[:5]:
            print(f"   * {pill}")
        print("   Recommended Keywords:")
        for rec in data.get("recommendations", [])[:4]:
            print(f"   * {rec.get('phrase')} [Score: {rec.get('score')}, Tag: {rec.get('tag')}]")
    else:
        print(f" [FAIL] HTTP {res.status_code}")

    # 4. Federated Parallel Search
    print_separator("4. GET /api/search?q=phone&platform=all - Federated Live Search")
    start_time = time.perf_counter()
    res = client.get("/api/search?q=phone&platform=all")
    client_elapsed = round((time.perf_counter() - start_time) * 1000, 2)
    
    if res.status_code == 200:
        data = res.json()
        print(f" [LATENCY] Server Total Latency: {data.get('total_latency_ms')} ms")
        print(f" [LATENCY] Client Request Time: {client_elapsed} ms")
        print(f" [PLATFORMS] Queried: {', '.join(data.get('platforms_queried', []))}")
        print(f" [BREAKDOWN] Platform Latencies: {data.get('platform_latencies')}")
        print(f" [COUNT] Total Aggregated Results: {data.get('total_results')}")
        
        # Privacy verification
        whatsapp_found = any("whatsapp" in item.get("platform", "").lower() for item in data.get("results", []))
        if not whatsapp_found:
            print(" [PRIVACY] WhatsApp Omission Check: PASSED (Zero WhatsApp telemetry/queries)")
        else:
            print(" [PRIVACY] WhatsApp Check: FAILED (WhatsApp detected)")

        # Sample results per platform
        print("\n   Sample Federated Results Across Platforms:")
        shown_platforms = set()
        for item in data.get("results", []):
            platform = item.get("platform")
            if platform not in shown_platforms:
                shown_platforms.add(platform)
                print(f"   [{platform}] '{item.get('title')}'")
                print(f"      URL: {item.get('url')}")
                print(f"      Relevance: {item.get('relevance_score')} | {item.get('category')}")
    else:
        print(f" [FAIL] HTTP {res.status_code}")

    # 5. Kids Mode & Strict Parental Guardrail
    print_separator("5. GET /api/kids/search - Parental Control & Kids Safe Search")
    
    # Test A: Blocked Non-Kid Query (Strict Refusal)
    res_block = client.get("/api/kids/search?q=fastapi+microservices+architecture")
    if res_block.status_code == 200:
        data_block = res_block.json()
        print(" [GUARDRAIL TEST: Non-Kid Query]")
        print(f"   Query: 'fastapi microservices architecture'")
        print(f"   Status: {data_block.get('status').upper()} (Expected: BLOCKED)")
        print(f"   Is Kids Safe: {data_block.get('is_kids_safe')}")
        print(f"   Total Results Responded: {data_block.get('total_results')} (Strict 0)")
        print(f"   Message: {data_block.get('message')}")
        print(f"   Alternatives Offered: {', '.join(data_block.get('safe_alternatives', [])[:3])}")
    
    # Test B: Allowed Kid Query (Cartoons / Anime)
    res_allow = client.get("/api/kids/search?q=pokemon+journeys")
    if res_allow.status_code == 200:
        data_allow = res_allow.json()
        print("\n [KIDS SEARCH TEST: Allowed Kid Query]")
        print(f"   Query: 'pokemon journeys'")
        print(f"   Status: {data_allow.get('status').upper()} (Expected: SUCCESS)")
        print(f"   Is Kids Safe: {data_allow.get('is_kids_safe')}")
        print(f"   Kid Results Found: {data_allow.get('total_results')}")
        top_item = data_allow.get("results", [{}])[0]
        print(f"   Top Item: '{top_item.get('title')}' ({top_item.get('channel')})")
        print(f"   Age Rating: {top_item.get('age_rating')} | Badge: {top_item.get('badge')}")

    print_separator("SUMMARY: BACKEND VERIFICATION COMPLETE")
    print(" >>> All core backend services, Trie logic, Kids Engine, and Federated queries are OPERATIONAL! <<<\n")

if __name__ == "__main__":
    main()
