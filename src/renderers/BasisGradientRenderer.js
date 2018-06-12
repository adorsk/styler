import chroma from 'chroma-js'

import utils from '../utils'


class BasisGradientRenderer {
  renderTile (props) {
    const { canvas, tile, index, tiles, palette, prng, globalBox } = props
    const startColor = chroma('blue')
    const endColor = chroma('red')

    let interpolators = {}
    const channels = ['r', 'g', 'b']
    for (let channel of channels) {
      const start = startColor.get(`rgb.${channel}`)
      const end = endColor.get(`rgb.${channel}`)
      const mid = start + (end - start) * (index / tiles.length)
      interpolators[channel] = utils.interpolateBasis(
        [start, mid, end])
    }

    const gradientFn = (opts = {}) => {
      const { t } = opts
      const rgb = {}
      for (let channel of channels) {
        rgb[channel] = interpolators[channel](t)
      }
      return chroma(rgb.r, rgb.g, rgb.b, 'rgb')
    }

    const lineWidth = 1;
    const ctx = canvas.getContext('2d')
    for (let i = 0; i < tile.box.width; i += lineWidth) {
      const t = i / tile.box.width
      ctx.fillStyle = gradientFn({t})
      ctx.fillRect(
        i * lineWidth,
        0,
        lineWidth,
        tile.box.height
      )
    }
  }

}

export default BasisGradientRenderer
