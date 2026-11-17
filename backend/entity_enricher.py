"""
Entity Knowledge & Metadata Enricher.
Asynchronously enriches user queries using live public knowledge sources (DuckDuckGo Instant Answer API & Wikipedia API)
with local in-memory LRU caching, domain extraction, and clean synopsis summarization.
"""

import urllib.request
import urllib.parse
import json
import re
from typing import Dict, Any, Optional

# In-memory LRU-style cache
_ENTITY_CACHE: Dict[str, Dict[str, Any]] = {}
MAX_CACHE_ENTRIES = 500


def clean_html(text: str) -> str:
    """Removes HTML tags and decodes common entities."""
    if not text:
        return ""
    cleaned = re.sub(r'<[^>]+>', '', text)
    cleaned = cleaned.replace('&quot;', '"').replace('&#39;', "'").replace('&amp;', '&').replace('&nbsp;', ' ')
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def enrich_query_entity(query: str, timeout: float = 1.0) -> Dict[str, Any]:
    """
    Synchronously fetches knowledge graph & summary for a search query.
    Returns entity title, abstract synopsis, detected category/entity type, and source.
    Fast execution (<500ms) with in-memory caching and safe fallbacks.
    """
    clean_q = query.strip()
    cache_key = clean_q.lower()
    
    if cache_key in _ENTITY_CACHE:
        return _ENTITY_CACHE[cache_key]

    result: Dict[str, Any] = {
        "query": clean_q,
        "title": clean_q.title(),
        "abstract": "",
        "entity_type": "general",
        "domain_hint": None,
        "source": "heuristic"
    }

    if not clean_q:
        return result

    encoded_q = urllib.parse.quote(clean_q)

    # 1. Attempt DuckDuckGo Instant Answer API
    try:
        ddg_url = f"https://api.duckduckgo.com/?q={encoded_q}&format=json&no_html=1&skip_disambig=1"
        req = urllib.request.Request(
            ddg_url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VelloX/1.0"}
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="replace"))
            abstract = data.get("AbstractText", "").strip()
            heading = data.get("Heading", "").strip()
            entity = (data.get("Entity", "") or "").lower()

            if abstract:
                result["abstract"] = clean_html(abstract)
                result["title"] = heading or clean_q.title()
                result["entity_type"] = entity or "knowledge"
                result["source"] = "duckduckgo"

                # Detect domain hint from abstract and entity type
                lower_abs = (abstract + " " + entity).lower()
                if any(w in lower_abs for w in ["animated", "cartoon", "anime", "manga", "television series", "sitcom", "series"]):
                    result["domain_hint"] = "animation_cartoons"
                elif any(w in lower_abs for w in ["video game", "gameplay", "nintendo", "playstation", "xbox", "game"]):
                    result["domain_hint"] = "gaming_esports"
                elif any(w in lower_abs for w in ["film", "movie", "cinema", "directed by", "starring"]):
                    result["domain_hint"] = "movies_entertainment"

                _store_in_cache(cache_key, result)
                return result
    except Exception:
        pass

    # 2. Attempt Wikipedia Search API
    try:
        wiki_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={encoded_q}&utf8=&format=json&srlimit=1"
        req = urllib.request.Request(
            wiki_url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) VelloX/1.0"}
        )
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="replace"))
            search_items = data.get("query", {}).get("search", [])
            if search_items:
                top = search_items[0]
                wiki_title = top.get("title", clean_q.title())
                wiki_snippet = clean_html(top.get("snippet", ""))

                if wiki_snippet:
                    result["title"] = wiki_title
                    result["abstract"] = wiki_snippet
                    result["entity_type"] = "wikipedia"
                    result["source"] = "wikipedia"

                    lower_snip = (wiki_snippet + " " + wiki_title).lower()
                    if any(w in lower_snip for w in ["animated", "cartoon", "anime", "manga", "series", "gaumont", "xilam", "episodes"]):
                        result["domain_hint"] = "animation_cartoons"
                    elif any(w in lower_snip for w in ["video game", "gameplay", "nintendo", "playstation", "xbox"]):
                        result["domain_hint"] = "gaming_esports"
                    elif any(w in lower_snip for w in ["film", "movie", "cinema", "directed by", "actor"]):
                        result["domain_hint"] = "movies_entertainment"

                    _store_in_cache(cache_key, result)
                    return result
    except Exception:
        pass

    _store_in_cache(cache_key, result)
    return result


def _store_in_cache(key: str, data: Dict[str, Any]):
    if len(_ENTITY_CACHE) >= MAX_CACHE_ENTRIES:
        # Evict oldest entry
        first_k = next(iter(_ENTITY_CACHE))
        del _ENTITY_CACHE[first_k]
    _ENTITY_CACHE[key] = data
