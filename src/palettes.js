import chroma from 'chroma-js'

import utils from './utils'


let palettes = {}

palettes['analogous'] = (opts = {}) => {
  const { prng } = opts
  return (() => {
    const palette = {
      getColor: () => {
        const baseHue = prng.randomInt({min:0, max: 360})
        const hueStep = 30
        const hues = [...Array(3).keys()].map((i) => {
          return (baseHue + (hueStep * i)) % 360
        })
        const fuzz = 5
        const hue = (
          (
            utils.sample(hues, 1)[0]
            + prng.randomInt({min: -fuzz, max: fuzz})
          ) % 360
        )
        return chroma.hsl(hue, 1, .5)
      }
    }
    return palette
  })()
}

palettes['reddish'] = (opts = {}) => {
  const { prng } = opts
  return (() => {
    const baseHue = 360
    const palette = {
      getColor: () => {
        const fuzz = 5
        const hue = (
          (
            baseHue
            + prng.randomInt({min: -fuzz, max: fuzz})
          ) % 360
        )
        return chroma.hsl(hue, 1, .5)
      }
    }
    return palette
  })()
}


export default palettes
