import { test } from 'node:test';
import assert from 'node:assert/strict';

import { levenshteinDistance, levenshteinDistanceMatrix } from '../src/core.js';

test('distance between identical strings is zero', () => {
  assert.equal(levenshteinDistance('kitten', 'kitten'), 0);
  assert.equal(levenshteinDistance('', ''), 0);
});

test('distance is symmetric', () => {
  const a = 'saturday';
  const b = 'sunday';
  assert.equal(levenshteinDistance(a, b), levenshteinDistance(b, a));
});

test('classic kitten -> sitting is 3', () => {
  assert.equal(levenshteinDistance('kitten', 'sitting'), 3);
});

test('empty string handling', () => {
  assert.equal(levenshteinDistance('', 'abc'), 3);
  assert.equal(levenshteinDistance('abc', ''), 3);
  assert.equal(levenshteinDistance('', ''), 0);
});

test('single insertion', () => {
  assert.equal(levenshteinDistance('cat', 'cats'), 1);
});

test('single deletion', () => {
  assert.equal(levenshteinDistance('cats', 'cat'), 1);
});

test('single substitution', () => {
  assert.equal(levenshteinDistance('cat', 'cut'), 1);
});

test('unicode characters are treated as single code units', () => {
  // '😀' is a single code point but two UTF-16 code units.
  // Our implementation compares strings as sequences of code units,
  // so '😀' and '😃' have distance 2 (both code units differ).
  assert.equal(levenshteinDistance('😀', '😃'), 1);
});

test('long common prefix and suffix', () => {
  assert.equal(levenshteinDistance('abcdef', 'abcxdef'), 1);
});

test('case sensitivity', () => {
  assert.equal(levenshteinDistance('Abc', 'abc'), 1);
});

test('non-string input throws TypeError', () => {
  assert.throws(() => levenshteinDistance(123, 'abc'), TypeError);
  assert.throws(() => levenshteinDistance('abc', null), TypeError);
  assert.throws(() => levenshteinDistance(undefined, 'abc'), TypeError);
});

test('distance matrix has correct dimensions and values', () => {
  const matrix = levenshteinDistanceMatrix('cat', 'cut');
  assert.equal(matrix.length, 4);
  assert.equal(matrix[0].length, 4);

  // Verify a few known cells.
  assert.equal(matrix[0][0], 0);
  assert.equal(matrix[1][1], 0); // 'c' vs 'c'
  assert.equal(matrix[2][2], 1); // 'ca' vs 'cu'
  assert.equal(matrix[3][3], 1); // 'cat' vs 'cut'
});

test('distance matrix for empty strings', () => {
  const matrix = levenshteinDistanceMatrix('', 'ab');
  assert.deepEqual(matrix, [
    [0, 1, 2],
  ]);
});

test('distance matrix throws on non-string input', () => {
  assert.throws(() => levenshteinDistanceMatrix(42, 'x'), TypeError);
  assert.throws(() => levenshteinDistanceMatrix('x', {}), TypeError);
});
