"""
Domain-Specific Intelligence Templates for Federated Vector Search.
Provides realistic, contextualized titles, subtitles, badges, metrics, and snippets
for YouTube, LinkedIn, and Instagram across various human domains (Animation/Cartoons,
Movies, Gaming, Music, Food, Fitness, Finance, Automotive, Creative Arts, Tech, General Knowledge).
"""

from typing import List, Dict, Any, Optional


def resolve_clean_concept_title(domain: str, clean_q: str, raw_title: str, entity_info: Optional[Dict[str, Any]] = None) -> str:
    """
    Resolves descriptive queries or sentence-like intents into elegant, natural concept topics
    so that results represent semantic meanings rather than awkward raw query repetitions.
    """
    if entity_info and entity_info.get("source") in ("wikipedia", "duckduckgo") and entity_info.get("title"):
        return entity_info["title"]

    q_lower = clean_q.lower().strip()
    words = q_lower.split()

    # Short direct named entities (e.g. "iPhone", "Tom and Jerry", "FastAPI") are preserved
    if len(words) <= 2 and not any(w in q_lower for w in ["how", "what", "where", "why", "device", "want", "learn", "make", "eat", "cook"]):
        return raw_title

    domain_subjects = {
        'mobile_hardware': "Flagship Smartphones & Mobile Systems",
        'culinary': "Artisan Culinary Techniques & Gourmet Recipes",
        'fitness': "Hypertrophy Science & Full-Body Strength",
        'software_dev': "Full-Stack Web Architecture & Clean Code",
        'ai_ml': "Deep Learning & Foundation AI Systems",
        'finance': "Strategic Value Investing & Capital Markets",
        'automotive': "Next-Gen EV Powertrain & High-Performance Engineering",
        'science_space': "Deep Space Astrophysics & Cosmic Exploration",
        'creative_arts': "Cinematic Visuals & Manual Camera Mastery",
        'music': "Acoustic Harmony & Modern Music Production",
        'gaming_esports': "Next-Gen Unreal Engine & Open-World Gaming",
        'animation_cartoons': "Classic Slapstick Animation & Cartoon Chases",
        'careers': "Senior Technology Leadership & Systems Architecture",
        'movies_entertainment': "Cinematic Filmmaking & Blockbuster Storytelling",
        'general': raw_title
    }
    return domain_subjects.get(domain, raw_title)


def get_templates_for_domain(
    domain: str,
    clean_q: str,
    title_q: str,
    platform: str,
    page: int = 1,
    entity_info: Optional[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    """Generates rich, context-accurate search result cards based on domain and entity metadata."""
    if page > 1:
        return get_multipage_templates(domain, clean_q, title_q, platform, page, entity_info)

    title_q = resolve_clean_concept_title(domain, clean_q, title_q, entity_info)
    q_url = clean_q.replace(' ', '+')
    q_tag = clean_q.replace(' ', '').lower()
    q_kw = clean_q.replace(' ', '%20')
    abstract = (entity_info.get("abstract") if entity_info else "") or ""

    # =========================================================================
    # 1. ANIMATION, CARTOONS & ANIME
    # =========================================================================
    if domain == 'animation_cartoons':
        main_snippet = (
            f"{abstract[:240]}..."
            if len(abstract) > 40
            else f"Watch hilarious comedic exploits, classic slapstick chases, and iconic full episodes featuring {title_q}. Pure entertainment for all ages!"
        )
        if platform == 'youtube':
            return [
                {
                    "title": f"{title_q} - Full Episodes & Best Funny Moments Compilation",
                    "subtitle": f"{title_q} Official / Animation Vault",
                    "metrics": {"views": "3.8M views", "duration": "32m 45s", "published": "2 days ago", "rating": 4.97},
                    "badge": "Full Episodes",
                    "snippet": main_snippet,
                    "url": f"https://www.youtube.com/results?search_query={q_url}+full+episodes",
                    "tags": [clean_q.lower(), "cartoon", "animation", "full-episodes", "comedy"],
                    "format": "1080p60 Full HD",
                    "engagement": "98.7%"
                },
                {
                    "title": f"The Funniest Scenes & Greatest Slapstick Highlights in {title_q}",
                    "subtitle": "Cartoon Classics & Comedy Vault",
                    "metrics": {"views": "1.9M views", "duration": "18m 10s", "published": "1 week ago", "rating": 4.93},
                    "badge": "Fan Favorite",
                    "snippet": f"Relive the most memorable chases, clever pranks, and iconic comedic timing that made {clean_q} famous worldwide.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+best+scenes",
                    "tags": [clean_q.lower(), "funny-moments", "comedy", "best-scenes"],
                    "format": "1080p60 Video",
                    "engagement": "97.4%"
                },
                {
                    "title": f"How {title_q} Was Animated: Behind the Scenes & Art History",
                    "subtitle": "Animation Archives & Studio Masters",
                    "metrics": {"views": "850K views", "duration": "24m 30s", "published": "3 weeks ago", "rating": 4.91},
                    "badge": "Behind The Scenes",
                    "snippet": f"Explore the storyboard sketches, traditional hand-drawn keyframing, comedic timing, voice dubbing, and animation history behind {title_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+behind+the+scenes+animation",
                    "tags": [clean_q.lower(), "making-of", "storyboard", "animation-art"],
                    "format": "4K Ultra HD",
                    "engagement": "96.2%"
                },
                {
                    "title": f"Top 10 Most Iconic {title_q} Episodes & Characters Ranked",
                    "subtitle": "Toon Reviews & Nostalgia Central",
                    "metrics": {"views": "1.2M views", "duration": "19m 50s", "published": "2 weeks ago", "rating": 4.89},
                    "badge": "Top 10 Ranked",
                    "snippet": f"A nostalgic countdown analyzing the highest-rated episodes, character chemistry, and unforgettable slapstick humor from {clean_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+top+episodes",
                    "tags": [clean_q.lower(), "top-10", "episodes", "review"],
                    "format": "1080p60 Video",
                    "engagement": "95.5%"
                }
            ]
        elif platform == 'linkedin':
            return [
                {
                    "title": f"Senior 2D/3D Character Animator - Cartoon Series Production",
                    "subtitle": "Animation Studios / Entertainment Media",
                    "metrics": {"location": "Burbank, CA & Paris, FR (Hybrid)", "stat": "48 applicants", "compensation": "$115,000 - $160,000 / yr"},
                    "badge": "Creative Opportunity",
                    "type": "Character Animation Role",
                    "snippet": f"Seeking experienced character animators with expertise in comedic timing, squash-and-stretch principles, and episodic production inspired by animated series like {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+animator",
                    "tags": [clean_q.lower(), "character-animator", "animation-studios", "2d-animation"]
                },
                {
                    "title": f"Lead Storyboard Artist & Gag Visualizer - Animated Television",
                    "subtitle": "Global Broadcast & Streaming Animation",
                    "metrics": {"location": "Vancouver, BC & New York, NY", "stat": "36 applicants", "compensation": "$110,000 - $145,000 / yr"},
                    "badge": "Actively Recruiting",
                    "type": "Storyboarding Role",
                    "snippet": f"Developing dynamic beat boards, visual humor, and story animatics for comedy cartoon series in the style of {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+storyboard",
                    "tags": [clean_q.lower(), "storyboard-artist", "visual-development", "cartoon"]
                },
                {
                    "title": f"Animation Studio Director - Children's & Family Entertainment",
                    "subtitle": "Animation Production Network",
                    "metrics": {"location": "Los Angeles, CA (On-site)", "stat": "29 applicants", "compensation": "$160,000 - $220,000 / yr"},
                    "badge": "Studio Leadership",
                    "type": "Executive Role",
                    "snippet": f"Directing multi-season episodic pipelines, character design consistency, and international syndication for global animated IP like {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+director",
                    "tags": [clean_q.lower(), "animation-director", "studio-production", "licensing"]
                },
                {
                    "title": f"Voice Acting Director & Foley Sound Designer - Cartoon Media",
                    "subtitle": "Audio Post-Production & Sound Labs",
                    "metrics": {"location": "London, UK & Austin, TX", "stat": "22 applicants", "compensation": "$95,000 - $130,000 / yr"},
                    "badge": "Audio Specialist",
                    "type": "Sound Design Role",
                    "snippet": f"Supervising iconic sound effects, comedic foley timing, and character vocalization tracks for animated productions like {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+sound+designer",
                    "tags": [clean_q.lower(), "sound-design", "foley-artist", "voice-acting"]
                }
            ]
        else: # Instagram
            return [
                {
                    "title": f"🔥 That One Unforgettable {title_q} Scene Everyone Remembers!",
                    "subtitle": "@nostalgic.toons (1.4M followers)",
                    "metrics": {"likes": "210.5k likes", "comments": "4,120 comments", "duration": "0:45"},
                    "badge": "Viral Reel",
                    "snippet": f"Rewatching the hilarious moment from {title_q} that made entire generations burst out laughing.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}/",
                    "tags": [f"#{q_tag}", "#cartoons", "#nostalgia", "#comedy"]
                },
                {
                    "title": f"🎨 Speed-Drawing the Main Characters of {title_q} in 60 Seconds",
                    "subtitle": "@sketch.master.daily (620k artists)",
                    "metrics": {"likes": "94.2k likes", "comments": "1,380 comments", "duration": "0:58"},
                    "badge": "Artist Spotlight",
                    "snippet": f"Satisfying digital illustration time-lapse breaking down character shapes, line weights, and vibrant coloring for {title_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}art/",
                    "tags": [f"#{q_tag}", "#characterdesign", "#drawingtutorial", "#digitalart"]
                },
                {
                    "title": f"✨ 3 Fascinating Facts You Never Knew About {title_q}",
                    "subtitle": "@animation.secrets (890k fans)",
                    "metrics": {"likes": "142.8k likes", "comments": "2,050 comments", "duration": "0:40"},
                    "badge": "Did You Know",
                    "snippet": f"The surprising backstory, creator inspiration, and hidden Easter eggs inside {title_q} that you probably missed!",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}facts/",
                    "tags": [f"#{q_tag}", "#animationfacts", "#trivia", "#eastereggs"]
                },
                {
                    "title": f"🔊 Iconic Sound Effects of {title_q} with Beat Drop",
                    "subtitle": "@soundtrack.nostalgia (450k reels)",
                    "metrics": {"likes": "118.6k likes", "comments": "1,940 comments", "duration": "0:32"},
                    "badge": "Trending Audio",
                    "snippet": f"The legendary sound design and musical themes of {title_q} turned into a viral soundtrack reel.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}soundtrack/",
                    "tags": [f"#{q_tag}", "#soundtrack", "#cartoonaudio", "#remix"]
                }
            ]

    # =========================================================================
    # 2. MOVIES, CINEMA & ENTERTAINMENT
    # =========================================================================
    elif domain == 'movies_entertainment':
        main_snippet = (
            f"{abstract[:240]}..."
            if len(abstract) > 40
            else f"Explore cinematic highlights, trailers, production history, and in-depth storyline breakdowns for {title_q}."
        )
        if platform == 'youtube':
            return [
                {
                    "title": f"{title_q} - Official Trailer, Teaser & HD Scene Breakdown",
                    "subtitle": "Cinema Spotlight & Warner Studios",
                    "metrics": {"views": "4.6M views", "duration": "3m 40s", "published": "3 days ago", "rating": 4.96},
                    "badge": "Official Trailer",
                    "snippet": main_snippet,
                    "url": f"https://www.youtube.com/results?search_query={q_url}+official+trailer",
                    "tags": [clean_q.lower(), "trailer", "movie", "cinema", "hd"],
                    "format": "4K Ultra HD",
                    "engagement": "98.1%"
                },
                {
                    "title": f"Ending Explained & Full Narrative Breakdown of {title_q}",
                    "subtitle": "Film Studies & Screenplay Deep Dive",
                    "metrics": {"views": "1.4M views", "duration": "21m 15s", "published": "1 week ago", "rating": 4.92},
                    "badge": "Ending Explained",
                    "snippet": f"Analyzing key plot twists, hidden clues, symbolic motifs, and character motivations across {clean_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+ending+explained",
                    "tags": [clean_q.lower(), "ending-explained", "plot", "spoilers"],
                    "format": "1080p60 Video",
                    "engagement": "96.5%"
                },
                {
                    "title": f"Behind The Scenes of {title_q}: Stunts, Visual Effects & Cast Interviews",
                    "subtitle": "Hollywood Insider & Film Archives",
                    "metrics": {"views": "980K views", "duration": "28m 30s", "published": "2 weeks ago", "rating": 4.89},
                    "badge": "Behind The Scenes",
                    "snippet": f"Go on set with the director, cinematographer, and cast to see how iconic sequences in {title_q} were brought to life.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+behind+the+scenes",
                    "tags": [clean_q.lower(), "making-of", "stunts", "interviews"],
                    "format": "4K Ultra HD",
                    "engagement": "95.8%"
                },
                {
                    "title": f"Is {title_q} a Masterpiece? Honest Critic Review & Box Office Analysis",
                    "subtitle": "The Film Review Show",
                    "metrics": {"views": "720K views", "duration": "16m 45s", "published": "5 days ago", "rating": 4.87},
                    "badge": "Critic Review",
                    "snippet": f"A balanced cinematic critique evaluating pacing, screenplay depth, score, and cultural reception of {title_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+movie+review",
                    "tags": [clean_q.lower(), "review", "critique", "box-office"],
                    "format": "1080p60 Video",
                    "engagement": "94.9%"
                }
            ]
        elif platform == 'linkedin':
            return [
                {
                    "title": f"Visual Effects (VFX) Compositor & CGI Artist - {title_q} Franchise",
                    "subtitle": "Industrial Light & Magic / Framestore",
                    "metrics": {"location": "London, UK & Los Angeles, CA", "stat": "42 applicants", "compensation": "$125,000 - $170,000 / yr"},
                    "badge": "Actively Recruiting",
                    "type": "VFX Production Role",
                    "snippet": f"Compositing photorealistic CGI elements, digital environment matte painting, and atmospheric lighting for major films like {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+vfx",
                    "tags": [clean_q.lower(), "vfx", "compositor", "film-production"]
                },
                {
                    "title": f"Film Production Coordinator & Studio Logistics Lead",
                    "subtitle": "Universal Pictures / Warner Bros Discovery",
                    "metrics": {"location": "Atlanta, GA (On-site)", "stat": "31 applicants", "compensation": "$105,000 - $140,000 / yr"},
                    "badge": "Top Match",
                    "type": "Production Management",
                    "snippet": f"Overseeing shooting schedules, on-location crew coordination, equipment logistics, and post-production handoffs for feature productions like {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+production",
                    "tags": [clean_q.lower(), "production-coordinator", "film", "logistics"]
                },
                {
                    "title": f"Entertainment Licensing & Global Distribution Manager",
                    "subtitle": "Paramount Global / Sony Pictures",
                    "metrics": {"location": "New York, NY (Hybrid)", "stat": "27 applicants", "compensation": "$140,000 - $190,000 / yr"},
                    "badge": "Executive Role",
                    "type": "Distribution Leadership",
                    "snippet": f"Managing worldwide theatrical release windows, SVOD streaming deals, and consumer product licensing for premier entertainment IP like {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+licensing",
                    "tags": [clean_q.lower(), "entertainment-business", "licensing", "distribution"]
                },
                {
                    "title": f"Director of Photography & Cinematography Fellow",
                    "subtitle": "American Society of Cinematographers (ASC)",
                    "metrics": {"location": "Los Angeles, CA", "stat": "18,400+ followers", "compensation": "Director Consulting"},
                    "badge": "Industry Authority",
                    "type": "Professional Profile",
                    "snippet": f"Award-winning cinematographer analyzing lighting setups, anamorphic lens choices, and visual tone in works like {title_q}.",
                    "url": f"https://www.linkedin.com/search/results/people/?keywords={q_kw}+cinematography",
                    "tags": [clean_q.lower(), "cinematography", "director-of-photography", "film-arts"]
                }
            ]
        else: # Instagram
            return [
                {
                    "title": f"🎬 Iconic Movie Quotes & Dramatic Moments from {title_q}",
                    "subtitle": "@cinema.aesthetics (1.8M cinephiles)",
                    "metrics": {"likes": "320.4k likes", "comments": "5,110 comments", "duration": "0:50"},
                    "badge": "Viral Reel",
                    "snippet": f"The unforgettable lines and breathtaking cinematography from {title_q} that gives everyone chills.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}/",
                    "tags": [f"#{q_tag}", "#cinema", "#moviequotes", "#filmedits"]
                },
                {
                    "title": f"✨ 3 Film Details in {title_q} You Missed the First Time",
                    "subtitle": "@movie.eastereggs (740k fans)",
                    "metrics": {"likes": "148.1k likes", "comments": "1,980 comments", "duration": "0:42"},
                    "badge": "Did You Know",
                    "snippet": f"Subtle foreshadowing, camera tricks, and hidden director tributes buried in {title_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}eastereggs/",
                    "tags": [f"#{q_tag}", "#filmtrivia", "#eastereggs", "#hiddendetails"]
                },
                {
                    "title": f"🎭 The Cast of {title_q} on the Red Carpet Premiere",
                    "subtitle": "@hollywood.insider (960k fans)",
                    "metrics": {"likes": "184.5k likes", "comments": "2,420 comments", "duration": "0:35"},
                    "badge": "Red Carpet",
                    "snippet": f"High-energy red carpet moments, cast chemistry, and fashion at the international premiere of {title_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}premiere/",
                    "tags": [f"#{q_tag}", "#redcarpet", "#premiere", "#celebrity"]
                },
                {
                    "title": f"🔥 Stunt Doubles & Practical Effects in {title_q} Unmasked",
                    "subtitle": "@stunts.unleashed (510k fans)",
                    "metrics": {"likes": "97.2k likes", "comments": "1,140 comments", "duration": "0:48"},
                    "badge": "Stunts Spotlight",
                    "snippet": f"Side-by-side comparison of the actual stunt performers executing mind-boggling action sequences for {title_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}stunts/",
                    "tags": [f"#{q_tag}", "#stuntwork", "#behindthescenes", "#practicaleffects"]
                }
            ]

    # =========================================================================
    # 3. GAMING & ESPORTS
    # =========================================================================
    elif domain == 'gaming_esports':
        main_snippet = (
            f"{abstract[:240]}..."
            if len(abstract) > 40
            else f"Explore gameplay guides, secret strategies, high-FPS benchmarks, and competitive mechanics for {title_q}."
        )
        if platform == 'youtube':
            return [
                {
                    "title": f"{title_q} - Complete Gameplay Walkthrough & Beginner's Guide",
                    "subtitle": "IGN & GamerX Walkthroughs",
                    "metrics": {"views": "2.9M views", "duration": "45m 20s", "published": "4 days ago", "rating": 4.95},
                    "badge": "Full Walkthrough",
                    "snippet": main_snippet,
                    "url": f"https://www.youtube.com/results?search_query={q_url}+gameplay+walkthrough",
                    "tags": [clean_q.lower(), "gameplay", "walkthrough", "guide", "tips"],
                    "format": "4K 60FPS Stream",
                    "engagement": "97.8%"
                },
                {
                    "title": f"Top 10 Secret Tricks & Hidden Mechanics in {title_q}",
                    "subtitle": "ProGaming Strategies & Tech",
                    "metrics": {"views": "1.3M views", "duration": "18m 40s", "published": "1 week ago", "rating": 4.92},
                    "badge": "Pro Tips",
                    "snippet": f"Game-breaking movement tricks, hidden loot locations, and meta tactics to dominate in {clean_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+secret+tips",
                    "tags": [clean_q.lower(), "secrets", "pro-tips", "hidden-mechanics"],
                    "format": "1080p60 Video",
                    "engagement": "96.4%"
                },
                {
                    "title": f"{title_q} Graphics & Performance Benchmark: RTX 4090 vs PS5 vs Xbox Series X",
                    "subtitle": "Digital Foundry & Hardware Unboxed",
                    "metrics": {"views": "890K views", "duration": "24m 10s", "published": "2 weeks ago", "rating": 4.91},
                    "badge": "DF Tested",
                    "snippet": f"Frame rate stability, ray tracing overhead, dynamic resolution scaling, and optimal graphical presets for {title_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+graphics+benchmark",
                    "tags": [clean_q.lower(), "digital-foundry", "benchmark", "ps5", "pc-gaming"],
                    "format": "4K Ultra HD",
                    "engagement": "95.9%"
                },
                {
                    "title": f"The Complete Lore & Story History of {title_q} Explained",
                    "subtitle": "VaatiVidya & Lore Collective",
                    "metrics": {"views": "1.1M views", "duration": "38m 50s", "published": "3 weeks ago", "rating": 4.94},
                    "badge": "Lore Deep Dive",
                    "snippet": f"Connecting character backstories, ancient history, and world-building mythology throughout the universe of {title_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+lore+story",
                    "tags": [clean_q.lower(), "lore", "story", "mythology"],
                    "format": "4K Ultra HD",
                    "engagement": "96.7%"
                }
            ]
        elif platform == 'linkedin':
            return [
                {
                    "title": f"Senior Gameplay Engineer (Unreal Engine 5) - {title_q} Studio",
                    "subtitle": "Riot Games / Epic Games Studios",
                    "metrics": {"location": "Los Angeles, CA & Seattle, WA", "stat": "51 applicants", "compensation": "$145,000 - $205,000 / yr"},
                    "badge": "Actively Recruiting",
                    "type": "Engineering Role",
                    "snippet": f"Architecting multiplayer networking, player combat mechanics, and physics interactions for games like {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+gameplay+engineer",
                    "tags": [clean_q.lower(), "gameplay-engineer", "unreal-engine", "game-dev"]
                },
                {
                    "title": f"Lead 3D Environment & Level Designer - AAA Action Titles",
                    "subtitle": "Naughty Dog / Blizzard Entertainment",
                    "metrics": {"location": "San Francisco, CA (Hybrid)", "stat": "38 applicants", "compensation": "$130,000 - $175,000 / yr"},
                    "badge": "Top Match",
                    "type": "Design Role",
                    "snippet": f"Building immersive game worlds, spatial flow, lighting composition, and environmental storytelling inspired by {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+level+designer",
                    "tags": [clean_q.lower(), "level-design", "environment-artist", "aaa-games"]
                },
                {
                    "title": f"Esports Tournament Operations & Community Manager",
                    "subtitle": "ESL FACEIT Group / Electronic Arts",
                    "metrics": {"location": "Austin, TX (Remote)", "stat": "29 applicants", "compensation": "$95,000 - $135,000 / yr"},
                    "badge": "Hot Opportunity",
                    "type": "Operations Role",
                    "snippet": f"Coordinating competitive tournaments, live broadcast logistics, and player relations for community titles like {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+esports",
                    "tags": [clean_q.lower(), "esports", "tournament-operations", "community"]
                },
                {
                    "title": f"Senior Game Producer & Monetization Strategist",
                    "subtitle": "PlayStation Studios / Ubisoft",
                    "metrics": {"location": "San Diego, CA (On-site)", "stat": "34 applicants", "compensation": "$150,000 - $210,000 / yr"},
                    "badge": "Leadership Role",
                    "type": "Production Leadership",
                    "snippet": f"Balancing live-service roadmap delivery, player retention loops, and seasonal content cadence for flagship games like {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+game+producer",
                    "tags": [clean_q.lower(), "game-producer", "monetization", "live-service"]
                }
            ]
        else: # Instagram
            return [
                {
                    "title": f"🎮 Insane 1v5 Clutch in {title_q}! How Did He Survive?!",
                    "subtitle": "@esports.clutches (2.1M gamers)",
                    "metrics": {"likes": "450.2k likes", "comments": "6,210 comments", "duration": "0:30"},
                    "badge": "Viral Clutch",
                    "snippet": f"Unbelievable reaction times, crisp crosshair placement, and pure ice in the veins playing {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}/",
                    "tags": [f"#{q_tag}", "#gaming", "#clutch", "#highlight", "#gamer"]
                },
                {
                    "title": f"⚡ Stop Playing {title_q} Without Changing This One Setting!",
                    "subtitle": "@pc.optimization (820k fans)",
                    "metrics": {"likes": "184.6k likes", "comments": "2,190 comments", "duration": "0:45"},
                    "badge": "Settings Hack",
                    "snippet": f"Instant +40 FPS boost and zero input lag fix with this hidden optimization for {title_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}settings/",
                    "tags": [f"#{q_tag}", "#fpsboost", "#pcsettings", "#inputlag"]
                },
                {
                    "title": f"🖥️ Cleanest Minimalist Battlestation Built Specifically for {title_q}",
                    "subtitle": "@dream.battlestations (1.5M setups)",
                    "metrics": {"likes": "215.8k likes", "comments": "3,410 comments", "duration": "0:38"},
                    "badge": "Setup Goals",
                    "snippet": f"OLED curved display, custom keycaps, and ambient backlighting tuned for long gaming sessions in {title_q}.",
                    "url": f"https://www.instagram.com/explore/tags/gamingsetup/",
                    "tags": [f"#{q_tag}", "#gamingsetup", "#battlestation", "#cleansetup"]
                },
                {
                    "title": f"😂 When You Spend 4 Hours Doing Character Customization in {title_q}",
                    "subtitle": "@gaming.memes.daily (980k gamers)",
                    "metrics": {"likes": "162.4k likes", "comments": "2,840 comments", "duration": "0:25"},
                    "badge": "Gamer Meme",
                    "snippet": f"The universal struggle of tweaking sliders for hours only to put a helmet on immediately in {title_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}memes/",
                    "tags": [f"#{q_tag}", "#gamermeme", "#relatable", "#gamingcomedy"]
                }
            ]

    # =========================================================================
    # 4. CULINARY & FOOD
    # =========================================================================
    elif domain == 'culinary':
        if platform == 'youtube':
            return [
                {
                    "title": f"The Master Guide to {title_q}: Essential Techniques, Flavor Balancing & Recipes",
                    "subtitle": "Chef Jean-Pierre & Epicurious Studio",
                    "metrics": {"views": "1.4M views", "duration": "26m 40s", "published": "4 days ago", "rating": 4.96},
                    "badge": "Culinary Masterclass",
                    "snippet": f"Master the art of {clean_q} with professional culinary techniques. Learn ingredient selection, pan temperature control, seasoning ratios, and restaurant plating.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+recipe+masterclass",
                    "tags": [clean_q.lower(), "recipe", "cooking", "culinary-skills"],
                    "format": "4K Ultra HD Stream",
                    "engagement": "98.2%"
                },
                {
                    "title": f"5 Critical {title_q} Mistakes Most Home Cooks Make (And How to Fix Them)",
                    "subtitle": "America's Test Kitchen & Kenji",
                    "metrics": {"views": "890K views", "duration": "18m 15s", "published": "2 weeks ago", "rating": 4.91},
                    "badge": "Kitchen Science",
                    "snippet": f"Avoid ruined textures and flat flavors. We test heat conductivity, resting times, and acid balancing to dramatically improve your {clean_q} results.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+cooking+mistakes",
                    "tags": [clean_q.lower(), "food-science", "cooking-tips", "home-chef"],
                    "format": "1080p60 Video",
                    "engagement": "96.5%"
                },
                {
                    "title": f"Restaurant-Grade {title_q} in Under 20 Minutes (Simple Step-by-Step)",
                    "subtitle": "Gordon Ramsay Academy",
                    "metrics": {"views": "2.1M views", "duration": "19m 50s", "published": "1 month ago", "rating": 4.94},
                    "badge": "Staff Pick",
                    "snippet": f"High-speed gourmet preparation of {clean_q}. Simple pantry prep, high-heat searing methods, and vibrant herb finishing that elevates everyday dining.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+quick+recipe",
                    "tags": [clean_q.lower(), "quick-dinner", "gourmet", "chef-tips"],
                    "format": "4K Ultra HD",
                    "engagement": "97.4%"
                },
                {
                    "title": f"The Science of {title_q}: Heat, Moisture & Maillard Reaction Explained",
                    "subtitle": "Ethan Chlebowski & FoodLab",
                    "metrics": {"views": "640K views", "duration": "15m 30s", "published": "5 days ago", "rating": 4.88},
                    "badge": "Food Science",
                    "snippet": f"Side-by-side experiments breaking down salinity, surface moisture removal, and thermal gradients for unforgettable {clean_q} flavor.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+food+science",
                    "tags": [clean_q.lower(), "culinary-science", "flavor-profile"],
                    "format": "1080p60 Video",
                    "engagement": "94.8%"
                }
            ]
        elif platform == 'linkedin':
            return [
                {
                    "title": f"Executive Chef & {title_q} Culinary Operations Director",
                    "subtitle": "Michelin Hospitality Group / Luxury Dining",
                    "metrics": {"location": "New York, NY (On-site)", "stat": "42 applicants", "compensation": "$145,000 - $190,000 / yr"},
                    "badge": "Actively Recruiting",
                    "type": "Executive Role",
                    "snippet": f"Leading multi-venue kitchen operations, seasonal menu innovation, local farm sourcing, and culinary excellence centered on elevated {clean_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+chef",
                    "tags": [clean_q.lower(), "hospitality", "executive-chef", "culinary-management"]
                },
                {
                    "title": f"Senior Food Product Developer - {title_q} & CPG Innovation",
                    "subtitle": "Nestle / Whole Foods Brand Labs",
                    "metrics": {"location": "Chicago, IL (Hybrid)", "stat": "67 applicants", "compensation": "$125,000 - $160,000 / yr"},
                    "badge": "Top Match",
                    "type": "R&D Position",
                    "snippet": f"Spearheading sensory evaluation panels, clean-label formulation, and shelf-life stability testing for commercial retail {clean_q} product lines.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+food+science",
                    "tags": [clean_q.lower(), "food-science", "product-development", "cpg"]
                },
                {
                    "title": f"Chef Marcus Laurent - Master of Gastronomy & {title_q} Consultant",
                    "subtitle": "Culinary Institute Fellow & Keynote Speaker",
                    "metrics": {"location": "San Francisco, CA & Paris, FR", "stat": "15,200+ followers", "compensation": "Consulting & Masterclasses"},
                    "badge": "Industry Leader",
                    "type": "Professional Profile",
                    "snippet": f"Advising international culinary academies, publishing award-winning cookbooks on authentic {clean_q}, and training Michelin-starred kitchen brigades.",
                    "url": f"https://www.linkedin.com/search/results/people/?keywords={q_kw}+culinary",
                    "tags": [clean_q.lower(), "gastronomy", "culinary-arts", "consultant"]
                },
                {
                    "title": f"Global Sourcing Specialist - Specialty Ingredients for {title_q}",
                    "subtitle": "Artisan Imports & Supply Chain",
                    "metrics": {"location": "Seattle, WA (Remote)", "stat": "31 applicants", "compensation": "$105,000 - $135,000 / yr"},
                    "badge": "New Listing",
                    "type": "Supply Chain Role",
                    "snippet": f"Managing direct-trade relationships with organic producers, spice cooperatives, and heritage growers providing premium ingredients for {clean_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+sourcing",
                    "tags": [clean_q.lower(), "sourcing", "organic-food", "logistics"]
                }
            ]
        else: # Instagram
            return [
                {
                    "title": f"🔥 The Secret to Super Crispy {title_q} You've Been Missing!",
                    "subtitle": "@thecheftok (920k foodies)",
                    "metrics": {"likes": "218.4k likes", "comments": "3,410 comments", "duration": "0:42"},
                    "badge": "Viral Recipe",
                    "snippet": f"Watch the sizzling close-up! The simple two-ingredient pan hack that creates an irresistible golden crust on your {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}/",
                    "tags": [f"#{q_tag}", "#foodtok", "#cookingtips", "#recipehack"]
                },
                {
                    "title": f"⚡ Stop Cooking {title_q} Wrong! Watch This 30-Second Trick",
                    "subtitle": "@quickmeals.daily (640k foodies)",
                    "metrics": {"likes": "145.2k likes", "comments": "1,980 comments", "duration": "0:30"},
                    "badge": "Chef Hack",
                    "snippet": f"Most people crowd the pan and steam it. Here is the culinary-school technique to ensure juicy, tender {clean_q} every single time.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}recipe/",
                    "tags": [f"#{q_tag}", "#kitchensecrets", "#cooking101", "#homechef"]
                },
                {
                    "title": f"Restaurant-Style Garlic Butter {title_q} Plating",
                    "subtitle": "@gourmet.plates (480k members)",
                    "metrics": {"likes": "98.7k likes", "comments": "1,220 comments", "duration": "0:55"},
                    "badge": "Aesthetic Plating",
                    "snippet": f"Silky herb-infused emulsion, finishing with flaky sea salt and microgreens. Master luxury restaurant presentation for {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/gourmetcooking/",
                    "tags": [f"#{q_tag}", "#gourmet", "#finedining", "#plating"]
                },
                {
                    "title": f"Budget vs High-End {title_q}: Can You Taste the Difference?",
                    "subtitle": "@flavor.test (750k foodies)",
                    "metrics": {"likes": "182.9k likes", "comments": "2,740 comments", "duration": "0:50"},
                    "badge": "Taste Test",
                    "snippet": f"Blind taste test pitting $5 grocery ingredients against $60 luxury specialty items for {clean_q}. The winner surprised everyone!",
                    "url": f"https://www.instagram.com/explore/tags/tastetest/",
                    "tags": [f"#{q_tag}", "#tastetest", "#foodcomparison", "#budgetcooking"]
                }
            ]

    # =========================================================================
    # 5. CREATIVE ARTS & DESIGN
    # =========================================================================
    elif domain == 'creative_arts':
        if platform == 'youtube':
            return [
                {
                    "title": f"The Complete Guide to {title_q}: Principles, Tools & Visual Mastery",
                    "subtitle": "The Futur & Creative Bloq",
                    "metrics": {"views": "1.7M views", "duration": "31m 15s", "published": "1 week ago", "rating": 4.96},
                    "badge": "Design Masterclass",
                    "snippet": f"Deep dive into color harmony, visual hierarchy, spatial tension, and typography rules when designing with {clean_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+design+tutorial",
                    "tags": [clean_q.lower(), "design", "creative", "ui-ux", "visual-arts"],
                    "format": "4K Ultra HD",
                    "engagement": "98.0%"
                },
                {
                    "title": f"Speedpainting & Procreate Workflow for {title_q}",
                    "subtitle": "ArtStation Masters & Trent Kaniuga",
                    "metrics": {"views": "920K views", "duration": "22m 40s", "published": "2 weeks ago", "rating": 4.92},
                    "badge": "Speedpainting",
                    "snippet": f"Watch the creative process from initial rough thumbnailing to final lighting render for {clean_q} artwork.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+art+tutorial",
                    "tags": [clean_q.lower(), "digital-art", "speedpaint", "procreate"],
                    "format": "1080p60 Video",
                    "engagement": "96.4%"
                },
                {
                    "title": f"Top 7 Portfolio Mistakes in {title_q} That Ruin Job Offers",
                    "subtitle": "Satori Graphics & CharliMarieTV",
                    "metrics": {"views": "640K views", "duration": "17m 50s", "published": "5 days ago", "rating": 4.89},
                    "badge": "Portfolio Review",
                    "snippet": f"Critiquing real junior and senior designer portfolios in {clean_q}. How to showcase case studies and land top creative roles.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+portfolio+review",
                    "tags": [clean_q.lower(), "portfolio", "design-tips", "careers"],
                    "format": "1080p60 Video",
                    "engagement": "95.1%"
                },
                {
                    "title": f"Color Theory & Composition Breakdown in {title_q}",
                    "subtitle": "Marco Bucci & Sinix Design",
                    "metrics": {"views": "1.1M views", "duration": "24m 10s", "published": "3 weeks ago", "rating": 4.95},
                    "badge": "Color Theory",
                    "snippet": f"Mastering ambient occlusion, temperature shifts, gamut mapping, and focal dominance for {clean_q} projects.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+color+theory",
                    "tags": [clean_q.lower(), "color-theory", "composition", "illustration"],
                    "format": "4K Ultra HD",
                    "engagement": "97.2%"
                }
            ]
        elif platform == 'linkedin':
            return [
                {
                    "title": f"Lead Product Designer (UI/UX) - {title_q} & Digital Platforms",
                    "subtitle": "Figma / Airbnb Design Systems",
                    "metrics": {"location": "San Francisco, CA & New York, NY", "stat": "58 applicants", "compensation": "$160,000 - $225,000 / yr"},
                    "badge": "Actively Recruiting",
                    "type": "Design Leadership",
                    "snippet": f"Leading cross-functional design sprints, micro-interaction systems, and accessible design tokens centered on {clean_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+designer",
                    "tags": [clean_q.lower(), "ui-ux", "product-design", "figma"]
                },
                {
                    "title": f"Creative Director & Visual Brand Strategist - {title_q}",
                    "subtitle": "Pentagram / Ogilvy Creative",
                    "metrics": {"location": "London, UK (Hybrid)", "stat": "44 applicants", "compensation": "$150,000 - $210,000 / yr"},
                    "badge": "Top Match",
                    "type": "Creative Leadership",
                    "snippet": f"Overseeing global brand identities, visual style guides, campaign art direction, and digital presence for {clean_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+creative+director",
                    "tags": [clean_q.lower(), "creative-director", "branding", "art-direction"]
                },
                {
                    "title": f"Senior Concept Artist & Visual Development Specialist",
                    "subtitle": "Wētā Workshop / Blizzard Art Labs",
                    "metrics": {"location": "Vancouver, BC (Remote)", "stat": "32 applicants", "compensation": "$120,000 - $165,000 / yr"},
                    "badge": "New Listing",
                    "type": "Concept Art Role",
                    "snippet": f"Crafting high-fidelity mood paintings, character turnaround sheets, and environmental sketches for {clean_q} productions.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+concept+artist",
                    "tags": [clean_q.lower(), "concept-art", "visual-development", "illustration"]
                },
                {
                    "title": f"Elena Rostova - Principal Design Fellow & Keynote Speaker in {title_q}",
                    "subtitle": "Design Leaders Network / AIGA Fellow",
                    "metrics": {"location": "Berlin, DE & New York, NY", "stat": "24,800+ followers", "compensation": "Creative Advisory"},
                    "badge": "Industry Authority",
                    "type": "Professional Profile",
                    "snippet": f"Juror at Cannes Lions, author of 'The Art of Visual Systems', advising Fortune 100 brands on transformative design in {clean_q}.",
                    "url": f"https://www.linkedin.com/search/results/people/?keywords={q_kw}+design",
                    "tags": [clean_q.lower(), "thought-leadership", "design-fellow", "advisory"]
                }
            ]
        else: # Instagram
            return [
                {
                    "title": f"🎨 Extremely Satisfying Color Palette Transition for {title_q}",
                    "subtitle": "@colorpalette.daily (1.6M artists)",
                    "metrics": {"likes": "284.1k likes", "comments": "3,120 comments", "duration": "0:35"},
                    "badge": "Aesthetic Reel",
                    "snippet": f"Smooth swatch testing and color gradient blends that will inspire your next project featuring {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}/",
                    "tags": [f"#{q_tag}", "#colorpalette", "#satisfyingart", "#aesthetic"]
                },
                {
                    "title": f"✨ 3 Quick Typography Rules for Better {title_q} Layouts",
                    "subtitle": "@type.tips (640k designers)",
                    "metrics": {"likes": "112.5k likes", "comments": "1,450 comments", "duration": "0:45"},
                    "badge": "Design Tip",
                    "snippet": f"Kerning, leading, and contrast adjustments that instantly elevate your visual compositions in {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}design/",
                    "tags": [f"#{q_tag}", "#typography", "#graphicdesign", "#designtips"]
                },
                {
                    "title": f"🖌️ 60-Second Procreate Time-Lapse: Illustrating {title_q}",
                    "subtitle": "@digitalart.process (880k members)",
                    "metrics": {"likes": "194.8k likes", "comments": "2,240 comments", "duration": "0:58"},
                    "badge": "Time-Lapse",
                    "snippet": f"Layer-by-layer digital painting process demonstrating brush textures, lighting highlights, and depth for {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/procreateart/",
                    "tags": [f"#{q_tag}", "#procreate", "#timelapseart", "#digitalpainting"]
                },
                {
                    "title": f"Before vs After: Redesigning a Horrible {title_q} Graphic",
                    "subtitle": "@redesign.challenge (920k designers)",
                    "metrics": {"likes": "245.9k likes", "comments": "4,100 comments", "duration": "0:52"},
                    "badge": "Redesign Challenge",
                    "snippet": f"Taking a cluttered, messy visual and turning it into a sleek, award-winning minimalist artwork for {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/redesign/",
                    "tags": [f"#{q_tag}", "#redesign", "#minimalism", "#beforeandafter"]
                }
            ]

    # =========================================================================
    # 6. AUTOMOTIVE & VEHICLES
    # =========================================================================
    elif domain == 'automotive':
        if platform == 'youtube':
            return [
                {
                    "title": f"The Ultimate Review of {title_q}: 0-60 Speed, Track Test & Daily Driving",
                    "subtitle": "Throttle House & Top Gear",
                    "metrics": {"views": "2.4M views", "duration": "24m 30s", "published": "3 days ago", "rating": 4.96},
                    "badge": "Track Tested",
                    "snippet": f"Comprehensive real-world test drive evaluating throttle response, chassis rigidity, interior tech, and lap times for {clean_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+review",
                    "tags": [clean_q.lower(), "car-review", "track-test", "0-60", "exhaust-sound"],
                    "format": "4K Ultra HD",
                    "engagement": "98.1%"
                },
                {
                    "title": f"Insane Sound! {title_q} Pure Exhaust Revs, Launch Control & POV Drive",
                    "subtitle": "AutoTopNL & Carfection",
                    "metrics": {"views": "1.7M views", "duration": "16m 15s", "published": "1 week ago", "rating": 4.93},
                    "badge": "Pure Sound",
                    "snippet": f"Binaural audio recording capturing brutal acceleration, downshift pops, and high-RPM symphony in {clean_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+exhaust+sound",
                    "tags": [clean_q.lower(), "exhaust", "pov-drive", "launch-control"],
                    "format": "1080p60 Video",
                    "engagement": "97.4%"
                },
                {
                    "title": f"Engine Teardown & Mechanical Engineering Deep Dive: {title_q}",
                    "subtitle": "Engineering Explained & Hagerty",
                    "metrics": {"views": "920K views", "duration": "28m 40s", "published": "2 weeks ago", "rating": 4.91},
                    "badge": "Engineering Deep Dive",
                    "snippet": f"Analyzing turbocharger spool rates, suspension kinematics, thermal cooling circuits, and differential gearing inside {clean_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+engineering+explained",
                    "tags": [clean_q.lower(), "powertrain", "mechanical-engineering", "teardown"],
                    "format": "4K Ultra HD",
                    "engagement": "96.2%"
                },
                {
                    "title": f"Buying a {title_q}: Top 5 Known Issues & Maintenance Costs",
                    "subtitle": "Car Wizard & Doug DeMuro",
                    "metrics": {"views": "680K views", "duration": "19m 50s", "published": "5 days ago", "rating": 4.88},
                    "badge": "Buyer's Guide",
                    "snippet": f"Essential inspection checklist, common failure points, annual service costs, and depreciation curve for {clean_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+buyers+guide",
                    "tags": [clean_q.lower(), "buyers-guide", "maintenance", "reliability"],
                    "format": "1080p60 Video",
                    "engagement": "95.1%"
                }
            ]
        elif platform == 'linkedin':
            return [
                {
                    "title": f"Lead Automotive Powertrain & EV Systems Engineer - {title_q}",
                    "subtitle": "Porsche AG / Lucid Motors",
                    "metrics": {"location": "Stuttgart, DE & Detroit, MI", "stat": "49 applicants", "compensation": "$155,000 - $215,000 / yr"},
                    "badge": "Actively Recruiting",
                    "type": "Automotive Engineering",
                    "snippet": f"Developing high-voltage inverter architectures, torque vectoring algorithms, and dynamic chassis control for {clean_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+automotive+engineer",
                    "tags": [clean_q.lower(), "automotive-engineering", "powertrain", "ev-systems"]
                },
                {
                    "title": f"Director of Vehicle Dynamics & Track Calibration",
                    "subtitle": "Ferrari Competizioni / McLaren Automotive",
                    "metrics": {"location": "Modena, IT & Silverstone, UK", "stat": "34 applicants", "compensation": "$175,000 - $240,000 / yr"},
                    "badge": "Top Match",
                    "type": "Performance Engineering",
                    "snippet": f"Overseeing Nürburgring lap time validation, active aerodynamic wing adjustments, and damper tuning for high-performance {clean_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+vehicle+dynamics",
                    "tags": [clean_q.lower(), "vehicle-dynamics", "aerodynamics", "motorsport"]
                },
                {
                    "title": f"Global Automotive Supply Chain & Assembly Operations Lead",
                    "subtitle": "BMW Group / Mercedes-Benz AG",
                    "metrics": {"location": "Munich, DE (On-site)", "stat": "62 applicants", "compensation": "$140,000 - $185,000 / yr"},
                    "badge": "Operations Role",
                    "type": "Supply Chain Leadership",
                    "snippet": f"Managing tier-1 supplier quality, stamping tolerances, and just-in-sequence assembly lines for {clean_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+supply+chain",
                    "tags": [clean_q.lower(), "automotive-operations", "manufacturing", "supply-chain"]
                },
                {
                    "title": f"Dr. Christian Weber - Fellow in Sustainable Mobility & Automotive Propulsion",
                    "subtitle": "VDA Automotive Council / SAE International",
                    "metrics": {"location": "Frankfurt, DE", "stat": "19,200+ followers", "compensation": "Executive Advisory"},
                    "badge": "Industry Authority",
                    "type": "Professional Profile",
                    "snippet": f"Advising EU transportation ministries and automotive OEMs on regulatory compliance, battery chemistry, and future drivetrains in {clean_q}.",
                    "url": f"https://www.linkedin.com/search/results/people/?keywords={q_kw}+automotive",
                    "tags": [clean_q.lower(), "automotive-fellow", "clean-tech", "advisory"]
                }
            ]
        else: # Instagram
            return [
                {
                    "title": f"🔊 Cold Start & High-RPM Revs of {title_q}! That Exhaust Tone!",
                    "subtitle": "@supercar.blondie (4.5M gearheads)",
                    "metrics": {"likes": "540.2k likes", "comments": "8,120 comments", "duration": "0:25"},
                    "badge": "Viral Cold Start",
                    "snippet": f"Turn your volume up! The aggressive cold start roar and idle rumble of this stunning {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}/",
                    "tags": [f"#{q_tag}", "#coldstart", "#supercars", "#exhaustsound", "#carporn"]
                },
                {
                    "title": f"✨ Satisfying Ceramic Coating & Detailing ASMR on {title_q}",
                    "subtitle": "@detailing.asmr (1.2M fans)",
                    "metrics": {"likes": "310.8k likes", "comments": "4,190 comments", "duration": "0:45"},
                    "badge": "Detailing ASMR",
                    "snippet": f"Foam cannon bath, clay bar decontamination, and hydrophobic ceramic sealant application on {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/cardetailing/",
                    "tags": [f"#{q_tag}", "#detailing", "#asmr", "#paintcorrection"]
                },
                {
                    "title": f"🏎️ 0-100 km/h Launch Control Acceleration in {title_q}",
                    "subtitle": "@acceleration.hub (840k fans)",
                    "metrics": {"likes": "194.2k likes", "comments": "2,450 comments", "duration": "0:18"},
                    "badge": "Launch Control",
                    "snippet": f"Pinned to the seat! Violent all-wheel-drive grip and lightning-fast dual-clutch upshifts in {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/launchcontrol/",
                    "tags": [f"#{q_tag}", "#launchcontrol", "#acceleration", "#dragrace"]
                },
                {
                    "title": f"POV Sunset Cruise in {title_q}: Pure Cinematic Driving Vibe",
                    "subtitle": "@midnight.runners (1.1M drivers)",
                    "metrics": {"likes": "265.4k likes", "comments": "3,110 comments", "duration": "0:40"},
                    "badge": "Cinematic Drive",
                    "snippet": f"Open mountain roads, sunset reflections across the hood, and smooth acoustic soundtrack cruising in {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/nightdrive/",
                    "tags": [f"#{q_tag}", "#sunsetcruise", "#carlifestyle", "#aestheticdrive"]
                }
            ]

    # =========================================================================
    # 7. GENERAL KNOWLEDGE / DEFAULT (INTELLIGENT & CONTEXTUAL)
    # =========================================================================
    else:
        main_snippet = (
            f"{abstract[:240]}..."
            if len(abstract) > 40
            else f"An in-depth look exploring the history, essential principles, real-world applications, and insights surrounding {clean_q}."
        )
        if platform == 'youtube':
            return [
                {
                    "title": f"{title_q}: Everything You Need to Know (Complete Guide & History)",
                    "subtitle": "Knowledge Hub & Discovery Media",
                    "metrics": {"views": "1.3M views", "duration": "24m 15s", "published": "5 days ago", "rating": 4.93},
                    "badge": "Complete Overview",
                    "snippet": main_snippet,
                    "url": f"https://www.youtube.com/results?search_query={q_url}+overview",
                    "tags": [clean_q.lower(), "overview", "documentary", "explained"],
                    "format": "1080p60 Video",
                    "engagement": "96.4%"
                },
                {
                    "title": f"The Real Story & Evolution of {title_q}: In-Depth Analysis",
                    "subtitle": "Deep Dive Insights & Vox Docs",
                    "metrics": {"views": "780K views", "duration": "21m 40s", "published": "2 weeks ago", "rating": 4.90},
                    "badge": "Documentary",
                    "snippet": f"Investigating the historical background, core mechanisms, and real-world impact of {clean_q} through expert analysis.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+documentary",
                    "tags": [clean_q.lower(), "history", "deep-dive", "analysis"],
                    "format": "4K Ultra HD",
                    "engagement": "95.1%"
                },
                {
                    "title": f"Top 10 Most Fascinating Things You Should Know About {title_q}",
                    "subtitle": "Curiosity Stream & Global Perspectives",
                    "metrics": {"views": "640K views", "duration": "16m 50s", "published": "1 week ago", "rating": 4.88},
                    "badge": "Top 10 Insights",
                    "snippet": f"Uncovering surprising facts, practical takeaways, and expert perspectives centered on {clean_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+facts",
                    "tags": [clean_q.lower(), "facts", "essentials", "insights"],
                    "format": "1080p60 Video",
                    "engagement": "94.5%"
                },
                {
                    "title": f"How {title_q} Works in the Modern World: Case Studies & Examples",
                    "subtitle": "Frontiers of Understanding",
                    "metrics": {"views": "520K views", "duration": "19m 10s", "published": "3 weeks ago", "rating": 4.86},
                    "badge": "Real-World Study",
                    "snippet": f"Practical demonstrations and case studies showcasing current developments and future trends in {clean_q}.",
                    "url": f"https://www.youtube.com/results?search_query={q_url}+explained",
                    "tags": [clean_q.lower(), "case-study", "modern-world", "trends"],
                    "format": "4K Ultra HD",
                    "engagement": "93.8%"
                }
            ]
        elif platform == 'linkedin':
            return [
                {
                    "title": f"{title_q} Industry Specialist & Research Lead",
                    "subtitle": "Global Research & Market Insights",
                    "metrics": {"location": "San Francisco, CA & New York, NY", "stat": "52 applicants", "compensation": "$135,000 - $185,000 / yr"},
                    "badge": "Actively Recruiting",
                    "type": "Specialist Role",
                    "snippet": f"Conducting market research, competitive analysis, and strategic development projects focused on {clean_q} initiatives.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+specialist",
                    "tags": [clean_q.lower(), "research", "market-analysis", "specialist"]
                },
                {
                    "title": f"Program Director & Operations Specialist - {title_q}",
                    "subtitle": "Applied Innovation Network",
                    "metrics": {"location": "Austin, TX (Remote)", "stat": "41 applicants", "compensation": "$140,000 - $190,000 / yr"},
                    "badge": "Top Match",
                    "type": "Operational Role",
                    "snippet": f"Spearheading project milestones, quality assurance, cross-functional collaboration, and operational workflows for {clean_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+manager",
                    "tags": [clean_q.lower(), "operations", "project-management", "strategy"]
                },
                {
                    "title": f"Senior Subject Matter Expert & Research Fellow in {title_q}",
                    "subtitle": "Academic & Industrial Policy Council",
                    "metrics": {"location": "London, UK & Boston, MA", "stat": "14,800+ followers", "compensation": "Advisory & Research"},
                    "badge": "Thought Leader",
                    "type": "Professional Profile",
                    "snippet": f"Author of industry reports and advisory briefs guiding organizations and researchers on emerging developments in {clean_q}.",
                    "url": f"https://www.linkedin.com/search/results/people/?keywords={q_kw}+expert",
                    "tags": [clean_q.lower(), "research", "fellow", "expert"]
                },
                {
                    "title": f"Market Analyst & Strategic Communications Lead - {title_q}",
                    "subtitle": "Global Strategic Advisory",
                    "metrics": {"location": "Seattle, WA (Hybrid)", "stat": "34 applicants", "compensation": "$115,000 - $155,000 / yr"},
                    "badge": "Hot Opportunity",
                    "type": "Strategic Role",
                    "snippet": f"Tracking consumer trends, market adoption, regulatory updates, and strategic outreach initiatives centered on {clean_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+analyst",
                    "tags": [clean_q.lower(), "market-trends", "communications", "analyst"]
                }
            ]
        else: # Instagram
            return [
                {
                    "title": f"🔥 3 Fascinating Facts You Never Knew About {title_q}!",
                    "subtitle": "@insight.daily (520k followers)",
                    "metrics": {"likes": "112.4k likes", "comments": "1,980 comments", "duration": "0:45"},
                    "badge": "Viral Reel",
                    "snippet": f"Quick 45-second visual breakdown busting the biggest misconceptions and exploring amazing facts about {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}/",
                    "tags": [f"#{q_tag}", "#didyouknow", "#quickfacts", "#learnsomethingnew"]
                },
                {
                    "title": f"⚡ Quick 60-Second Visual Guide to {title_q}",
                    "subtitle": "@simplified.knowledge (380k members)",
                    "metrics": {"likes": "78.9k likes", "comments": "940 comments", "duration": "0:59"},
                    "badge": "Infographic Reel",
                    "snippet": f"Clear and engaging infographic animation explaining how {clean_q} works in under a minute.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}guide/",
                    "tags": [f"#{q_tag}", "#visualguide", "#curiosity", "#education"]
                },
                {
                    "title": f"The Evolution of {title_q} Over Time: Visual Comparison",
                    "subtitle": "@history.in.visuals (490k fans)",
                    "metrics": {"likes": "96.3k likes", "comments": "1,420 comments", "duration": "0:42"},
                    "badge": "Evolution Pick",
                    "snippet": f"Side-by-side historical comparison showing how {clean_q} transformed across different eras.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}history/",
                    "tags": [f"#{q_tag}", "#evolution", "#timeline", "#vintage"]
                },
                {
                    "title": f"Top Aesthetic Perspectives on {title_q} You'll Love",
                    "subtitle": "@daily.perspectives (270k aesthetics)",
                    "metrics": {"likes": "64.2k likes", "comments": "720 comments", "duration": "0:38"},
                    "badge": "Aesthetic Reel",
                    "snippet": f"Cinematic 4K visuals, relaxing soundtrack, and atmospheric lighting exploring the beauty of {clean_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}aesthetic/",
                    "tags": [f"#{q_tag}", "#aesthetic", "#cinematic", "#visuals"]
                }
            ]


def get_multipage_templates(
    domain: str,
    clean_q: str,
    title_q: str,
    platform: str,
    page: int,
    entity_info: Optional[Dict[str, Any]] = None
) -> List[Dict[str, Any]]:
    """Generates continuous streaming / infinite scroll items tailored to domain."""
    title_q = resolve_clean_concept_title(domain, clean_q, title_q, entity_info)
    q_url = clean_q.replace(' ', '+')
    q_tag = clean_q.replace(' ', '').lower()
    q_kw = clean_q.replace(' ', '%20')
    p_idx = page

    # Domain: Animation & Cartoons Multipage
    if domain == 'animation_cartoons':
        if platform == 'youtube':
            if page == 2:
                return [
                    {
                        "title": f"{title_q}: Unreleased Deleted Scenes & Hilarious Animation Bloopers",
                        "subtitle": f"{title_q} Studio Vault",
                        "metrics": {"views": "1.8M views", "duration": "14m 20s", "published": "5 days ago", "rating": 4.95},
                        "badge": "Deleted Scenes",
                        "snippet": f"Rare deleted scenes, gag reels, and storyboard animatics that never made the final television broadcast of {title_q}.",
                        "url": f"https://www.youtube.com/results?search_query={q_url}+deleted+scenes",
                        "tags": [clean_q.lower(), "deleted-scenes", "bloopers", "cartoons"],
                        "format": "1080p60 Video",
                        "engagement": "98.2%"
                    },
                    {
                        "title": f"The Voice Actors Behind {title_q}: Live Dubbing & Studio Secrets",
                        "subtitle": "Voice Actors Guild & Dubbing Labs",
                        "metrics": {"views": "940K views", "duration": "22m 10s", "published": "1 week ago", "rating": 4.91},
                        "badge": "Voice Cast",
                        "snippet": f"See the legendary voice talents improvising hysterical screams, laughter, and iconic character voices for {title_q}.",
                        "url": f"https://www.youtube.com/results?search_query={q_url}+voice+actors",
                        "tags": [clean_q.lower(), "voice-actors", "studio-dubbing", "comedy"],
                        "format": "4K Ultra HD",
                        "engagement": "96.8%"
                    },
                    {
                        "title": f"{title_q} Evolution: Season 1 (1990s) vs Modern High-Def Episodes",
                        "subtitle": "Animation Retrospective",
                        "metrics": {"views": "1.4M views", "duration": "18m 45s", "published": "2 weeks ago", "rating": 4.93},
                        "badge": "Animation Evolution",
                        "snippet": f"Side-by-side comparison of art styles, frame rates, color palettes, and sound quality across eras of {title_q}.",
                        "url": f"https://www.youtube.com/results?search_query={q_url}+evolution",
                        "tags": [clean_q.lower(), "evolution", "comparison", "animation-history"],
                        "format": "1080p60 Video",
                        "engagement": "97.4%"
                    },
                    {
                        "title": f"10 Dark & Funny Fan Theories About {title_q} That Actually Make Sense",
                        "subtitle": "Toon Mysteries & Film Theory",
                        "metrics": {"views": "820K views", "duration": "15m 30s", "published": "3 weeks ago", "rating": 4.88},
                        "badge": "Fan Theories",
                        "snippet": f"Did the creators leave secret lore clues? Exploring the wild, hilarious, and creative fan theories surrounding {title_q}.",
                        "url": f"https://www.youtube.com/results?search_query={q_url}+fan+theories",
                        "tags": [clean_q.lower(), "theories", "hidden-lore", "cartoon-mystery"],
                        "format": "1080p60 Video",
                        "engagement": "95.6%"
                    }
                ]
            else: # page >= 3
                return [
                    {
                        "title": f"{title_q} Complete Non-Stop Slapstick Chase Marathon (Vol. {p_idx})",
                        "subtitle": f"Cartoon Network / Global Animation Stream",
                        "metrics": {"views": f"{950 + p_idx * 20}K views", "duration": "1h 15m", "published": f"{p_idx} days ago", "rating": 4.96},
                        "badge": f"Vol. {p_idx} Marathon",
                        "snippet": f"Continuous back-to-back funny chases, wild pranks, and high-energy cartoon entertainment featuring {title_q}.",
                        "url": f"https://www.youtube.com/results?search_query={q_url}+marathon+{p_idx}",
                        "tags": [clean_q.lower(), f"marathon-{p_idx}", "funny", "slapstick"],
                        "format": "1080p60 Video",
                        "engagement": "97.9%"
                    },
                    {
                        "title": f"Foley Sound Art: How the Wild Sound Effects in {title_q} Were Created",
                        "subtitle": "Audio Masters & Sound Labs",
                        "metrics": {"views": f"{620 + p_idx * 15}K views", "duration": "24m 10s", "published": "2 weeks ago", "rating": 4.92},
                        "badge": "Sound Design",
                        "snippet": f"Foley artists revealing the kitchen pots, whistles, spring coils, and rubber bands used to create sounds for {title_q}.",
                        "url": f"https://www.youtube.com/results?search_query={q_url}+foley+sound",
                        "tags": [clean_q.lower(), "foley", "sound-effects", "audio-engineering"],
                        "format": "4K Ultra HD",
                        "engagement": "96.4%"
                    },
                    {
                        "title": f"Why {title_q} Is a Masterpiece of International Silent Comedy",
                        "subtitle": "The Art of Visual Humor",
                        "metrics": {"views": f"{480 + p_idx * 10}K views", "duration": "19m 25s", "published": "3 weeks ago", "rating": 4.90},
                        "badge": "Critical Study",
                        "snippet": f"How universal visual pantomime allowed {title_q} to become a global phenomenon broadcast in over 190 countries.",
                        "url": f"https://www.youtube.com/results?search_query={q_url}+documentary",
                        "tags": [clean_q.lower(), "film-study", "silent-comedy", "global-reach"],
                        "format": "1080p60 Video",
                        "engagement": "95.8%"
                    },
                    {
                        "title": f"{title_q} Season Finale Review & Iconic Ending Ranked",
                        "subtitle": "Nostalgia Archives",
                        "metrics": {"views": f"{390 + p_idx * 12}K views", "duration": "16m 50s", "published": "1 month ago", "rating": 4.87},
                        "badge": "Finale Review",
                        "snippet": f"Revisiting the chaotic, unforgettable season climaxes and special holiday episodes from {title_q}.",
                        "url": f"https://www.youtube.com/results?search_query={q_url}+season+finale",
                        "tags": [clean_q.lower(), "season-finale", "review", "holiday-special"],
                        "format": "1080p60 Video",
                        "engagement": "94.5%"
                    }
                ]
        elif platform == 'linkedin':
            return [
                {
                    "title": f"Animation Rigging & Pipeline Technical Director - {title_q} Media",
                    "subtitle": f"Creative Studios Tier {p_idx}",
                    "metrics": {"location": "Burbank, CA & Montreal, QC", "stat": "28 applicants", "compensation": "$135,000 - $180,000 / yr"},
                    "badge": f"Tier {p_idx} Opportunity",
                    "type": "Technical Director",
                    "snippet": f"Building Python DCC plugins, facial rig libraries, and automated rendering pipelines for episodic animation series like {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+rigging",
                    "tags": [clean_q.lower(), "rigging", "pipeline-td", "animation"]
                },
                {
                    "title": f"Background Matte Painter & Visual Stylist - Cartoon Media",
                    "subtitle": "Animation Production Network",
                    "metrics": {"location": "London, UK (Remote)", "stat": "34 applicants", "compensation": "$95,000 - $130,000 / yr"},
                    "badge": "Top Match",
                    "type": "Visual Development",
                    "snippet": f"Painting vibrant backgrounds, atmospheric perspective, and color keys for animated shows inspired by {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+matte+painter",
                    "tags": [clean_q.lower(), "background-painter", "matte-painting", "animation"]
                },
                {
                    "title": f"Global Animation Licensing & Merchandising Brand Manager",
                    "subtitle": "Consumer Products & Entertainment Group",
                    "metrics": {"location": "New York, NY & Paris, FR", "stat": "21 applicants", "compensation": "$120,000 - $165,000 / yr"},
                    "badge": "Executive Role",
                    "type": "Brand Strategy",
                    "snippet": f"Leading toy licensing, gaming crossover partnerships, and broadcast syndication for multi-generational cartoon IP like {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+merchandising",
                    "tags": [clean_q.lower(), "licensing", "brand-management", "merchandising"]
                },
                {
                    "title": f"Senior 2D Clean-Up & Inbetweening Animator - Series Production",
                    "subtitle": "Animation Guild Studios",
                    "metrics": {"location": "Dublin, IE & Austin, TX", "stat": "19 applicants", "compensation": "$85,000 - $115,000 / yr"},
                    "badge": "Studio Pick",
                    "type": "Animator Role",
                    "snippet": f"Refining rough keyframes, maintaining strict model sheet proportions, and ensuring smooth fluidity for animated properties like {title_q}.",
                    "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+inbetweening",
                    "tags": [clean_q.lower(), "inbetweening", "2d-animator", "clean-up"]
                }
            ]
        else: # Instagram
            return [
                {
                    "title": f"😂 When the sound effects in {title_q} hit way too hard (Part {p_idx})",
                    "subtitle": f"@cartoon.laughs (1.5M fans)",
                    "metrics": {"likes": f"{140 + p_idx * 15}k likes", "comments": "2,840 comments", "duration": "0:30"},
                    "badge": f"Part {p_idx} Highlight",
                    "snippet": f"Rewatching the funniest sound effect drop in {title_q} that lives rent-free in everyone's memory.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}/",
                    "tags": [f"#{q_tag}", "#cartoonaudio", "#funnyreels", "#nostalgia"]
                },
                {
                    "title": f"📺 Recreating {title_q} on a Vintage 90s CRT Television",
                    "subtitle": "@retro.tech.vibes (680k fans)",
                    "metrics": {"likes": f"{110 + p_idx * 10}k likes", "comments": "1,940 comments", "duration": "0:45"},
                    "badge": "Retro Aesthetic",
                    "snippet": f"The nostalgic glow, scanlines, and authentic warmth of watching {title_q} on an old-school cathode ray tube TV.",
                    "url": f"https://www.instagram.com/explore/tags/crttv/",
                    "tags": [f"#{q_tag}", "#crt", "#retrogaming", "#90saesthetic"]
                },
                {
                    "title": f"Top 5 Facial Expressions in {title_q} That Will Forever Be Iconic",
                    "subtitle": "@daily.toons.reels (420k fans)",
                    "metrics": {"likes": f"{95 + p_idx * 8}k likes", "comments": "1,420 comments", "duration": "0:38"},
                    "badge": "Iconic Faces",
                    "snippet": f"Pure comedic gold! The exaggerated shock, mischief, and panic faces from {title_q}.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}expressions/",
                    "tags": [f"#{q_tag}", "#funnyfaces", "#cartoons", "#comedytiming"]
                },
                {
                    "title": f"Cosplay Transformation: Bringing {title_q} Into Real Life!",
                    "subtitle": "@cosplay.creators (810k fans)",
                    "metrics": {"likes": f"{130 + p_idx * 12}k likes", "comments": "2,150 comments", "duration": "0:50"},
                    "badge": "Cosplay Reel",
                    "snippet": f"Creative DIY costume build and makeup transformation bringing the beloved characters of {title_q} to life.",
                    "url": f"https://www.instagram.com/explore/tags/{q_tag}cosplay/",
                    "tags": [f"#{q_tag}", "#cosplay", "#diycostume", "#transformation"]
                }
            ]

    # Domain: Movies / Gaming / General Continuous Multipage
    if platform == 'youtube':
        return [
            {
                "title": f"{title_q} Masterclass Part {p_idx}: Real-World Insights & Deep Dive",
                "subtitle": f"Global Knowledge Network / Tier {p_idx}",
                "metrics": {"views": f"{520 + p_idx * 20}K views", "duration": "28m 40s", "published": f"{p_idx} days ago", "rating": 4.93},
                "badge": f"Part {p_idx} Deep Dive",
                "snippet": f"Continuing the comprehensive study of {clean_q}. Practical demonstrations, historical archives, and expert interviews.",
                "url": f"https://www.youtube.com/results?search_query={q_url}+part+{p_idx}",
                "tags": [clean_q.lower(), f"part-{p_idx}", "deep-dive", "insights"],
                "format": "4K Ultra HD",
                "engagement": "96.5%"
            },
            {
                "title": f"Top 5 Hidden Traps & Misconceptions in {title_q} Explained",
                "subtitle": "Critical Analysis & Investigation Hub",
                "metrics": {"views": f"{410 + p_idx * 15}K views", "duration": "19m 20s", "published": "2 weeks ago", "rating": 4.90},
                "badge": "Analysis",
                "snippet": f"Uncovering subtle oversights, common misunderstandings, and nuanced realities surrounding {clean_q}.",
                "url": f"https://www.youtube.com/results?search_query={q_url}+misconceptions",
                "tags": [clean_q.lower(), "analysis", "investigation", "facts"],
                "format": "1080p60 Video",
                "engagement": "95.2%"
            },
            {
                "title": f"The Evolution & Future Trajectory of {title_q} (2026 and Beyond)",
                "subtitle": "Future Horizon Collective",
                "metrics": {"views": f"{610 + p_idx * 18}K views", "duration": "25m 10s", "published": "3 weeks ago", "rating": 4.92},
                "badge": "Future Outlook",
                "snippet": f"Examining emerging trends, regulatory dynamics, technological breakthroughs, and future opportunities in {clean_q}.",
                "url": f"https://www.youtube.com/results?search_query={q_url}+future+trends",
                "tags": [clean_q.lower(), "future", "trends", "2026"],
                "format": "4K Ultra HD",
                "engagement": "96.8%"
            },
            {
                "title": f"Global Perspectives: How Different Cultures Approach {title_q}",
                "subtitle": "International Studies & World Docs",
                "metrics": {"views": f"{340 + p_idx * 10}K views", "duration": "22m 15s", "published": "1 month ago", "rating": 4.88},
                "badge": "Global Study",
                "snippet": f"Cross-cultural analysis showing how diverse societies and industries engage with {clean_q} around the globe.",
                "url": f"https://www.youtube.com/results?search_query={q_url}+global+perspectives",
                "tags": [clean_q.lower(), "global", "international", "culture"],
                "format": "1080p60 Video",
                "engagement": "94.6%"
            }
        ]
    elif platform == 'linkedin':
        return [
            {
                "title": f"Senior Program Director & Strategic Lead - {title_q}",
                "subtitle": f"Global Enterprise Advisory / Tier {p_idx}",
                "metrics": {"location": "San Francisco, CA & London, UK", "stat": f"{30 + p_idx * 3} applicants", "compensation": "$160,000 - $220,000 / yr"},
                "badge": f"Tier {p_idx} Role",
                "type": "Leadership Position",
                "snippet": f"Spearheading cross-functional initiatives, stakeholder alignment, and operational excellence centered on {clean_q}.",
                "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+director",
                "tags": [clean_q.lower(), "leadership", "program-director", "operations"]
            },
            {
                "title": f"Research Fellow & Domain Authority in {title_q}",
                "subtitle": "Applied Research Institute",
                "metrics": {"location": "Boston, MA (Hybrid)", "stat": f"{20 + p_idx * 2} applicants", "compensation": "$140,000 - $185,000 / yr"},
                "badge": "Top Match",
                "type": "Research Fellowship",
                "snippet": f"Authoring foundational studies, publishing strategic benchmarks, and directing multidisciplinary investigations into {clean_q}.",
                "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+research",
                "tags": [clean_q.lower(), "research", "fellow", "whitepapers"]
            },
            {
                "title": f"Operations & Quality Assurance Lead - {title_q}",
                "subtitle": "Premier Solutions Network",
                "metrics": {"location": "Seattle, WA (Remote)", "stat": f"{25 + p_idx * 2} applicants", "compensation": "$125,000 - $165,000 / yr"},
                "badge": "Hot Opportunity",
                "type": "Operational Role",
                "snippet": f"Ensuring governance, regulatory standards, high reliability, and continuous process optimization across {clean_q}.",
                "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+operations",
                "tags": [clean_q.lower(), "quality-assurance", "operations", "governance"]
            },
            {
                "title": f"Strategy Consultant & Strategic Transformation Advisor in {title_q}",
                "subtitle": "Enterprise Advisory Services",
                "metrics": {"location": "New York, NY", "stat": f"{18 + p_idx * 2} applicants", "compensation": "$150,000 - $200,000 / yr"},
                "badge": "Specialist Pick",
                "type": "Advisory Role",
                "snippet": f"Advising executive leadership on roadmap execution, operational efficiency, and emerging market dynamics in {clean_q}.",
                "url": f"https://www.linkedin.com/jobs/search/?keywords={q_kw}+consultant",
                "tags": [clean_q.lower(), "strategy", "advisory", "transformation"]
            }
        ]
    else: # Instagram
        return [
            {
                "title": f"🔥 3 Things Everyone Gets Wrong About {title_q}! (Part {p_idx})",
                "subtitle": "@insight.daily (520k followers)",
                "metrics": {"likes": f"{90 + p_idx * 10}k likes", "comments": "1,840 comments", "duration": "0:45"},
                "badge": f"Part {p_idx} Reel",
                "snippet": f"Quick 45-second visual breakdown busting the biggest misconceptions and showing practical takeaways for {clean_q}.",
                "url": f"https://www.instagram.com/explore/tags/{q_tag}/",
                "tags": [f"#{q_tag}", "#didyouknow", "#learnsomethingnew", "#quicktips"]
            },
            {
                "title": f"⚡ Quick 60-Second Visual Guide to {title_q}",
                "subtitle": "@simplified.knowledge (380k members)",
                "metrics": {"likes": f"{70 + p_idx * 8}k likes", "comments": "940 comments", "duration": "0:58"},
                "badge": "Infographic",
                "snippet": f"Engaging and aesthetic animation explaining key concepts of {clean_q} simply and elegantly.",
                "url": f"https://www.instagram.com/explore/tags/{q_tag}guide/",
                "tags": [f"#{q_tag}", "#visualguide", "#curiosity", "#education"]
            },
            {
                "title": f"The Most Inspiring Perspectives on {title_q}",
                "subtitle": "@curiosity.decoded (410k followers)",
                "metrics": {"likes": f"{85 + p_idx * 9}k likes", "comments": "1,220 comments", "duration": "0:40"},
                "badge": "Curiosity Reel",
                "snippet": f"Fascinating historical facts and intriguing discoveries behind {clean_q} that will spark your curiosity.",
                "url": f"https://www.instagram.com/explore/tags/{q_tag}facts/",
                "tags": [f"#{q_tag}", "#inspiration", "#perspectives", "#insights"]
            },
            {
                "title": f"Aesthetic Visual Journey Exploring {title_q}",
                "subtitle": "@clean.setups (380k aesthetics)",
                "metrics": {"likes": f"{60 + p_idx * 7}k likes", "comments": "810 comments", "duration": "0:35"},
                "badge": "Aesthetic Pick",
                "snippet": f"Clean lines, ambient cinematography, and refined styling demonstrating the cultural footprint of {clean_q}.",
                "url": f"https://www.instagram.com/explore/tags/cleansetup/",
                "tags": [f"#{q_tag}", "#aestheticlife", "#cinematography", "#visualart"]
            }
        ]
