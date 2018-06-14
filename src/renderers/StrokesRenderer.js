import chroma from 'chroma-js'
import utils from '../utils'


class StrokesRenderer {
  renderTile (props) {
    const {
      canvas, tile, index, tiles, palette, prng,
      globalBox, colorGenerator
    } = props
    const ctx = canvas.getContext('2d')
    const maxDimension = Math.max(tile.box.height, tile.box.width)
    const gridSpacing = Math.ceil(maxDimension / 10)
    const colorFn = colorGenerator({seedColor: palette.getColor()})
    for (let y = gridSpacing; y < tile.box.height; y += gridSpacing) {
      for (let x = gridSpacing; x < tile.box.width; x += gridSpacing) {
        const angle = (Math.PI / 180 ) * prng.randomInt({min: 0, max: 180})
        const length = prng.randomInt({min: 1, max: maxDimension})
        const startPos = [
          x + Math.cos(angle) * (length / 2),
          y + Math.sin(angle) * (length / 2)
        ]
        const endPos = [
          x - Math.cos(angle) * (length / 2),
          y - Math.sin(angle) * (length / 2)
        ]
        ctx.beginPath()
        ctx.lineWidth = 1
        ctx.strokeStyle = colorFn({t: (x / tile.box.width)})
        ctx.moveTo(...startPos)
        ctx.lineTo(...endPos)
        ctx.stroke()
      }
    }
  }
}

export default StrokesRenderer
