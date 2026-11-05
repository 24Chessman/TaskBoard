// Pure helpers for the dashboard (no React), so they are easy to test.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// percent(part, total): a whole number from 0 to 100; 0 when the total is 0 (never NaN or Infinity)
export const percent = (part, total) => {
  if (!(total > 0) || !(part > 0)) return 0;
  return Math.round((part / total) * 100);
};

// niceMax(value): the top of a chart axis, a round number at or above the value (1, 2, 5, 10, 20, 50, 100 ...).
// 0 or less gives 1, so an empty chart still has an axis.
export const niceMax = (value) => {
  if (!(value > 0)) return 1;
  const unit = 10 ** Math.floor(Math.log10(value));
  const ratio = value / unit;
  const step = ratio <= 1 ? 1 : ratio <= 2 ? 2 : ratio <= 5 ? 5 : 10;
  return step * unit;
};

// shortDay("2026-11-05") -> "Nov 5". Read from the text, never through a Date, so no time zone can shift the day.
export const shortDay = (key) => {
  const [, month, day] = String(key).split('-').map(Number);
  return MONTHS[month - 1] && day ? `${MONTHS[month - 1]} ${day}` : String(key);
};

// segmentPercents([3, 1, 1]) -> whole-number percents that add up to exactly 100 (largest remainder method).
// All zeros give all zeros.
export const segmentPercents = (counts) => {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (!(total > 0)) return counts.map(() => 0);
  const exact = counts.map((count) => (count / total) * 100);
  const result = exact.map(Math.floor);
  let left = 100 - result.reduce((sum, value) => sum + value, 0);
  exact
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index)
    .forEach(({ index }) => {
      if (left > 0) {
        result[index] += 1;
        left -= 1;
      }
    });
  return result;
};

// clip("a very long label", 10) -> "a very lo…": keeps chart rows from overflowing
export const clip = (text, max) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);
