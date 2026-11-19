import os
import sys
import time

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any

try:
    from trie import PrefixTrie
    from seed_data import SEED_DATA
    from federated import execute_federated_search, clear_federated_cache
    from internet_search import clear_search_cache
    from topic_recommender import (
        inject_topic_into_trie,
        get_contextual_recommendations,
        generate_dynamic_keywords,
        get_semantic_vector_suggestions
    )
    from kids_engine import (
        validate_kids_query,
        execute_kids_search,
        get_kids_discovery_feed,
        search_kids_suggestions
    )
except ImportError:
    from backend.trie import PrefixTrie
    from backend.seed_data import SEED_DATA
    from backend.federated import execute_federated_search, clear_federated_cache
    from backend.internet_search import clear_search_cache
    from backend.topic_recommender import (
        inject_topic_into_trie,
        get_contextual_recommendations,
        generate_dynamic_keywords,
        get_semantic_vector_suggestions
    )
    from backend.kids_engine import (
        validate_kids_query,
        execute_kids_search,
        get_kids_discovery_feed,
        search_kids_suggestions
    )


app = FastAPI(
    title="AIOps Search Engine & Content Intelligence API",
    description="Prefix Trie Autocomplete with O(L) traversal, Contextual Topic Recommendations, and Federated Parallel Search across YouTube, LinkedIn, Monster, Foundit, and Instagram.",
    version="1.2.0"
)

# Enable CORS for Vite frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_no_cache_headers(request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"
    return response

# Clear stale in-memory search caches on startup
try:
    clear_search_cache()
    clear_federated_cache()
except Exception:
    pass

# Initialize Trie and load Seed Data
trie = PrefixTrie()
for item in SEED_DATA:
    trie.insert(
        phrase=item["phrase"],
        source=item.get("source", "global"),
        frequency=item.get("frequency", 1),
        category=item.get("category", "general")
    )

# Active Cross-Platform Context (None by default until user activity is triggered)
active_user_context: Optional[Dict[str, Any]] = None



class HistoryRecordRequest(BaseModel):
    query: str


class ActivityRecordRequest(BaseModel):
    platform: str = "youtube"
    topic: str = "phone"


@app.get("/api/health")
async def health_check():
    stats = trie.get_stats()
    return {
        "status": "healthy",
        "service": "AIOps Search Engine & Content Intelligence Platform",
        "platforms_active": ["YouTube", "LinkedIn", "Monster", "Foundit", "Instagram"],
        "privacy_enforcement": "WhatsApp strictly omitted",
        "kids_parental_control": "Enforced (Strict G/TV-Y7)",
        "active_context": active_user_context,
        "trie_stats": stats
    }


@app.get("/api/context")
async def get_current_context():
    """
    Returns the active cross-platform context (e.g., YouTube visited for 'phone').
    """
    return {
        "status": "success",
        "active_context": active_user_context
    }


@app.post("/api/activity")
async def record_user_activity(body: ActivityRecordRequest):
    """
    Simulates or registers external platform activity (e.g. visited YouTube and searched for 'phone').
    Dynamically injects topic-specific keywords into the Prefix Trie with a 3x History Weight,
    and updates active recommendation context.
    """
    global active_user_context
    clean_topic = body.topic.strip().lower() if body.topic else "phone"
    clean_platform = body.platform.strip().lower() if body.platform else "youtube"

    injected_count = inject_topic_into_trie(trie, clean_topic, clean_platform)
    recs = get_contextual_recommendations(clean_topic, clean_platform)

    active_user_context = {
        "platform": clean_platform,
        "topic": clean_topic,
        "title": recs["active_context"]["title"]
    }

    return {
        "status": "success",
        "message": f"Successfully synced activity from {clean_platform} for topic '{clean_topic}'",
        "injected_keywords_count": injected_count,
        "active_context": active_user_context,
        "recommendations": recs["recommendations"]
    }


@app.delete("/api/context")
async def clear_user_context():
    """
    Clears the active cross-platform context and resets search caches.
    """
    global active_user_context
    active_user_context = None
    try:
        clear_search_cache()
        clear_federated_cache()
    except Exception:
        pass
    return {"status": "success", "message": "Active context and search caches reset"}


@app.get("/api/recommendations")
async def get_recommendations(
    topic: Optional[str] = Query(None, description="Topic name (defaults to active context)"),
    platform: Optional[str] = Query(None, description="Platform source (defaults to active context)")
):
    """
    Returns personalized recommendation keywords and quick pills completely related to the topic.
    """
    if not topic and not active_user_context:
        return {
            "status": "neutral",
            "active_context": None,
            "recommendations": [],
            "quick_pills": []
        }
    current_topic = topic or (active_user_context["topic"] if active_user_context else "trending")
    current_platform = platform or (active_user_context["platform"] if active_user_context else "youtube")

    data = get_contextual_recommendations(current_topic, current_platform)
    return data


try:
    from internet_search import get_live_internet_suggestions
except ImportError:
    from backend.internet_search import get_live_internet_suggestions


@app.get("/api/suggest")
async def get_suggestions(
    q: Optional[str] = Query(None, description="Prefix to query in Trie"),
    kids_mode: bool = Query(False, description="When true, enforces strict kid-safe suggestions")
):
    """
    Dynamic autocomplete prefix matching.
    Strict rule: Returns [] immediately if q is empty, whitespace, or has no match.
    Fetches real-time suggestions directly from live internet (Google Suggest API),
    while prioritizing local history search with 3x multiplier.
    In kids_mode, strictly returns kid-friendly cartoon, anime, and learning suggestions.
    Calculates execution latency in milliseconds.
    """
    if not q or not q.strip():
        return {
            "query": "",
            "latency_ms": 0.0,
            "total_matches": 0,
            "suggestions": []
        }

    start = time.perf_counter()
    if kids_mode:
        matches = search_kids_suggestions(q, limit=8)
    else:
        # 1. Fetch live real-time suggestions directly from internet
        live_suggs = []
        try:
            live_suggs = get_live_internet_suggestions(q, limit=8)
        except Exception:
            pass

        # 2. Check Trie for user history queries with 3x multiplier
        history_matches = [m for m in trie.search_prefix(q, limit=5) if m.get("source") == "history"]

        matches = []
        existing_phrases = set()

        # Prioritize user history with 3x score
        for hm in history_matches:
            if hm["phrase"].lower() not in existing_phrases:
                matches.append(hm)
                existing_phrases.add(hm["phrase"].lower())

        # Then add real live internet suggestions
        for ls in live_suggs:
            if ls["phrase"].lower() not in existing_phrases:
                matches.append(ls)
                existing_phrases.add(ls["phrase"].lower())

        # If still room, check semantic vector completions
        try:
            vec_suggs = get_semantic_vector_suggestions(q, limit=4)
            for vs in vec_suggs:
                if vs["phrase"].lower() not in existing_phrases:
                    matches.append(vs)
                    existing_phrases.add(vs["phrase"].lower())
        except Exception:
            pass

        # If internet was offline and history empty, allow trie global items as fallback
        if not matches:
            matches = trie.search_prefix(q, limit=8)

    elapsed_ms = round((time.perf_counter() - start) * 1000, 3)

    return {
        "query": q,
        "kids_mode": kids_mode,
        "latency_ms": elapsed_ms,
        "total_matches": len(matches),
        "suggestions": matches[:10]
    }


@app.get("/api/search")
async def federated_search(
    q: str = Query(..., description="Query search term"),
    platform: str = Query("all", description="Platform filter: all, youtube, linkedin, monster, foundit, instagram"),
    kids_mode: bool = Query(False, description="Enforce parental control & kids safe filter"),
    category: str = Query("all", description="Category filter for kids mode: all, cartoons, anime, learning, craft, gaming"),
    page: int = Query(1, ge=1, description="Page number for continuous infinite scroll"),
    page_size: int = Query(8, ge=1, le=40, description="Items per platform per page")
):
    """
    Dispatches federated queries.
    Supports infinite scroll pagination (page and page_size) with 64-D vector search.
    If kids_mode=True, enforces strict parental control guardrails:
    - Non-kid queries are BLOCKED with 0 results and an explanatory warning.
    - Valid kid queries return curated cartoons, anime, and learning adventures.
    If kids_mode=False (standard mode), queries YouTube, LinkedIn, Monster, Foundit, Instagram concurrently.
    Strictly excludes WhatsApp across all modes.
    """
    if not q or not q.strip():
        return {
            "query": "",
            "total_results": 0,
            "total_latency_ms": 0.0,
            "platform_latencies": {},
            "platforms_queried": [],
            "results": []
        }

    if kids_mode:
        return execute_kids_search(q, category_filter=category, platform_filter=platform, page=page, page_size=page_size)

    # Record search query in Trie to reward future queries with history boost (Standard Mode on page 1)
    if page == 1:
        trie.insert(phrase=q.strip().lower(), source="history", frequency=10, category="user_search")

    results = await execute_federated_search(q, platform_filter=platform, page=page, page_size=page_size)
    return results



# -------------------------------------------------------------
# DEDICATED KIDS & PARENTAL CONTROL ENDPOINTS
# -------------------------------------------------------------
@app.get("/api/kids/feed")
async def get_kids_feed(
    page: int = Query(1, ge=1, description="Page number for infinite scroll"),
    page_size: int = Query(8, ge=1, le=50, description="Items per section/page"),
    category: str = Query("all", description="Category filter")
):
    """
    Returns discovery feed for Kids Space: featured cartoon/anime spotlight,
    categories, and curated cards for home view with infinite scroll support.
    """
    return get_kids_discovery_feed(page=page, page_size=page_size, category=category)


@app.get("/api/kids/search")
async def kids_search_endpoint(
    q: str = Query(..., description="Query search term"),
    category: str = Query("all", description="Category filter: all, cartoons, anime, learning, craft, gaming"),
    platform: str = Query("all", description="Platform filter"),
    page: int = Query(1, ge=1, description="Page number for continuous infinite scroll"),
    page_size: int = Query(12, ge=1, le=50, description="Items per page")
):
    """
    Dedicated Kid-Safe search endpoint with strict parental guardrail.
    If query is not kid-related, it refuses to respond with non-kid results.
    Supports continuous infinite scroll pagination based on search content.
    """
    return execute_kids_search(q, category_filter=category, platform_filter=platform, page=page, page_size=page_size)


@app.get("/api/kids/suggest")
async def kids_suggest_endpoint(q: Optional[str] = Query(None, description="Prefix to query in Kids Trie")):
    """
    Dedicated Kids autocomplete endpoint. Traverses Kids Prefix Trie in O(L).
    """
    if not q or not q.strip():
        return {"query": "", "latency_ms": 0.0, "total_matches": 0, "suggestions": []}

    start = time.perf_counter()
    matches = search_kids_suggestions(q, limit=8)
    elapsed_ms = round((time.perf_counter() - start) * 1000, 3)

    return {
        "query": q,
        "latency_ms": elapsed_ms,
        "total_matches": len(matches),
        "suggestions": matches
    }


@app.get("/api/kids/validate")
async def kids_validate_query(q: str = Query(..., description="Query to validate against kids guardrail")):
    """
    Validates a query against kids guardrails without executing full search.
    """
    is_safe, reason, alternatives = validate_kids_query(q)
    return {
        "query": q,
        "is_kids_safe": is_safe,
        "message": reason,
        "safe_alternatives": alternatives
    }


@app.post("/api/history")
async def record_search_history(body: HistoryRecordRequest):
    """
    Dynamically promotes or records a phrase into the Trie as 'history' with a 3x weight multiplier.
    """
    if body.query and body.query.strip():
        clean = body.query.strip().lower()
        trie.insert(phrase=clean, source="history", frequency=15, category="user_search")
        return {"status": "success", "recorded": clean, "multiplier": "3x"}
    return {"status": "ignored", "reason": "empty query"}


dist_dir = os.path.abspath(os.path.join(backend_dir, "..", "frontend", "dist"))
assets_dir = os.path.join(dist_dir, "assets")

if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")


@app.api_route("/", methods=["GET", "HEAD"])
async def serve_index():
    index_file = os.path.join(dist_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return HTMLResponse("<h1>AIOps Search Engine & Content Intelligence API</h1><p>Visit <a href='/docs'>/docs</a> or <a href='http://localhost:5173'>Frontend on Port 5173</a></p>")


@app.get("/{full_path:path}")
async def serve_spa_and_static(full_path: str):
    # Do not intercept API or documentation routes
    if full_path.startswith("api/") or full_path in ("docs", "redoc", "openapi.json"):
        return HTMLResponse("Not Found", status_code=404)
    file_path = os.path.join(dist_dir, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    index_file = os.path.join(dist_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return HTMLResponse("<h1>AIOps Search Engine API</h1>")


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=False)
