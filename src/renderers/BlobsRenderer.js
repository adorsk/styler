import * as d3 from 'd3'


class BlobsRenderer {
  renderTile (props) {
    const {canvas, tile, palette, prng } = props
    const points = this.generatePoints({tile, prng})
    this.drawCurve({canvas, points, palette })
  }

  generatePoints (opts = {}) {
    // inscribes jittered dodecagon
    const { tile, prng } = opts
    // not actually centroid...can fix later.
    const centroid = {x: tile.box.width / 2, y: tile.box.height / 2}
    const minDimension = Math.min(tile.box.width, tile.box.height)
    const radius = minDimension / 4
    const maxJitter = radius / 4
    const numVertices = 12
    const points = [...Array(numVertices).keys()].map((i) => {
      const angle = (i / numVertices) * 360
      const angleRadians = angle * (Math.PI / 180)
      const jitteredRadius = radius + (maxJitter * prng.random())
      return {
        x: centroid.x + (jitteredRadius * Math.cos(angleRadians)),
        y: centroid.y + (jitteredRadius * Math.sin(angleRadians)),
      }
    })
    return points
  }

  drawCurve (opts = {}) {
    const { points, canvas, palette } = opts
    const ctx = canvas.getContext('2d')
    const lineGenerator = (
      d3.line()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveBasisClosed)
      .context(ctx)
    )
    ctx.strokeStyle = palette.getColor().css()
    ctx.fillStyle = palette.getColor().css()
    ctx.beginPath()
    lineGenerator(points)
    ctx.fill()
  }
}

export default BlobsRenderer
