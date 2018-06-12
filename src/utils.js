export function pathDefToD (pathDef) {
  const d = pathDef.map((item) => {
    return `${item[0]}${item[1].join(',')}`
  }).join(' ')
  return d
}

export function shuffle (array, opts = {}) {
  // per https://github.com/d3/d3-array/blob/master/src/shuffle.js
  const {i0, i1, random} = {
    i0: 0,
    i1: array.length,
    random: Math.random,
    ...opts
  }
  let m = i1 - i0
  let t, i
  while (m) {
    i = random() * m-- | 0
    t = array[m + i0]
    array[m + i0] = array[i + i0]
    array[i + i0] = t
  }
  return array
}

export function sample (array, n, opts = {}) {
  return shuffle(array, opts).slice(0, n)
}

/* from d3-interpolate */
function basis(t1, v0, v1, v2, v3) {
  let t2 = t1 * t1, t3 = t2 * t1;
  return ((1 - 3 * t1 + 3 * t2 - t3) * v0
      + (4 - 6 * t2 + 3 * t3) * v1
      + (1 + 3 * t1 + 3 * t2 - 3 * t3) * v2
      + t3 * v3) / 6;
}

/* from d3-interpolate */
export function interpolateBasis(values) {
  let n = values.length - 1;
  return function(t) {
    let i = t <= 0 ? (t = 0) : t >= 1 ? (t = 1, n - 1) : Math.floor(t * n),
        v1 = values[i],
        v2 = values[i + 1],
        v0 = i > 0 ? values[i - 1] : 2 * v1 - v2,
        v3 = i < n - 1 ? values[i + 2] : 2 * v2 - v1;
    return basis((t - i / n) * n, v0, v1, v2, v3);
  };
}

export default {
  pathDefToD,
  sample,
  shuffle,
  interpolateBasis,
}
