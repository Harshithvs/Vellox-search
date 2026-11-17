import time
from typing import List, Dict, Any, Optional

class TrieNode:
    def __init__(self):
        self.children: Dict[str, 'TrieNode'] = {}
        self.is_terminal: bool = False
        self.phrase: Optional[str] = None
        self.frequency: int = 1
        self.source: str = "global"  # 'global' or 'history'
        self.category: str = "general"

class PrefixTrie:
    """
    High-performance in-memory Prefix Trie.
    - Deterministic O(L) lookup traversal where L is length of prefix.
    - Strict empty match handling: Returns [] immediately if prefix is empty or not found.
    - Frequency scoring with 3x weight multiplier for 'history' sourced phrases.
    """
    def __init__(self):
        self.root = TrieNode()
        self.total_nodes = 1
        self.phrase_count = 0

    def insert(self, phrase: str, source: str = "global", frequency: int = 1, category: str = "general") -> None:
        if not phrase or not phrase.strip():
            return
        
        normalized = phrase.strip()
        current = self.root

        for char in normalized.lower():
            if char not in current.children:
                current.children[char] = TrieNode()
                self.total_nodes += 1
            current = current.children[char]

        if not current.is_terminal:
            self.phrase_count += 1
            current.is_terminal = True
            current.phrase = normalized
            current.frequency = frequency
            current.source = source
            current.category = category
        else:
            # If already present, update frequency and promote source to 'history' if applicable
            current.frequency += frequency
            if source == "history":
                current.source = "history"
            if category != "general":
                current.category = category

    def search_prefix(self, prefix: str, limit: int = 8) -> List[Dict[str, Any]]:
        """
        Deterministic O(L) prefix lookup.
        Strict rule: Returns [] immediately if prefix is empty, whitespace, or has no matching branch.
        """
        if not prefix or not prefix.strip():
            return []

        clean_prefix = prefix.strip().lower()
        current = self.root

        # Deterministic O(L) traversal down to prefix node
        for char in clean_prefix:
            if char not in current.children:
                return []  # No node matches this prefix -> return empty immediately
            current = current.children[char]

        # Gather all matching phrases from subtree
        matches: List[Dict[str, Any]] = []
        self._dfs_collect(current, clean_prefix, matches)

        # Apply scoring formula: frequency * (3 if history else 1)
        for item in matches:
            weight = 3 if item["source"] == "history" else 1
            item["score"] = item["frequency"] * weight
            item["matched_len"] = len(clean_prefix)

        # Sort descending by final score, then alphabetically
        matches.sort(key=lambda x: (-x["score"], x["phrase"]))
        return matches[:limit]

    def _dfs_collect(self, node: TrieNode, prefix: str, results: List[Dict[str, Any]]) -> None:
        if node.is_terminal and node.phrase:
            results.append({
                "phrase": node.phrase,
                "source": node.source,
                "frequency": node.frequency,
                "category": node.category,
                "score": node.frequency * (3 if node.source == "history" else 1)
            })

        for char, child_node in node.children.items():
            self._dfs_collect(child_node, prefix + char, results)

    def get_stats(self) -> Dict[str, Any]:
        return {
            "total_nodes": self.total_nodes,
            "phrase_count": self.phrase_count,
            "algorithm": "Deterministic O(L) Prefix Trie",
            "history_multiplier": "3x"
        }
