import Splitting from 'splitting'
import 'splitting/dist/splitting.css'
import 'splitting/dist/splitting-cells.css'

/**
 * Run Splitting.js over the given targets so each word/character becomes a
 * span you can animate individually (with GSAP, CSS, etc).
 *
 * Usage in markup:  <h1 data-splitting>Hello</h1>
 *
 * @param {string} selector CSS selector for elements to split
 * @param {'chars'|'words'|'lines'} by what to split into (default 'chars')
 * @returns {Array} Splitting results (one entry per matched element)
 */
export function splitText(selector = '[data-splitting]', by = 'chars') {
  return Splitting({
    target: selector,
    by,
  })
}
