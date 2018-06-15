import chroma from 'chroma-js'
import * as d3 from 'd3'

import utils from '../utils'


const ASCII_RANGE = { start: 33, end: 126 }

const FONTS = [
  'sans-serif',
  'cursive',
  'serif',
  'fantasy',
  'monospace',
]

class LetterBoxRenderer {
  renderTile (props) {
    const {canvas, tile, palette, prng, colorGenerator } = props
    const ctx = canvas.getContext('2d')
    const maxDimension = Math.max(tile.box.height, tile.box.width)
    const gridSpacing = Math.ceil(maxDimension / 10)
    const colorFn = colorGenerator({seedColor: palette.getColor()})
    for (let y = gridSpacing; y < tile.box.height; y += gridSpacing) {
      for (let x = gridSpacing; x < tile.box.width; x += gridSpacing) {
        const angle = prng.randomInt({min: 0, max: 180})
        const angleRadians = angle * (Math.PI / 180 )
        ctx.save()
        ctx.rotate(angleRadians)
        const rotatedPoint = this.rotatePoint({x, y}, -angleRadians)
        const color = chroma(colorFn({t: (x / tile.box.width)}))
        const char = String.fromCharCode(prng.randomInt({
          min: ASCII_RANGE.start, max: ASCII_RANGE.end}))
        const font = utils.choice(FONTS, {random: () => prng.random()})
        ctx.fillStyle = color.css()
        ctx.font = `${gridSpacing}px ${font}`
        ctx.fillText(char, rotatedPoint.x, rotatedPoint.y)
        ctx.restore()
      }
    }
  }

  rotatePoint(point, theta) {
    return {
      x: ((point.x * Math.cos(theta)) - (point.y * Math.sin(theta))),
      y: ((point.y * Math.cos(theta)) + (point.x * Math.sin(theta))),
    }
  }
}

export default LetterBoxRenderer
