/**
 * Compute the Levenshtein edit distance between two strings.
 *
 * The distance is the minimum number of single-character edits
 * (insertions, deletions, substitutions) required to change `a` into `b`.
 *
 * The implementation uses two rolling rows of length `b.length + 1`,
 * giving O(min(a.length, b.length)) space and O(a.length * b.length) time.
 * This is preferable to a full matrix when only the distance is needed.
 *
 * @param {string} a first string
 * @param {string} b second string
 * @returns {number} edit distance (a non-negative integer)
 */
export function levenshteinDistance(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('levenshteinDistance expects two strings');
  }

  // If one string is empty, distance is the length of the other.
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Keep the shorter string as the inner loop dimension to minimise memory.
  const source = a.length <= b.length ? a : b;
  const target = a.length <= b.length ? b : a;

  let previousRow = new Array(source.length + 1);
  let currentRow = new Array(source.length + 1);

  // Initialise the first row: distance from empty string to source prefix.
  for (let i = 0; i <= source.length; i++) {
    previousRow[i] = i;
  }

  for (let j = 1; j <= target.length; j++) {
    currentRow[0] = j;

    for (let i = 1; i <= source.length; i++) {
      const substitutionCost = source[i - 1] === target[j - 1] ? 0 : 1;
      currentRow[i] = Math.min(
        currentRow[i - 1] + 1,           // deletion from source
        previousRow[i] + 1,              // insertion into source
        previousRow[i - 1] + substitutionCost // substitution or match
      );
    }

    // Swap rows: current becomes previous, and reuse the old previous as next current.
    [previousRow, currentRow] = [currentRow, previousRow];
  }

  return previousRow[source.length];
}

/**
 * Compute the full Levenshtein distance matrix between two strings.
 *
 * The returned matrix has (a.length + 1) rows and (b.length + 1) columns.
 * matrix[i][j] is the edit distance between the first i characters of `a`
 * and the first j characters of `b`. This is useful for reconstructing
 * edit scripts or for debugging.
 *
 * @param {string} a first string
 * @param {string} b second string
 * @returns {number[][]} distance matrix
 */
export function levenshteinDistanceMatrix(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('levenshteinDistanceMatrix expects two strings');
  }

  const rows = a.length + 1;
  const cols = b.length + 1;
  const matrix = Array.from({ length: rows }, () => new Array(cols).fill(0));

  for (let i = 0; i < rows; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j < cols; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,          // deletion
        matrix[i][j - 1] + 1,          // insertion
        matrix[i - 1][j - 1] + substitutionCost // substitution or match
      );
    }
  }

  return matrix;
}
