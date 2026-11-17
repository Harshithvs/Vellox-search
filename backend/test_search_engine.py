import os
import sys

# Ensure root directory is in sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

import pytest
import asyncio
from fastapi.testclient import TestClient

from backend.trie import PrefixTrie
from backend.seed_data import SEED_DATA
from backend.federated import execute_federated_search
from backend.main import app


def test_trie_empty_and_whitespace():
    """Trie should return empty list immediately on empty/whitespace input."""
    trie = PrefixTrie()
    trie.insert("python tutorial", source="global", frequency=10)
    
    assert trie.search_prefix("") == []
    assert trie.search_prefix("   ") == []
    assert trie.search_prefix(None) == []


def test_trie_non_matching_prefix():
    """Trie should return empty list immediately if no prefix matches."""
    trie = PrefixTrie()
    trie.insert("python", source="global", frequency=10)
    trie.insert("pytorch", source="global", frequency=5)
    
    assert trie.search_prefix("java") == []
    assert trie.search_prefix("xyz") == []


def test_trie_history_3x_multiplier():
    """History entries should receive 3x score multiplier and outrank higher-frequency global entries."""
    trie = PrefixTrie()
    # Global frequency = 100 -> score = 100
    trie.insert("python beginner guide", source="global", frequency=100)
    # History frequency = 40 -> score = 40 * 3 = 120 (outranks 100!)
    trie.insert("python tutorial", source="history", frequency=40)
    
    results = trie.search_prefix("py")
    assert len(results) == 2
    assert results[0]["phrase"] == "python tutorial"
    assert results[0]["score"] == 120
    assert results[1]["phrase"] == "python beginner guide"
    assert results[1]["score"] == 100


def test_trie_limit():
    """Trie should respect the limit parameter."""
    trie = PrefixTrie()
    for i in range(20):
        trie.insert(f"test phrase {i}", source="global", frequency=i)
        
    results = trie.search_prefix("test", limit=5)
    assert len(results) == 5


def test_federated_search_concurrency_and_privacy():
    """Federated search should query YouTube, LinkedIn, Instagram concurrently and omit WhatsApp."""
    result = asyncio.run(execute_federated_search("python tutorial", platform_filter="all"))
    
    assert result["query"] == "python tutorial"
    assert result["total_results"] > 0
    assert "YouTube" in result["platforms_queried"]
    assert "LinkedIn" in result["platforms_queried"]
    assert "Monster" in result["platforms_queried"]
    assert "Foundit" in result["platforms_queried"]
    assert "Instagram" in result["platforms_queried"]
    
    # WhatsApp MUST NOT be queried or present in any output
    assert "WhatsApp" not in result["platforms_queried"]
    for item in result["results"]:
        assert item["platform"].lower() != "whatsapp"
        assert "whatsapp" not in item["url"].lower()


def test_federated_search_platform_filtering():
    """Filtering by a single platform returns only that platform."""
    yt_only = asyncio.run(execute_federated_search("fastapi", platform_filter="youtube"))
    assert all(item["platform"] == "YouTube" for item in yt_only["results"])
    assert yt_only["platforms_queried"] == ["YouTube"]

    li_only = asyncio.run(execute_federated_search("architect", platform_filter="linkedin"))
    assert all(item["platform"] == "LinkedIn" for item in li_only["results"])
    assert li_only["platforms_queried"] == ["LinkedIn"]

    ig_only = asyncio.run(execute_federated_search("reels", platform_filter="instagram"))
    assert all(item["platform"] == "Instagram" for item in ig_only["results"])
    assert ig_only["platforms_queried"] == ["Instagram"]

    monster_only = asyncio.run(execute_federated_search("software engineer", platform_filter="monster"))
    assert all(item["platform"] == "Monster" for item in monster_only["results"])
    assert monster_only["platforms_queried"] == ["Monster"]

    foundit_only = asyncio.run(execute_federated_search("developer", platform_filter="foundit"))
    assert all(item["platform"] == "Foundit" for item in foundit_only["results"])
    assert foundit_only["platforms_queried"] == ["Foundit"]


def test_api_health_endpoint():
    """Health check returns healthy status and metadata."""
    client = TestClient(app)
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert "YouTube" in data["platforms_active"]
    assert "LinkedIn" in data["platforms_active"]
    assert "Monster" in data["platforms_active"]
    assert "Foundit" in data["platforms_active"]
    assert "Instagram" in data["platforms_active"]
    assert "WhatsApp strictly omitted" in data["privacy_enforcement"]
    assert data["trie_stats"]["algorithm"] == "Deterministic O(L) Prefix Trie"


def test_api_suggest_endpoint():
    """Suggest endpoint returns matching suggestions and latency."""
    client = TestClient(app)
    # Empty query returns empty list
    empty_resp = client.get("/api/suggest?q=")
    assert empty_resp.status_code == 200
    assert empty_resp.json()["suggestions"] == []

    # Valid prefix returns matches with latency
    valid_resp = client.get("/api/suggest?q=py")
    assert valid_resp.status_code == 200
    data = valid_resp.json()
    assert len(data["suggestions"]) > 0
    assert "latency_ms" in data
    assert any(s["phrase"].lower().startswith("py") for s in data["suggestions"])


def test_api_history_record_endpoint():
    """POST /api/history dynamically records/promotes search query."""
    client = TestClient(app)
    resp = client.post("/api/history", json={"query": "new search term"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["multiplier"] == "3x"


def test_cross_platform_activity_and_phone_trie_injection():
    """Simulating YouTube visit for 'phone' injects phone keywords into Trie with 3x history weight."""
    client = TestClient(app)
    resp = client.post("/api/activity", json={"platform": "youtube", "topic": "phone"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["injected_keywords_count"] > 5
    assert data["active_context"]["topic"] == "phone"
    assert "YouTube" in data["active_context"]["title"]

    # When querying Trie with 'ph', phone keywords with 3x history multiplier should dominate
    suggest_resp = client.get("/api/suggest?q=ph")
    assert suggest_resp.status_code == 200
    suggestions = suggest_resp.json()["suggestions"]
    assert len(suggestions) > 0
    # Phone keywords with history multiplier should be present
    assert any("phone" in s["phrase"].lower() for s in suggestions)


def test_recommendations_endpoint_phone_context():
    """GET /api/recommendations returns curated phone keywords when topic is phone."""
    client = TestClient(app)
    resp = client.get("/api/recommendations?topic=phone&platform=youtube")
    assert resp.status_code == 200
    data = resp.json()
    assert "phone" in data["active_context"]["topic"]
    assert len(data["recommendations"]) > 0
    assert any("phone" in item["phrase"].lower() for item in data["recommendations"])
    assert len(data["quick_pills"]) > 0


def test_federated_search_for_phones():
    """Federated search for 'phone' should return tailored phone camera, review, and mobile hardware cards."""
    result = asyncio.run(execute_federated_search("phone", platform_filter="all"))
    assert result["query"] == "phone"
    assert result["total_results"] > 0
    
    # Check that YouTube has phone review / camera content
    yt_items = [r for r in result["results"] if r["platform"] == "YouTube"]
    assert len(yt_items) > 0
    assert any("phone" in item["title"].lower() or "camera" in item["title"].lower() for item in yt_items)

    # Check that LinkedIn has mobile systems / hardware / optics engineering content
    li_items = [r for r in result["results"] if r["platform"] == "LinkedIn"]
    assert len(li_items) > 0
    assert any("mobile" in item["title"].lower() or "phone" in item["title"].lower() for item in li_items)

    # Check that Instagram has phone hacks / reels
    ig_items = [r for r in result["results"] if r["platform"] == "Instagram"]
    assert len(ig_items) > 0
    assert any("phone" in item["title"].lower() or "shot on" in item["title"].lower() for item in ig_items)


def test_clear_and_get_context():
    """GET /api/context and DELETE /api/context manage user context lifecycle."""
    client = TestClient(app)
    # Set context
    client.post("/api/activity", json={"platform": "youtube", "topic": "laptop"})
    ctx_resp = client.get("/api/context")
    assert ctx_resp.status_code == 200
    assert ctx_resp.json()["active_context"]["topic"] == "laptop"

    # Clear context
    del_resp = client.delete("/api/context")
    assert del_resp.status_code == 200
    assert del_resp.json()["status"] == "success"

    # Reset back to phone for app demo
    client.post("/api/activity", json={"platform": "youtube", "topic": "phone"})


def test_kids_feed_endpoint():
    """GET /api/kids/feed returns discovery categories and curated kids sections."""
    client = TestClient(app)
    resp = client.get("/api/kids/feed")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert "Active" in data["parental_control_status"]
    assert len(data["categories"]) >= 5
    assert len(data["sections"]) >= 4
    assert any("cartoons" in s["id"] for s in data["sections"])
    assert any("anime" in s["id"] for s in data["sections"])


def test_kids_search_guardrail_blocks_non_kid_content():
    """Strict Parental Control: If query is NOT kid-related, it refuses to respond with content."""
    client = TestClient(app)

    # 1. Complex Adult Tech Query
    resp1 = client.get("/api/kids/search?q=fastapi+asynchronous+rest+api")
    assert resp1.status_code == 200
    data1 = resp1.json()
    assert data1["status"] == "blocked"
    assert data1["is_kids_safe"] is False
    assert data1["total_results"] == 0
    assert len(data1["results"]) == 0
    assert "blocked" in data1["message"].lower() or "parental control" in data1["message"].lower()
    assert len(data1["safe_alternatives"]) > 0

    # 2. General Non-Kid Topic (Finance / Real Estate)
    resp2 = client.get("/api/kids/search?q=mortgage+rates+2025")
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["status"] == "blocked"
    assert data2["is_kids_safe"] is False
    assert data2["total_results"] == 0

    # 3. Via /api/search with kids_mode=true
    resp3 = client.get("/api/search?q=python+backend+engineer+salary&kids_mode=true")
    assert resp3.status_code == 200
    data3 = resp3.json()
    assert data3["status"] == "blocked"
    assert data3["is_kids_safe"] is False
    assert len(data3["results"]) == 0


def test_kids_search_allows_cartoons_and_anime():
    """Valid kid queries (cartoons, anime, science, crafts) return vibrant kid-safe results."""
    client = TestClient(app)

    # 1. Pokemon Search
    resp_pok = client.get("/api/kids/search?q=pokemon+journeys")
    assert resp_pok.status_code == 200
    data_pok = resp_pok.json()
    assert data_pok["status"] == "success"
    assert data_pok["is_kids_safe"] is True
    assert data_pok["total_results"] > 0
    assert any("pokemon" in r["title"].lower() or "pikachu" in r["title"].lower() for r in data_pok["results"])

    # 2. Doraemon / Cartoons Search
    resp_dora = client.get("/api/kids/search?q=doraemon+gadgets")
    assert resp_dora.status_code == 200
    data_dora = resp_dora.json()
    assert data_dora["status"] == "success"
    assert data_dora["total_results"] > 0
    assert any("doraemon" in r["title"].lower() for r in data_dora["results"])

    # 3. Via /api/search with kids_mode=true
    resp_anime = client.get("/api/search?q=studio+ghibli+totoro&kids_mode=true")
    assert resp_anime.status_code == 200
    data_anime = resp_anime.json()
    assert data_anime["status"] == "success"
    assert data_anime["is_kids_safe"] is True
    assert data_anime["total_results"] > 0


def test_kids_suggest_trie_isolation():
    """Kids autocomplete Trie only returns kid-safe phrases and isolates adult seed entries."""
    client = TestClient(app)

    # Kid query 'pok' returns pokemon
    pok_resp = client.get("/api/kids/suggest?q=pok")
    assert pok_resp.status_code == 200
    pok_data = pok_resp.json()
    assert len(pok_data["suggestions"]) > 0
    assert any("pokemon" in s["phrase"].lower() for s in pok_data["suggestions"])

    # Non-kid query 'py' (which in normal mode returns python tutorial) returns empty list in kids mode!
    py_resp = client.get("/api/kids/suggest?q=py")
    assert py_resp.status_code == 200
    py_data = py_resp.json()
    assert py_data["suggestions"] == []


def test_vector_search_semantic_matching_across_all_three_platforms():
    """
    Vector search must retrieve results based on similar meaning, not exact words,
    across YouTube, LinkedIn, and Instagram.
    """
    # Query with synonyms for phone: 'cellular handset' (without using the word 'phone')
    result = asyncio.run(execute_federated_search("cellular handset", platform_filter="all"))
    assert result["total_results"] > 0
    assert result["vector_dimensions"] == 512
    
    # 1. YouTube platform verification
    yt_items = [r for r in result["results"] if r["platform"] == "YouTube"]
    assert len(yt_items) > 0
    assert any("smartphone" in r["title"].lower() or "camera" in r["title"].lower() or "hardware" in r["title"].lower() for r in yt_items)
    assert yt_items[0]["match_type"] == "vector_search"
    assert yt_items[0]["vector_score"] > 0.5

    # 2. LinkedIn platform verification
    li_items = [r for r in result["results"] if r["platform"] == "LinkedIn"]
    assert len(li_items) > 0
    assert any("mobile" in r["title"].lower() or "optics" in r["title"].lower() or "smartphone" in r["title"].lower() for r in li_items)
    assert li_items[0]["match_type"] == "vector_search"
    assert li_items[0]["vector_score"] > 0.5

    # 3. Instagram platform verification
    ig_items = [r for r in result["results"] if r["platform"] == "Instagram"]
    assert len(ig_items) > 0
    assert any("mobile" in r["title"].lower() or "smartphone" in r["title"].lower() or "settings" in r["title"].lower() for r in ig_items)
    assert ig_items[0]["match_type"] == "vector_search"
    assert ig_items[0]["vector_score"] > 0.5


def test_vector_search_ai_semantic_similarity():
    """
    Vector search for 'deep neural networks' retrieves AI/ML masterclasses, roles, and reels.
    """
    result = asyncio.run(execute_federated_search("deep neural networks", platform_filter="all"))
    assert result["total_results"] > 0

    # YouTube: Neural networks / deep learning masterclass
    yt_items = [r for r in result["results"] if r["platform"] == "YouTube"]
    assert any("neural" in r["title"].lower() or "learning" in r["title"].lower() or "ai" in r["title"].lower() for r in yt_items)

    # LinkedIn: Machine learning engineer / AI researcher
    li_items = [r for r in result["results"] if r["platform"] == "LinkedIn"]
    assert any("learning" in r["title"].lower() or "ai" in r["title"].lower() or "neural" in r["title"].lower() for r in li_items)

    # Instagram: Neural network / AI tools reel
    ig_items = [r for r in result["results"] if r["platform"] == "Instagram"]
    assert any("neural" in r["title"].lower() or "ai" in r["title"].lower() or "code" in r["title"].lower() for r in ig_items)


def test_vector_search_careers_semantic_matching():
    """
    Vector search for 'employment vacancies' matches hiring and engineering roles on LinkedIn.
    """
    client = TestClient(app)
    resp = client.get("/api/search?q=employment+vacancies&platform=linkedin")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_results"] > 0
    assert all(r["platform"] == "LinkedIn" for r in data["results"])
    assert all(r["match_type"] == "vector_search" for r in data["results"])


def test_vector_search_meaning_without_exact_word_phone():
    """
    Querying 'device to talk to people wirelessly' must retrieve smartphone / mobile phone items
    based purely on semantic meaning, without containing the word 'phone' or 'smartphone'.
    """
    result = asyncio.run(execute_federated_search("device to talk to people wirelessly", platform_filter="all"))
    assert result["total_results"] > 0
    assert result["vector_dimensions"] == 512
    yt_items = [r for r in result["results"] if r["platform"] == "YouTube"]
    assert len(yt_items) > 0
    assert any("smartphone" in r["title"].lower() or "mobile" in r["title"].lower() or "phone" in r["title"].lower() for r in yt_items)
    assert yt_items[0]["vector_score"] > 0.40


def test_vector_search_meaning_culinary_arts():
    """
    Querying 'how to cook delicious food' must retrieve culinary, carbonara, and gourmet chef items.
    """
    result = asyncio.run(execute_federated_search("how to cook delicious food", platform_filter="all"))
    assert result["total_results"] > 0
    yt_items = [r for r in result["results"] if r["platform"] == "YouTube"]
    assert len(yt_items) > 0
    assert any("carbonara" in r["title"].lower() or "dinner" in r["title"].lower() or "cooking" in r["snippet"].lower() for r in yt_items)
    assert yt_items[0]["semantic_concept"] == "Culinary Arts & Gastronomy"


def test_vector_search_meaning_fitness_and_muscle():
    """
    Querying 'exercise to gain muscle and get strong' retrieves hypertrophy and sports science items.
    """
    result = asyncio.run(execute_federated_search("exercise to gain muscle and get strong", platform_filter="all"))
    assert result["total_results"] > 0
    yt_items = [r for r in result["results"] if r["platform"] == "YouTube"]
    assert len(yt_items) > 0
    assert any("hypertrophy" in r["title"].lower() or "muscle" in r["title"].lower() for r in yt_items)
    assert yt_items[0]["semantic_concept"] == "Fitness, Health & Athletic Performance"


def test_kids_vector_search_by_character_descriptions():
    """
    Kids search must retrieve cartoon items by conceptual meaning and character description:
    - 'yellow electric mouse' -> Pokemon
    - 'blue cat with magical pocket' -> Doraemon
    - 'cat chasing clever mouse' -> Tom and Jerry
    """
    client = TestClient(app)

    # 1. Pokemon by description
    resp1 = client.get("/api/kids/search?q=yellow+electric+mouse")
    assert resp1.status_code == 200
    data1 = resp1.json()
    assert data1["is_kids_safe"] is True
    assert data1["total_results"] > 0
    assert any("pokemon" in r["title"].lower() or "pokémon" in r["title"].lower() for r in data1["results"][:2])
    assert data1["results"][0]["match_type"] == "vector_search"

    # 2. Doraemon by description
    resp2 = client.get("/api/kids/search?q=blue+cat+with+magical+pocket")
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["is_kids_safe"] is True
    assert any("doraemon" in r["title"].lower() for r in data2["results"][:2])

    # 3. Tom and Jerry by description
    resp3 = client.get("/api/kids/search?q=cat+chasing+clever+mouse")
    assert resp3.status_code == 200
    data3 = resp3.json()
    assert data3["is_kids_safe"] is True
    assert any("tom" in r["title"].lower() for r in data3["results"][:2])


def test_api_suggest_semantic_vector_autocomplete():
    """
    Suggest endpoint returns semantically related completions even if the prefix doesn't match:
    - Query 'handset' -> returns smartphone / phone suggestions!
    - Query 'workout' -> returns hypertrophy / fitness suggestions!
    """
    client = TestClient(app)
    resp = client.get("/api/suggest?q=handset")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["suggestions"]) > 0
    assert any("phone" in s["phrase"].lower() or "smartphone" in s["phrase"].lower() for s in data["suggestions"])


def test_non_job_queries_do_not_return_job_listings_on_career_platforms():
    """
    When searching for 'phone' or 'laptop' (non-job queries), LinkedIn, Monster, and Foundit
    must NOT return job listings or hiring vacancies.
    """
    for query in ["phone", "laptop"]:
        result = asyncio.run(execute_federated_search(query, platform_filter="all"))
        assert result["total_results"] > 0

        # Check results on LinkedIn, Monster, and Foundit
        for item in result["results"]:
            platform = item["platform"]
            if platform in ("LinkedIn", "Monster", "Foundit"):
                title_lower = item["title"].lower()
                assert "jobs near me" not in title_lower
                assert "active hiring" not in title_lower

                # Badge must not be a recruiting or vacancy badge
                badge = item.get("badge", "").lower()
                assert badge not in ("active role", "urgent requirement", "immediate hiring")

                # Content format must not be a job listing
                content_format = item.get("content_format", "").lower()
                assert content_format != "job listing / career role"
                assert content_format != "job search portal"


def test_job_queries_return_job_listings_on_career_platforms():
    """
    When user explicitly searches for jobs ('software engineer jobs'),
    career platforms should return active job listings.
    """
    result = asyncio.run(execute_federated_search("software engineer jobs", platform_filter="all"))
    assert result["total_results"] > 0
    li_items = [r for r in result["results"] if r["platform"] == "LinkedIn"]
    assert len(li_items) > 0
    assert any("engineer" in r["title"].lower() for r in li_items)


