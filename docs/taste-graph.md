# Taste graph

The graph is represented in PostgreSQL rather than a separate graph database. Raw user events remain distinct from derived edges and insights.

Core nodes are users, works, editions, authors, series, genres, tags, DNA attributes, reading events, ratings, reviews, and collections. Important relations include `READ`, `RATED`, `DNF`, `REREAD`, `LIKES_TAG`, `PREFERS_DNA`, `HAS_TAG`, `HAS_DNA`, `SIMILAR_TO`, `WROTE`, and `PART_OF`.

Derived edges should always carry `sample_size`, `confidence`, and `last_calculated_at`. Sparse data should produce `Not enough reading data yet`, not false precision.
