import utils from '../utils'


class NoiseRenderer {
  constructor () {
    this.memCanvas = document.createElement('canvas')
    this.memCtx = this.memCanvas.getContext('2d')
  }

  renderTile (props) {
    const { tile, canvas, ctx, prng, palette } = props
    const numNoises = 2
    for (let i = 0; i < numNoises; i++) {
      this.renderNoise({
        canvas,
        ctx,
        width: (tile.box.x1 - tile.box.x0),
        height: (tile.box.y1 - tile.box.y0),
        density: (.3 + (prng.randomInt({min: 0, max: 5}) * .1)),
        prng,
        rgba: palette.getColor().alpha(.6).rgba(),
      })
    }
  }

  renderNoise (opts) {
    const { canvas, width, height, density, prng, rgba } = opts
    const numPixels = width * height
    const numNoisePixels = Math.floor(density * numPixels)
    const pixelIdxs = [...Array(numPixels).keys()]
    const noisePixelIdxs = utils.sample(
      pixelIdxs,
      numNoisePixels,
      {random: prng.random.bind(prng)}
    )
    const imgData = this.memCtx.createImageData(width, height)
    for (let pixelIdx of noisePixelIdxs) {
      const baseIdx = pixelIdx * 4
      imgData.data[baseIdx + 0] = rgba[0]
      imgData.data[baseIdx + 1] = rgba[1]
      imgData.data[baseIdx + 2] = rgba[2]
      imgData.data[baseIdx + 3] = Math.floor(255 * rgba[3])
    }
    this.memCtx.putImageData(imgData, 0, 0)
    canvas.getContext('2d').drawImage(this.memCanvas, 0, 0)
  }
}

export default NoiseRenderer
