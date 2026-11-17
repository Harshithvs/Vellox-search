import re
import sys

with open('backend/vector_search.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update imports
new_imports = '''import math
import re
from typing import List, Dict, Any, Tuple, Optional

try:
    from entity_enricher import enrich_query_entity
except ImportError:
    from backend.entity_enricher import enrich_query_entity

try:
    from domain_templates import get_templates_for_domain, get_multipage_templates
except ImportError:
    from backend.domain_templates import get_templates_for_domain, get_multipage_templates
'''

content = re.sub(
    r'import math\s*\nimport re\s*\nfrom typing import List, Dict, Any, Tuple\s*\n',
    new_imports + '\n',
    content,
    count=1
)

# 2. Update detect_domain
new_detect_domain = '''def detect_domain(query: str, entity_info: Optional[Dict[str, Any]] = None) -> str:
    """
    Classifies user queries into distinct semantic domains to ensure
    completely meaningful, contextualized descriptions and titles.
    Uses real entity knowledge hints whenever available.
    """
    if entity_info and entity_info.get("domain_hint"):
        return entity_info["domain_hint"]

    q = query.lower().strip()
    
    # 0. Animation, Cartoons, Anime & Manga
    if any(w in q for w in [
        'animation', 'animator', 'animating', 'cartoon', 'cartoons', 'anime', 'manga',
        'oggy', 'cockroach', 'cockroaches', 'tom and jerry', 'mickey', 'naruto', 'pokemon',
        'doraemon', 'shinchan', 'ghibli', 'disney', 'pixar', 'looney tunes', 'chhota bheem',
        'motu patlu', 'ben 10', 'spongebob', 'dragon ball', 'simpsons', 'shrek',
        'kung fu panda', 'avatar the last', 'cocomelon', 'peppa pig', 'scooby doo',
        'rick and morty', 'toon', '2d animation', '3d animation', 'stop motion',
        'claymation', 'shonen', 'shojo', 'death note', 'bleach', 'one piece',
        'demon slayer', 'jujutsu kaisen', 'my hero academia', 'attack on titan'
    ]):
        return 'animation_cartoons'

    # 1. Movies, Cinema & Entertainment
    if any(w in q for w in [
        'movie', 'movies', 'film', 'films', 'cinema', 'actor', 'actress', 'hollywood',
        'bollywood', 'marvel', 'batman', 'superman', 'avengers', 'netflix', 'trailer',
        'series', 'season', 'episode', 'director', 'oscar', 'blockbuster', 'cinematography',
        'stranger things', 'interstellar', 'inception', 'oppenheimer', 'barbie', 'jurassic',
        'star wars', 'lord of the rings', 'harry potter', 'hbo', 'box office'
    ]):
        return 'movies_entertainment'

    # 2. Gaming & Esports
    if any(w in q for w in [
        'game', 'gaming', 'gta', 'minecraft', 'valorant', 'fortnite', 'playstation', 'xbox',
        'steam', 'esports', 'roblox', 'nintendo', 'zelda', 'pubg', 'cod', 'call of duty',
        'assassin\\'s creed', 'cyberpunk', 'witcher', 'rpg', 'gameplay', 'walkthrough',
        'speedrun', 'boss fight', 'multiplayer', 'fps', 'clutch', 'apex legends', 'overwatch',
        'csgo', 'counter strike', 'gamer', 'twitch'
    ]):
        return 'gaming_esports'

    # 3. Culinary & Food
    if any(w in q for w in ['cook', 'recipe', 'food', 'bake', 'baking', 'chef', 'kitchen', 'dinner', 'cuisine', 'meal', 'pastry', 'grill', 'coffee', 'dessert', 'restaurant', 'taste', 'flavor', 'dish']):
        return 'culinary'
    # 4. Music & Instruments
    if any(w in q for w in ['guitar', 'piano', 'music', 'sing', 'singing', 'song', 'songs', 'instrument', 'audio', 'drum', 'drums', 'violin', 'producer', 'beats', 'melody', 'chords', 'vocal', 'acoustic', 'bass', 'flute', 'synthesizer']):
        return 'music'
    # 5. Fitness, Health & Sports
    if any(w in q for w in ['fitness', 'workout', 'gym', 'run', 'running', 'yoga', 'exercise', 'nutrition', 'diet', 'muscle', 'bodybuilding', 'cardio', 'sport', 'football', 'basketball', 'cricket', 'soccer', 'tennis', 'health', 'wellness', 'physio']):
        return 'fitness'
    # 6. Business, Finance & Wealth
    if any(w in q for w in ['finance', 'stock', 'stocks', 'invest', 'investing', 'investment', 'crypto', 'bitcoin', 'economics', 'trading', 'wealth', 'banking', 'portfolio', 'real estate', 'accounting', 'market', 'money', 'etf', 'dividend', 'revenue']):
        return 'finance'
    # 7. Automotive & Vehicles
    if any(w in q for w in ['car', 'cars', 'ev', 'electric vehicle', 'tesla', 'automotive', 'motorcycle', 'supercar', 'driving', 'vehicle', 'engine', 'racing', 'porsche', 'bmw', 'ferrari', 'horsepower', 'hybrid vehicle']):
        return 'automotive'
    # 8. Photography, Design & Creative Arts
    if any(w in q for w in ['design', 'photography', 'photo', 'camera', 'painting', 'drawing', 'art', 'ui', 'ux', 'photoshop', 'video editing', 'cinema', 'illustration', 'aesthetic', 'portrait', 'lighting', 'graphic design']):
        return 'creative_arts'
    # 9. Science, Space & Astronomy
    if any(w in q for w in ['space', 'astronomy', 'physics', 'quantum', 'biology', 'chemistry', 'science', 'planet', 'universe', 'cosmos', 'neuroscience', 'climate', 'telescope', 'particle', 'evolution', 'gravity']):
        return 'science_space'
    # 10. Mobile Hardware & Smartphones
    if any(w in q for w in ['phone', 'smartphone', 'cellphone', 'cellular', 'handset', 'mobile', 'iphone', 'android', 'galaxy', 'pixel', 'tablet', 'teardown', 'battery', 'snapdragon', 'calling gadget']):
        return 'mobile_hardware'
    # 11. Artificial Intelligence & ML
    if any(w in q for w in ['ai', 'artificial intelligence', 'machine learning', 'deep learning', 'neural network', 'neural net', 'transformer', 'llm', 'pytorch', 'vision', 'nlp', 'deepmind', 'openai']):
        return 'ai_ml'
    # 12. Software Engineering & Web Development
    if any(w in q for w in ['python', 'react', 'javascript', 'typescript', 'fastapi', 'coding', 'programming', 'web', 'backend', 'frontend', 'docker', 'kubernetes', 'system design', 'api', 'devops', 'microservice']):
        return 'software_dev'
    # 13. Careers & Job Listings
    if any(w in q for w in ['job', 'career', 'hiring', 'recruiting', 'vacancy', 'vacancies', 'employment', 'salary', 'interview', 'role', 'positions']):
        return 'careers'
    
    return 'general'
'''

content = re.sub(
    r'def detect_domain\(query: str\) -> str:.*?\n    return \'general\'',
    new_detect_domain.strip(),
    content,
    flags=re.DOTALL
)

# 3. Update search_platform and _generate_domain_meaningful_items
old_search_platform = '''    def search_platform(self, platform: str, query: str, top_k: int = 4, page: int = 1) -> List[Dict[str, Any]]:
        platform_key = platform.lower().strip()
        if platform_key not in self.indexed_embeddings:
            return []

        clean_q = query.strip()
        query_domain = detect_domain(clean_q)
        query_vec = self.encoder.encode(clean_q)
        detected_concept = self.encoder.detect_concept(clean_q)

        candidates = self.indexed_embeddings[platform_key]
        
        # Only consider candidates that have direct or close semantic domain affinity
        scored_items = []
        for item, doc_vec in candidates:
            item_domain = item.get("domain", "general")
            # Domain match compatibility check
            if query_domain in ("mobile_hardware", "ai_ml", "software_dev", "careers"):
                if item_domain == query_domain or (query_domain == "careers" and item_domain in ("software_dev", "ai_ml", "mobile_hardware")):
                    sim = self.encoder.cosine_similarity(query_vec, doc_vec)
                    scored_items.append((sim, item))
            elif query_domain == "general":
                sim = self.encoder.cosine_similarity(query_vec, doc_vec)
                scored_items.append((sim, item))

        # Sort descending by vector cosine similarity
        scored_items.sort(key=lambda x: -x[0])

        start_offset = (page - 1) * top_k
        end_offset = page * top_k
        page_scored = scored_items[start_offset:end_offset]

        best_sim = scored_items[0][0] if scored_items else 0.0

        results = []
        # Candidate items slice matching this specific page
        if best_sim >= 0.40 and len(page_scored) > 0:
            for rank_idx, (sim, item) in enumerate(page_scored):
                base_rel = 72.0 + (sim * 27.5) - ((page - 1) * 3.5)
                relevance = round(min(99.8, max(52.0, base_rel - (rank_idx * 1.8))), 1)

                item_copy = dict(item)
                item_copy["id"] = f"{item['id']}-p{page}-{rank_idx}" if page > 1 else item["id"]
                item_copy["relevance_score"] = relevance
                item_copy["vector_score"] = round(sim, 4)
                item_copy["match_type"] = "vector_search"
                item_copy["semantic_concept"] = detected_concept
                item_copy["vector_dimensions"] = self.encoder.DIMENSIONS
                item_copy["page"] = page
                results.append(item_copy)

        # Backfill or dynamically generate rich, domain-tailored meaningful content for this page
        needed = top_k - len(results)
        if needed > 0:
            dyn_items = self._generate_domain_meaningful_items(
                platform_key, clean_q, query_vec, query_domain, detected_concept,
                count=needed, page=page
            )
            results.extend(dyn_items)

        return results'''

new_search_platform = '''    def search_platform(self, platform: str, query: str, top_k: int = 4, page: int = 1) -> List[Dict[str, Any]]:
        platform_key = platform.lower().strip()
        if platform_key not in self.indexed_embeddings:
            return []

        clean_q = query.strip()
        entity_info = enrich_query_entity(clean_q)
        query_domain = detect_domain(clean_q, entity_info)
        query_vec = self.encoder.encode(clean_q)
        detected_concept = self.encoder.detect_concept(clean_q)

        candidates = self.indexed_embeddings[platform_key]
        
        # Only consider candidates that have direct or close semantic domain affinity
        scored_items = []
        for item, doc_vec in candidates:
            item_domain = item.get("domain", "general")
            # Domain match compatibility check
            if query_domain in ("mobile_hardware", "ai_ml", "software_dev", "careers"):
                if item_domain == query_domain or (query_domain == "careers" and item_domain in ("software_dev", "ai_ml", "mobile_hardware")):
                    sim = self.encoder.cosine_similarity(query_vec, doc_vec)
                    scored_items.append((sim, item))
            elif query_domain == "general":
                sim = self.encoder.cosine_similarity(query_vec, doc_vec)
                scored_items.append((sim, item))

        # Sort descending by vector cosine similarity
        scored_items.sort(key=lambda x: -x[0])

        start_offset = (page - 1) * top_k
        end_offset = page * top_k
        page_scored = scored_items[start_offset:end_offset]

        best_sim = scored_items[0][0] if scored_items else 0.0

        results = []
        # Candidate items slice matching this specific page
        if best_sim >= 0.40 and len(page_scored) > 0:
            for rank_idx, (sim, item) in enumerate(page_scored):
                base_rel = 72.0 + (sim * 27.5) - ((page - 1) * 3.5)
                relevance = round(min(99.8, max(52.0, base_rel - (rank_idx * 1.8))), 1)

                item_copy = dict(item)
                item_copy["id"] = f"{item['id']}-p{page}-{rank_idx}" if page > 1 else item["id"]
                item_copy["relevance_score"] = relevance
                item_copy["vector_score"] = round(sim, 4)
                item_copy["match_type"] = "vector_search"
                item_copy["semantic_concept"] = detected_concept
                item_copy["vector_dimensions"] = self.encoder.DIMENSIONS
                item_copy["page"] = page
                results.append(item_copy)

        # Backfill or dynamically generate rich, domain-tailored meaningful content for this page
        needed = top_k - len(results)
        if needed > 0:
            dyn_items = self._generate_domain_meaningful_items(
                platform_key, clean_q, query_vec, query_domain, detected_concept,
                count=needed, page=page, entity_info=entity_info
            )
            results.extend(dyn_items)

        return results'''

content = content.replace(old_search_platform, new_search_platform)

# 4. Update _generate_domain_meaningful_items and replace old templates block
new_generator_and_templates = '''    def _generate_domain_meaningful_items(
        self,
        platform: str,
        query: str,
        query_vec: List[float],
        domain: str,
        detected_concept: str,
        count: int = 4,
        page: int = 1,
        entity_info: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        clean_q = query.strip()
        title_q = (entity_info.get("title") if entity_info and entity_info.get("title") else clean_q.title())
        q_hash = abs(hash(f"{clean_q}-{page}")) % 10000

        # Template dictionary providing deeply meaningful, domain-specific descriptions
        # for YouTube, LinkedIn, and Instagram across infinite scroll pages
        templates = self._get_templates_for_domain(
            domain, clean_q, title_q, platform, page=page, entity_info=entity_info
        )

        items = []
        for idx, t in enumerate(templates[:count]):
            doc_text = f"{t['title']} {t['snippet']} {' '.join(t.get('tags', []))}"
            doc_vec = self.encoder.encode(doc_text)
            sim = max(0.68, self.encoder.cosine_similarity(query_vec, doc_vec))
            base_rel = max(55.0, 98.8 - ((page - 1) * 3.8) - (idx * 1.8))
            relevance = round(base_rel, 1)

            card = {
                "id": f"{platform[:2]}-p{page}-{idx}-{q_hash}",
                "platform": "YouTube" if platform == "youtube" else ("LinkedIn" if platform == "linkedin" else "Instagram"),
                "type": t.get("type", "Curated Intelligence"),
                "title": t["title"],
                "subtitle": t["subtitle"],
                "metrics": t["metrics"],
                "badge": t.get("badge", "Verified"),
                "snippet": t["snippet"],
                "url": t["url"],
                "tags": t.get("tags", [clean_q.lower()]),
                "relevance_score": relevance,
                "vector_score": round(sim, 4),
                "match_type": "vector_search",
                "semantic_concept": detected_concept,
                "vector_dimensions": self.encoder.DIMENSIONS,
                "verified_endpoint": t.get("endpoint", f"https://api.{platform}.com/v1"),
                "content_format": t.get("format", "Rich Multimedia"),
                "engagement_rate": t.get("engagement", "95.5%"),
                "page": page
            }
            items.append(card)

        return items

    def _get_templates_for_domain(
        self,
        domain: str,
        clean_q: str,
        title_q: str,
        platform: str,
        page: int = 1,
        entity_info: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        return get_templates_for_domain(
            domain, clean_q, title_q, platform, page=page, entity_info=entity_info
        )

    def _get_multipage_templates(
        self,
        domain: str,
        clean_q: str,
        title_q: str,
        platform: str,
        page: int,
        entity_info: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        return get_multipage_templates(
            domain, clean_q, title_q, platform, page=page, entity_info=entity_info
        )
'''

# Find from def _generate_domain_meaningful_items to vector_search_engine = VectorSearchEngine()
template_section_pattern = re.compile(
    r'    def _generate_domain_meaningful_items\(.*?\n(?=vector_search_engine = VectorSearchEngine\(\))',
    re.DOTALL
)

if not template_section_pattern.search(content):
    print("Error: Could not locate _generate_domain_meaningful_items block")
    sys.exit(1)

content = template_section_pattern.sub(new_generator_and_templates + '\n', content)

with open('backend/vector_search.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("backend/vector_search.py successfully updated!")
