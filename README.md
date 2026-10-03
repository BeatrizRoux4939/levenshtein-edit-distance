# Levenshtein Edit Distance

Computes the minimum number of single-character edits (insertions, deletions, substitutions) needed to transform one string into another.

```js
import { levenshteinDistance } from './src/index.js';

console.log(levenshteinDistance('kitten', 'sitting')); // 3
```

## Why this library exists

Levenshtein distance is a fundamental string metric used in spell checking, fuzzy matching, and DNA sequence comparison. This library provides a dependency-free, straightforward implementation for JavaScript ESM environments where pulling in a larger package is undesirable.

The main trade-off is space versus functionality. `levenshteinDistance` uses two rolling rows to keep memory usage proportional to the shorter input string. `levenshteinDistanceMatrix` returns the full matrix when you need to reconstruct the edit path or inspect intermediate distances.

## API

### `levenshteinDistance(a, b)`

Returns a non-negative integer distance between strings `a` and `b`. Throws `TypeError` if either argument is not a string.

### `levenshteinDistanceMatrix(a, b)`

Returns a 2D array of size `(a.length + 1) x (b.length + 1)`, where `matrix[i][j]` is the distance between the first `i` characters of `a` and the first `j` characters of `b`. Throws `TypeError` if either argument is not a string.

## Edge cases

Strings are compared by UTF-16 code units, not by Unicode code points. This means an emoji such as 😀 (two code units) and 😃 (two different code units) have distance 2, not 1. If you need code point awareness, you must normalise or split the strings before calling these functions.

## Performance

The window keeps a bounded buffer, so `push` is constant time and memory does not
grow with the length of the stream. `peak` and `trough` are linear in the window
size, which is the trade that keeps `push` cheap.

## Limitations

Values are coerced to floats, so very large integers lose precision. If you need
exact integer aggregates over a window, this is the wrong tool.

## Contributing

Issues and pull requests are welcome. Please keep the dependency list empty —
that constraint is the point of the project, not an oversight.

