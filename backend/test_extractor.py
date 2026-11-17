# Helper script to update vector_search.py with full domain intelligence and entity enrichment
import sys
import re

with open('backend/vector_search.py', 'r', encoding='utf-8') as f:
    orig = f.read()

# 1. Update imports at top
import_block = '''import math
import re
from typing import List, Dict, Any, Tuple, Optional

try:
    from entity_enricher import enrich_query_entity
except ImportError:
    from backend.entity_enricher import enrich_query_entity
'''

orig = re.sub(
    r'import math\s+import re\s+from typing import List, Dict, Any, Tuple',
    import_block.strip(),
    orig
)

# 2. Extract INDEXED_CORPUS
corpus_match = re.search(r'(INDEXED_CORPUS = \{.*?\n\})\n\n', orig, re.DOTALL)
if not corpus_match:
    print("Failed to find INDEXED_CORPUS")
    sys.exit(1)
indexed_corpus_code = corpus_match.group(1)

# Extract SemanticVectorEncoder
encoder_match = re.search(r'(class SemanticVectorEncoder:.*?\n)(?=class VectorSearchEngine:)', orig, re.DOTALL)
if not encoder_match:
    print("Failed to find SemanticVectorEncoder")
    sys.exit(1)
encoder_code = encoder_match.group(1)

# Extract SEMANTIC_CLUSTERS
clusters_match = re.search(r'(SEMANTIC_CLUSTERS = \{.*?\n\})\n\n', orig, re.DOTALL)
if not clusters_match:
    print("Failed to find SEMANTIC_CLUSTERS")
    sys.exit(1)
clusters_code = clusters_match.group(1)

print("Extracted components successfully!")
