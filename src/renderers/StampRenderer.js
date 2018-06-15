import chroma from 'chroma-js'


class StampRenderer {
  constructor () {
    this.memCanvas = document.createElement('canvas')
    this.memCtx = this.memCanvas.getContext('2d')
    this.colorFn = null
  }

  preRenderTiles (props = {}) {
    const { palette, colorGenerator } = props
    this.colorFn = colorGenerator({seedColor: palette.getColor()})
  }

  renderTile (props) {
    const { canvas, tile, index, tiles, prng } = props
    const colorFn = this.colorFn
    const ctx = canvas.getContext('2d')
    ctx.save()
    ctx.fillStyle = chroma(colorFn({t: index / tiles.length})).css()
    ctx.fillRect(0, 0, tile.box.width, tile.box.height)
    // mask with stamp image
    const stampImg = this.generateStampImage({
      width: tile.box.width,
      height: tile.box.height,
      prng
    })
    ctx.globalCompositeOperation = 'destination-in'
    ctx.drawImage(stampImg, 0, 0)
    ctx.restore()
  }

  generateStampImage (opts) {
    const { width, height, prng } = opts
    const tmpCanvas = this.memCanvas
    const tmpCtx = tmpCanvas.getContext('2d')
    tmpCanvas.width = width
    tmpCanvas.height = height
    tmpCtx.clearRect(0, 0, width, height)
    tmpCtx.beginPath()
    tmpCtx.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 2 * Math.PI, false)
    tmpCtx.fillStyle = 'rgba(255, 255, 255, 1)'
    tmpCtx.fill()
    // erase random pixels
    const imgData = tmpCtx.getImageData(0, 0, width, height)
    for (let i = 0; i < imgData.data.length; i += 4) {
      if (prng.random() > .5) {
        imgData.data[i + 3] = 0
      }
    }
    tmpCtx.putImageData(imgData, 0, 0)
    return tmpCanvas
  }
}

export default StampRenderer
