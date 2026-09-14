# Data trust model

Bookloom keeps data categories explicit:

- `ORGANIC`: placement or behavior generated without paid influence.
- `COMMUNITY`: ratings, reviews, tags, and reader-contributed DNA votes.
- `EDITORIAL`: publisher or provider metadata such as descriptions and edition facts.
- `DERIVED`: recommendation explanations, Reader DNA, confidence, and similarity.
- `SPONSORED`: campaign placement and paid reporting.

Sponsored campaigns have no foreign-key or service boundary that permits writes to ratings, DNA aggregates, Taste Match, organic ranking, or organic trend calculations. The production test suite must assert this invariant directly.

Professional reporting must use minimum cohort thresholds and aggregate dimensions. It must never expose a list of identifiable readers who abandoned, disliked, or privately journaled about a work.
