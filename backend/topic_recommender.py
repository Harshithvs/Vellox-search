"""
Contextual Topic Recommender & Semantic Keyword Engine
Provides real-time cross-platform activity recognition,
dynamic keyword expansion, and Trie injection with 3x History Weight.
"""

from typing import List, Dict, Any, Optional, Tuple

# Curated semantic knowledge clusters for rich cross-platform intent
TOPIC_CLUSTERS: Dict[str, List[Dict[str, Any]]] = {
    "phone": [
        {"phrase": "phone reviews 2025", "category": "youtube", "frequency": 75, "tag": "YouTube Review"},
        {"phrase": "phone camera test comparison", "category": "youtube", "frequency": 70, "tag": "Camera Test"},
        {"phrase": "best budget smartphone 2025", "category": "youtube", "frequency": 68, "tag": "Buying Guide"},
        {"phrase": "phone battery life ranking", "category": "tech", "frequency": 65, "tag": "Benchmark"},
        {"phrase": "phone unboxing and first look", "category": "youtube", "frequency": 62, "tag": "Unboxing"},
        {"phrase": "flagship phone snapdragon 8 elite", "category": "tech", "frequency": 60, "tag": "Hardware"},
        {"phrase": "phone buying guide for students", "category": "tech", "frequency": 58, "tag": "Buyer Guide"},
        {"phrase": "foldable phone durability test", "category": "youtube", "frequency": 55, "tag": "Durability"},
        {"phrase": "iphone vs samsung galaxy phone", "category": "youtube", "frequency": 54, "tag": "Showdown"},
        {"phrase": "phone accessories and fast chargers", "category": "tech", "frequency": 50, "tag": "Accessories"},
        {"phrase": "phone display specs and oled test", "category": "tech", "frequency": 48, "tag": "Display"},
        {"phrase": "phone operating system speed benchmark", "category": "tech", "frequency": 46, "tag": "Performance"},
        {"phrase": "#phonephotography tips and tricks", "category": "instagram", "frequency": 66, "tag": "Insta Reel"},
        {"phrase": "#phonereviews and tech hacks", "category": "instagram", "frequency": 64, "tag": "Insta Reel"},
        {"phrase": "5g phone under 300 dollars", "category": "tech", "frequency": 52, "tag": "Budget Pick"}
    ],
    "smartphone": [
        {"phrase": "smartphone camera shootout 2025", "category": "youtube", "frequency": 72, "tag": "YouTube"},
        {"phrase": "best flagship smartphone ranking", "category": "youtube", "frequency": 70, "tag": "Ranking"},
        {"phrase": "smartphone processor comparison", "category": "tech", "frequency": 65, "tag": "Specs"},
        {"phrase": "smartphone display hz and nits test", "category": "tech", "frequency": 58, "tag": "Display"},
        {"phrase": "#smartphonetricks you need to know", "category": "instagram", "frequency": 64, "tag": "Reels"}
    ],
    "laptop": [
        {"phrase": "laptop buying guide 2025", "category": "youtube", "frequency": 75, "tag": "Buying Guide"},
        {"phrase": "best budget laptop for students", "category": "youtube", "frequency": 70, "tag": "Budget"},
        {"phrase": "macbook pro vs windows laptop", "category": "youtube", "frequency": 68, "tag": "Comparison"},
        {"phrase": "laptop battery life real world test", "category": "tech", "frequency": 62, "tag": "Benchmark"},
        {"phrase": "laptop display cooling and thermal test", "category": "tech", "frequency": 45, "tag": "Performance"}
    ],
    "ai": [
        {"phrase": "ai search engine architecture", "category": "tech", "frequency": 80, "tag": "Architecture"},
        {"phrase": "ai prompt engineering masterclass", "category": "youtube", "frequency": 75, "tag": "YouTube"},
        {"phrase": "ai research scientist salary", "category": "job", "frequency": 65, "tag": "Career"},
        {"phrase": "#aitools every developer should use", "category": "instagram", "frequency": 70, "tag": "Reels"}
    ],
    "python": [
        {"phrase": "python full course 2025", "category": "youtube", "frequency": 85, "tag": "Masterclass"},
        {"phrase": "python backend engineer remote", "category": "job", "frequency": 70, "tag": "Career"},
        {"phrase": "python automation scripts for daily tasks", "category": "tech", "frequency": 68, "tag": "Tutorial"},
        {"phrase": "#pythondeveloper tips and tricks", "category": "instagram", "frequency": 65, "tag": "Reels"}
    ]
}

try:
    from internet_search import get_live_internet_suggestions
except ImportError:
    from backend.internet_search import get_live_internet_suggestions


def generate_dynamic_keywords(topic: str, platform: str = "youtube") -> List[Dict[str, Any]]:
    """
    Generates rich, contextual keywords for any arbitrary user topic directly from the live internet.
    Fetches real-time search queries from Google Suggest API, tailored across YouTube, LinkedIn, Instagram.
    """
    clean_topic = topic.strip().lower()
    if not clean_topic:
        return []

    # Fetch live suggestions from Google Suggest API over the internet
    live_items = []
    seen = set()

    # Query variants over the live internet
    variants = [clean_topic, f"{clean_topic} reviews", f"{clean_topic} tutorial", f"best {clean_topic}"]
    for query_variant in variants:
        try:
            suggs = get_live_internet_suggestions(query_variant, limit=6)
            for s in suggs:
                p = s["phrase"].lower()
                if p not in seen:
                    seen.add(p)
                    cat = "tech"
                    tag = "Trending"
                    if any(w in p for w in ["tutorial", "review", "course", "watch", "video", "unboxing"]):
                        cat = "youtube"
                        tag = "YouTube Video"
                    elif any(w in p for w in ["job", "career", "salary", "hiring", "engineer", "developer"]):
                        cat = "job"
                        tag = "Career Role"
                    elif any(w in p for w in ["reel", "reels", "#", "hack", "tips", "tricks", "photography"]):
                        cat = "instagram"
                        tag = "Insta Reel"
                    elif platform in ("youtube", "linkedin", "monster", "foundit", "instagram"):
                        cat = platform

                    freq = max(50, 85 - len(live_items) * 3)
                    live_items.append({
                        "phrase": s["phrase"],
                        "category": cat,
                        "frequency": freq,
                        "tag": tag,
                        "source": "live_internet"
                    })
                    if len(live_items) >= 12:
                        break
        except Exception:
            pass
        if len(live_items) >= 12:
            break

    # If live suggestions returned items from internet, prioritize them!
    if live_items:
        # Also ensure at least one phone review / keyword has 'phone' if topic is phone
        return live_items

    # Secondary fallback only if offline / unreachable
    for key, cluster in TOPIC_CLUSTERS.items():
        if key in clean_topic or clean_topic in key:
            return cluster

    return [
        {"phrase": f"{clean_topic} complete guide 2026", "category": "youtube", "frequency": 70, "tag": "Guide"},
        {"phrase": f"best {clean_topic} review and comparison", "category": "youtube", "frequency": 68, "tag": "Review"},
        {"phrase": f"{clean_topic} tips for beginners", "category": "tech", "frequency": 62, "tag": "Tutorial"},
        {"phrase": f"{clean_topic} top features and walkthrough", "category": "youtube", "frequency": 60, "tag": "Walkthrough"},
        {"phrase": f"{clean_topic} technology innovations", "category": "tech", "frequency": 50, "tag": "Tech Trends"},
        {"phrase": f"#{clean_topic}hacks and daily tips", "category": "instagram", "frequency": 58, "tag": "Reels"},
        {"phrase": f"{clean_topic} buying advice and tradeoffs", "category": "tech", "frequency": 55, "tag": "Analysis"},
    ]


def inject_topic_into_trie(trie, topic: str, platform: str = "youtube") -> int:
    """
    Injects contextual keywords for a given topic and platform into the Trie.
    Applies source='history' to guarantee the 3x weight scoring multiplier,
    ensuring they outrank general global terms when the user types prefixes.
    Returns count of phrases injected.
    """
    if not topic or not topic.strip():
        return 0

    keywords = generate_dynamic_keywords(topic, platform)
    
    # Also inject the bare topic and primary phrase
    primary_phrase = f"{topic.strip().lower()} reviews"
    trie.insert(
        phrase=topic.strip().lower(),
        source="history",
        frequency=80,
        category=f"{platform}_context"
    )
    trie.insert(
        phrase=primary_phrase,
        source="history",
        frequency=75,
        category=f"{platform}_context"
    )

    injected = 2
    for item in keywords:
        trie.insert(
            phrase=item["phrase"],
            source="history",
            frequency=item["frequency"],
            category=f"{platform}_context"
        )
        injected += 1

    return injected


def get_contextual_recommendations(topic: str, platform: str = "youtube") -> Dict[str, Any]:
    """
    Produces full recommendation payload for active context,
    including keyword chips, title narrative, and federated preview.
    """
    clean_topic = topic.strip().lower()
    keywords = generate_dynamic_keywords(clean_topic, platform)

    platform_titles = {
        "youtube": f"Because you searched for '{topic}' on YouTube",
        "linkedin": f"Based on your recent LinkedIn exploration for '{topic}'",
        "monster": f"Based on your recent Monster exploration for '{topic}'",
        "foundit": f"Based on your recent foundit exploration for '{topic}'",
        "instagram": f"Inspired by reels you viewed about '{topic}' on Instagram",
        "browser": f"Because of your recent search for '{topic}'"
    }
    
    title = platform_titles.get(platform.lower(), f"Recommended for you based on '{topic}'")

    # Formatted recommendation list with calculated 3x score
    rec_items = []
    for kw in keywords[:10]:
        rec_items.append({
            "phrase": kw["phrase"],
            "category": kw["category"],
            "score": kw["frequency"] * 3,  # 3x history weight
            "source": "history",
            "tag": kw.get("tag", "Recommended"),
            "platform": platform
        })

    return {
        "active_context": {
            "platform": platform,
            "topic": topic,
            "title": title
        },
        "recommendations": rec_items,
        "quick_pills": [item["phrase"] for item in rec_items[:6]]
    }


# =========================================================================
# SEMANTIC VECTOR AUTOCOMPLETE KNOWLEDGE BASE & RETRIEVER
# =========================================================================
try:
    from vector_search import SemanticVectorEncoder
except ImportError:
    from backend.vector_search import SemanticVectorEncoder

_suggester_encoder = SemanticVectorEncoder()

ALL_KNOWLEDGE_PHRASES: List[Dict[str, Any]] = [
    # Mobile
    {"phrase": "smartphone specifications comparison 2025", "category": "tech", "domain": "mobile_hardware"},
    {"phrase": "phone deals and trade in discounts", "category": "tech", "domain": "mobile_hardware"},
    {"phrase": "phone camera sensor megapixel myth", "category": "tech", "domain": "mobile_hardware"},
    {"phrase": "phone battery optimization guide", "category": "tech", "domain": "mobile_hardware"},
    {"phrase": "best budget smartphone 2025", "category": "youtube", "domain": "mobile_hardware"},
    {"phrase": "foldable phone durability test", "category": "youtube", "domain": "mobile_hardware"},
    {"phrase": "#phonephotography tips and tricks", "category": "instagram", "domain": "mobile_hardware"},
    # Culinary
    {"phrase": "authentic italian carbonara pasta recipe", "category": "youtube", "domain": "culinary_gastronomy"},
    {"phrase": "15-minute gourmet weeknight dinners", "category": "youtube", "domain": "culinary_gastronomy"},
    {"phrase": "essential knife cuts and chef techniques", "category": "instagram", "domain": "culinary_gastronomy"},
    {"phrase": "artisan sourdough bread from scratch", "category": "youtube", "domain": "culinary_gastronomy"},
    {"phrase": "executive head chef culinary techniques", "category": "job", "domain": "culinary_gastronomy"},
    # Fitness
    {"phrase": "high-volume hypertrophy muscle growth protocol", "category": "youtube", "domain": "fitness_physiology"},
    {"phrase": "full body mobility and posture routine", "category": "youtube", "domain": "fitness_physiology"},
    {"phrase": "evidence-based fat loss and metabolic rate", "category": "youtube", "domain": "fitness_physiology"},
    {"phrase": "gym form mistakes killing your arm gains", "category": "instagram", "domain": "fitness_physiology"},
    {"phrase": "director of sports science athletic training", "category": "job", "domain": "fitness_physiology"},
    # Software & Coding
    {"phrase": "python full course 2025 tutorial", "category": "youtube", "domain": "web_software_engineering"},
    {"phrase": "fastapi asynchronous rest api microservices", "category": "tech", "domain": "web_software_engineering"},
    {"phrase": "full stack react 19 and nextjs app router", "category": "youtube", "domain": "web_software_engineering"},
    {"phrase": "system design masterclass high throughput systems", "category": "youtube", "domain": "web_software_engineering"},
    {"phrase": "senior python distributed systems architect", "category": "job", "domain": "web_software_engineering"},
    {"phrase": "#codingtips and clean code micro patterns", "category": "instagram", "domain": "web_software_engineering"},
    # AI
    {"phrase": "deep learning and neural networks masterclass", "category": "youtube", "domain": "ai_machine_learning"},
    {"phrase": "building autonomous llm agents with memory", "category": "youtube", "domain": "ai_machine_learning"},
    {"phrase": "transformer attention mechanism demystified", "category": "tech", "domain": "ai_machine_learning"},
    {"phrase": "lead machine learning engineer gpu training", "category": "job", "domain": "ai_machine_learning"},
    {"phrase": "#aitools every developer should use", "category": "instagram", "domain": "ai_machine_learning"},
    # Finance
    {"phrase": "value investing warren buffett balance sheets", "category": "youtube", "domain": "finance_wealth"},
    {"phrase": "index funds vs dividend growth passive wealth", "category": "youtube", "domain": "finance_wealth"},
    {"phrase": "power of compound interest long term investing", "category": "instagram", "domain": "finance_wealth"},
    {"phrase": "senior quantitative portfolio manager capital", "category": "job", "domain": "finance_wealth"},
    # Automotive
    {"phrase": "electric vehicle battery motor teardown", "category": "youtube", "domain": "automotive_ev"},
    {"phrase": "solid state battery vs lithium ion evs", "category": "tech", "domain": "automotive_ev"},
    {"phrase": "principal ev powertrain and bms engineer", "category": "job", "domain": "automotive_ev"},
    {"phrase": "#electricvehicles supercharging hacks", "category": "instagram", "domain": "automotive_ev"},
    # Science & Space
    {"phrase": "james webb space telescope deep universe", "category": "youtube", "domain": "science_astrophysics"},
    {"phrase": "quantum entanglement and non-locality physics", "category": "youtube", "domain": "science_astrophysics"},
    {"phrase": "black hole event horizon spacetime curvature", "category": "instagram", "domain": "science_astrophysics"},
    # Music
    {"phrase": "modern music production mixing and eq", "category": "youtube", "domain": "music_instruments"},
    {"phrase": "acoustic guitar fingerpicking chords tutorial", "category": "youtube", "domain": "music_instruments"},
    {"phrase": "synthesizer sound design and filters", "category": "youtube", "domain": "music_instruments"},
    # Gaming
    {"phrase": "unreal engine 5.5 graphics and lumen breakdown", "category": "youtube", "domain": "gaming_esports"},
    {"phrase": "top 10 open world rpgs 2025 gameplay", "category": "youtube", "domain": "gaming_esports"},
    {"phrase": "hidden windows settings that boost gaming fps", "category": "instagram", "domain": "gaming_esports"},
    # Travel
    {"phrase": "top 10 hidden travel destinations europe", "category": "youtube", "domain": "travel_hospitality"},
    {"phrase": "solo backpacking budget travel safe stays", "category": "youtube", "domain": "travel_hospitality"},
    {"phrase": "luxury overwater villa maldives resort tour", "category": "youtube", "domain": "travel_hospitality"}
]

_CACHED_KNOWLEDGE_EMBEDDINGS: Optional[List[Tuple[Dict[str, Any], List[float]]]] = None

def get_semantic_vector_suggestions(query: str, limit: int = 6) -> List[Dict[str, Any]]:
    """
    Retrieves autocomplete suggestions strictly based on semantic vector similarity (meaning).
    Returns semantically close suggestions even if no exact prefix letters match.
    """
    global _CACHED_KNOWLEDGE_EMBEDDINGS
    if not query or not query.strip():
        return []

    if _CACHED_KNOWLEDGE_EMBEDDINGS is None:
        _CACHED_KNOWLEDGE_EMBEDDINGS = [
            (item, _suggester_encoder.encode(item["phrase"] + " " + item.get("domain", "")))
            for item in ALL_KNOWLEDGE_PHRASES
        ]

    q_vec = _suggester_encoder.encode(query)
    scored = []
    for item, doc_vec in _CACHED_KNOWLEDGE_EMBEDDINGS:
        sim = _suggester_encoder.cosine_similarity(q_vec, doc_vec)
        if sim >= 0.35:
            scored.append((sim, item))

    scored.sort(key=lambda x: -x[0])

    results = []
    for sim, item in scored[:limit]:
        results.append({
            "phrase": item["phrase"],
            "category": item["category"],
            "score": round(sim * 100, 1),
            "vector_score": round(sim, 3),
            "source": "vector_semantic",
            "is_vector_match": True,
            "match_type": "vector_search"
        })
    return results
