"""
Seed data for Prefix Trie across tech concepts, job roles, YouTube tutorials, and Instagram hashtags.
Includes pre-seeded historical queries with source='history' to demonstrate 3x weight scoring.
"""

SEED_DATA = [
    # --- Tech Concepts (Global) ---
    {"phrase": "python tutorial for beginners", "source": "global", "frequency": 140, "category": "tech"},
    {"phrase": "python full course 2025", "source": "global", "frequency": 120, "category": "youtube"},
    {"phrase": "python for data science", "source": "global", "frequency": 95, "category": "tech"},
    {"phrase": "python backend engineer", "source": "global", "frequency": 80, "category": "job"},
    {"phrase": "python automation scripts", "source": "global", "frequency": 75, "category": "tech"},
    {"phrase": "pytorch deep learning masterclass", "source": "global", "frequency": 65, "category": "youtube"},
    {"phrase": "pydantic data validation", "source": "global", "frequency": 45, "category": "tech"},
    {"phrase": "pytest best practices", "source": "global", "frequency": 40, "category": "tech"},

    # --- Pre-seeded History queries (marked with source='history' -> 3x weight multiplier!) ---
    # Notice: frequency=50 * 3 = 150 score, which outranks global items with frequency 140!
    {"phrase": "python tutorial", "source": "history", "frequency": 50, "category": "history"},
    {"phrase": "fastapi microservices", "source": "history", "frequency": 60, "category": "history"},
    {"phrase": "ai systems architect", "source": "history", "frequency": 55, "category": "history"},

    # --- FastApi & Web Frameworks ---
    {"phrase": "fastapi full course tutorial", "source": "global", "frequency": 110, "category": "youtube"},
    {"phrase": "fastapi asynchronous rest api", "source": "global", "frequency": 85, "category": "tech"},
    {"phrase": "fastapi deployment with docker", "source": "global", "frequency": 70, "category": "tech"},
    {"phrase": "flask vs fastapi performance", "source": "global", "frequency": 50, "category": "tech"},

    # --- AI & Data Science ---
    {"phrase": "ai search engine architecture", "source": "global", "frequency": 130, "category": "tech"},
    {"phrase": "artificial intelligence roadmap", "source": "global", "frequency": 105, "category": "youtube"},
    {"phrase": "ai prompt engineering guide", "source": "global", "frequency": 90, "category": "tech"},
    {"phrase": "ai research scientist salary", "source": "global", "frequency": 60, "category": "job"},

    # --- Job Roles ---
    {"phrase": "ai solutions engineer", "source": "global", "frequency": 85, "category": "job"},
    {"phrase": "full stack developer remote", "source": "global", "frequency": 115, "category": "job"},
    {"phrase": "full stack react and python", "source": "global", "frequency": 75, "category": "job"},
    {"phrase": "frontend engineer typescript", "source": "global", "frequency": 90, "category": "job"},
    {"phrase": "machine learning engineer lead", "source": "global", "frequency": 100, "category": "job"},
    {"phrase": "devops platform engineer", "source": "global", "frequency": 80, "category": "job"},
    {"phrase": "cloud architect aws gcp", "source": "global", "frequency": 70, "category": "job"},

    # --- YouTube Tech Topics ---
    {"phrase": "react 19 full tutorial", "source": "global", "frequency": 125, "category": "youtube"},
    {"phrase": "system design interview masterclass", "source": "global", "frequency": 135, "category": "youtube"},
    {"phrase": "docker and kubernetes crash course", "source": "global", "frequency": 110, "category": "youtube"},
    {"phrase": "nextjs server components explained", "source": "global", "frequency": 95, "category": "youtube"},
    {"phrase": "building microservices with golang", "source": "global", "frequency": 75, "category": "youtube"},

    # --- Instagram Dev Tags & Reels ---
    {"phrase": "#pythondeveloper reels", "source": "global", "frequency": 105, "category": "instagram"},
    {"phrase": "#codingtips and tricks", "source": "global", "frequency": 98, "category": "instagram"},
    {"phrase": "#webdevelopment modern stack", "source": "global", "frequency": 90, "category": "instagram"},
    {"phrase": "#programmerlife daily vlog", "source": "global", "frequency": 85, "category": "instagram"},
    {"phrase": "#aitools for developers", "source": "global", "frequency": 115, "category": "instagram"},
    {"phrase": "#datascience portfolio projects", "source": "global", "frequency": 80, "category": "instagram"},
    {"phrase": "#techcareers advice", "source": "global", "frequency": 70, "category": "instagram"},

    # --- Phones & Mobile Tech (Global seeds) ---
    {"phrase": "phone specifications comparison 2025", "source": "global", "frequency": 90, "category": "tech"},
    {"phrase": "phone deals and trade in discounts", "source": "global", "frequency": 82, "category": "tech"},
    {"phrase": "phone camera sensor megapixel myth", "source": "global", "frequency": 74, "category": "tech"},
    {"phrase": "phone battery optimization guide", "source": "global", "frequency": 68, "category": "tech"},
]

