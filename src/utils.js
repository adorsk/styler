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

export default {
  pathDefToD,
  sample,
  shuffle,
}
