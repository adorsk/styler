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

function generateEquiPalette(props = {}) {
  const {seedColors, s, l} = {s: .5, l: .5, ...props}
  const equalizedSeedColors = seedColors.map((color) => {
    return chroma(color).set('hsl.s', s).set('hsl.l', l)
  })
  const colors = (
    chroma.scale(equalizedSeedColors)
    .correctLightness()
    .colors(4)
  )
  return (opts) => {
    const { prng } = opts
    const random = prng.random.bind(prng)
    const palette = {
      getColor: (() => chroma(utils.choice(colors, { random }))),
    }
    return palette
  }
}

const equiPaletteColorGroups = []
const tertiaries = []
const hueAnglePerTertiary = 30
for (let i = 0; i < 360; i += hueAnglePerTertiary) {
  tertiaries.push(chroma.hsl(i, 1, .5))
}
const tertiaryPairs = []
for (let i = 0; i < tertiaries.length - 1; i++) {
  for (let j = i + 1; j < tertiaries.length; j++) {
    tertiaryPairs.push([tertiaries[i], tertiaries[j]])
  }
}
for (const pair of tertiaryPairs) {
  const pairName = pair.map((color) => color.name()).join('-')
  palettes[pairName] = generateEquiPalette({seedColors: pair})
}


export default palettes
