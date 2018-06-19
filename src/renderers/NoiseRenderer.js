import utils from '../utils'


class NoiseRenderer {
  constructor () {
    this.memCanvas = document.createElement('canvas')
    this.memCtx = this.memCanvas.getContext('2d')
  }

  renderTile (props) {
    const { tile, canvas, ctx, prng, palette } = props
    const numNoises = 2
    const width = tile.box.width
    const height = tile.box.height
    this.memCanvas.width = width
    this.memCanvas.height = height
    for (let i = 0; i < numNoises; i++) {
      this.renderNoise({
        canvas,
        ctx,
        width,
        height,
        density: (.3 + (prng.randomInt({min: 0, max: 5}) * .1)),
        prng,
        rgba: palette.getColor().alpha(.6).rgba(),
      })
    }
  }

  renderNoise (opts) {
    const { canvas, width, height, density, prng, rgba } = opts
    const imgData = utils.generateNoiseImageData({
      width, height, density, rgba,
      random: prng.random.bind(prng)
    })
    this.memCtx.putImageData(imgData, 0, 0)
    canvas.getContext('2d').drawImage(this.memCanvas, 0, 0)
  }
}

export default NoiseRenderer
