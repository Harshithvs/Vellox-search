# AIOps Search Engine & Content Intelligence Platform

A high-performance federated search engine and content intelligence platform featuring a **Deterministic $O(L)$ In-Memory Prefix Trie** with **3x History Scoring**, and a concurrent **Federated Search Engine** aggregating live intelligence across **YouTube**, **LinkedIn**, and **Instagram**.

---

## 🏛️ System Architecture

```
[ User Query / Keystrokes ]
            │
            ▼ (250ms debounced)
   [ React 19 Frontend ]
     ├── Autocomplete Engine ────▶ GET /api/suggest?q=... ────▶ [ Prefix Trie O(L) ] (1-3ms)
     │                                                           - 3x History Multiplier
     │                                                           - Subtree DFS collection
     └── Federated Dispatch   ────▶ GET /api/search?q=...  ────▶ [ FastAPI Backend ]
                                                                 │
                                          ┌──────────────────────┼──────────────────────┐
                                          ▼                      ▼                      ▼
                                   [ YouTube Node ]      [ LinkedIn Node ]     [ Instagram Node ]
                                   (Video Masterclass)   (Jobs & Profiles)     (Dev Reels & Tags)
                                          │                      │                      │
                                          └──────────────────────┼──────────────────────┘
                                                                 ▼
                                                        [ asyncio.gather ]
                                                                 ▼
                                                   [ Unified Ranked Results ]
                                                   (Sorted by Relevance Score)
                                                                 │
                                                                 ▼
                                                    [ Live Inspector Panel ]
```

---

## 🚀 Key Features

1. **Deterministic $O(L)$ In-Memory Prefix Trie (`backend/trie.py`)**:
   - Traversal speed depends strictly on prefix length $L$, unaffected by dataset size.
   - **Strict Empty/Non-match handling**: Returns `[]` immediately if prefix is blank or unmatched (no static fallback lists).
   - **3x History Weight Multiplier**: Historical searches dynamically outrank global items even when global frequency is higher.

2. **Parallel Federated Search (`backend/federated.py`)**:
   - Concurrently dispatches requests across 3 supported platforms using Python's `asyncio.gather`.
   - Normalizes metadata into unified intelligence cards with platform-specific metrics.
   - Per-platform execution telemetry and overall latency tracking.

3. **Enterprise Privacy Policy**:
   - Strictly queries public indexes and developer resources.
   - **WhatsApp is strictly omitted** to respect end-to-end encryption and zero-telemetry constraints.

4. **Modern Responsive UI (`frontend/`)**:
   - Built with **React 19**, **Vite**, and **Tailwind CSS**.
   - Google-style search bar elevation and micro-interactions.
   - Platform-specific glowing halos (YouTube Red, LinkedIn Blue, Instagram Pink).
   - Live **Content Intelligence Inspector** sticky panel displaying payload telemetry, progress bars, and raw JSON.
   - Full dark/light theme switching.

---

## 📂 Project Structure

```
Search Engine Project/
├── backend/
│   ├── main.py                  # FastAPI server with CORS, routing, and history logging
│   ├── trie.py                  # High-performance TrieNode and PrefixTrie implementation
│   ├── federated.py             # Parallel async queries across YouTube, LinkedIn, Instagram
│   ├── seed_data.py             # Pre-seeded tech terms, history entries, and categories
│   └── test_search_engine.py    # Pytest test suite for Trie, Federated API, and Endpoints
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx               # Header with branding and theme toggler
│   │   │   ├── SearchDashboard.jsx      # Search input with 250ms debouncing and filters
│   │   │   ├── SuggestionDropdown.jsx   # Prefix highlighter and latency telemetry
│   │   │   ├── FederatedResultsGrid.jsx # Unified and per-platform tabs with Inspector
│   │   │   ├── ResultCard.jsx           # Platform cards with glowing halos and actions
│   │   │   ├── ContentInspector.jsx     # Side inspector panel with real-time stats
│   │   │   └── PlatformIcons.jsx        # SVG icons for YouTube, LinkedIn, Instagram
│   │   ├── App.jsx                      # Main application orchestrator
│   │   ├── index.css                    # Tailwind directives and custom halo animations
│   │   └── main.jsx                     # React DOM entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Python**: 3.10+ (tested on Python 3.12)
- **Node.js**: 18+ (tested on Node v24)

### 2. Backend Setup & Run

Navigate to the workspace root:

```bash
# Run FastAPI server on port 8000
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

Interactive API documentation will be available at:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

### 3. Frontend Setup & Run

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173/`.

### 4. Running Tests & Quality Checks

Run the backend test suite:
```bash
python -m pytest backend/test_search_engine.py -v
```

Run frontend linting & production build:
```bash
cd frontend
npm run lint
npm run build
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check, active platforms, and Trie node statistics |
| `GET` | `/api/context` | Returns active cross-platform context (e.g. YouTube search for 'phone') |
| `POST` | `/api/activity` | Syncs external activity, injects topic keywords into Trie with 3x History Weight |
| `DELETE` | `/api/context` | Clears external activity context back to neutral state |
| `GET` | `/api/recommendations` | Personalized keyword recommendations and quick pills for active topic |
| `GET` | `/api/suggest?q={prefix}` | Autocomplete suggestions with deterministic O(L) Trie traversal |
| `GET` | `/api/search?q={query}&platform={filter}` | Federated parallel search (`all`, `youtube`, `linkedin`, `instagram`) |
| `POST` | `/api/history` | Dynamically record/promote query with 3x history weight |

---

## 🔒 Privacy & Compliance

This platform enforces a strict data privacy perimeter:
- Direct index queries only against verified public developer feeds and educational platforms.
- **WhatsApp, private messaging networks, and personal chat data are intentionally and permanently excluded.**
