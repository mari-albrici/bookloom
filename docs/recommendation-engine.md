# Recommendation engine

Recommendations will be deterministic and explainable before any optional model-assisted layer is considered.

A candidate score combines genre affinity, normalized tag affinity, Book DNA compatibility, author affinity, similar-reader signal, and rating confidence. It subtracts DNF conflicts and explicitly disliked traits. Every result stores a short explanation such as `Because you love atmospheric, character-driven fiction` plus confidence and sample size.

Paid discovery is a separate placement layer. It can decide whether an eligible sponsored card is shown, but it cannot modify the candidate score or any organic aggregate. Sponsored cards always carry a disclosure and a separate `WHY YOU ARE SEEING IT` explanation.
