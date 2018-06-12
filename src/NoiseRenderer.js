import React from 'react'
import utils from './utils'


class NoiseRenderer {
  render (opts) {
    const { tile, ctx } = opts
    const { prng, palette } = ctx
    const width = tile.box.x1 - tile.box.x0
    const height = tile.box.y1 - tile.box.y0
    const numNoises = 2
    let noiseUrls = []
    for (let i = 0; i < numNoises; i++) {
      const noiseUrl = this.generateNoiseUrl({
        width,
        height,
        prng,
        // density: (tile.x / overallBounds.width),
        // density: .3,
        density: (
          .3 + (prng.randomInt({min: 0, max: 5}) * .1)
        ),
        rgba: palette.getColor().alpha(.6).rgba(),
      })
      noiseUrls.push(noiseUrl)
    }
    return (
      <g>
        {
          noiseUrls.map((noiseUrl, i) => {
            return (
              <image
                key={i}
                width={width} height={height}
                href={noiseUrl} />
            )
          })
        }
      </g>
    )
  }

  generateNoiseUrl (opts = {}) {
    const { width, height, density, prng, rgba} = {
      density: .5,
      rgba: [0, 0, 0, 1],
      ...opts
    }
    const numPixels = width * height
    const numNoisePixels = Math.floor(density * numPixels)
    const pixelIdxs = [...Array(numPixels).keys()]
    const noisePixelIdxs = utils.sample(
      pixelIdxs,
      numNoisePixels,
      {random: prng.random.bind(prng)}
    )
    const canvas = this.generateCanvas({width, height})
    const ctx = canvas.getContext('2d')
    const imgData = ctx.createImageData(width, height)
    for (let pixelIdx of noisePixelIdxs) {
      const baseIdx = pixelIdx * 4
      imgData.data[baseIdx + 0] = rgba[0]
      imgData.data[baseIdx + 1] = rgba[1]
      imgData.data[baseIdx + 2] = rgba[2]
      imgData.data[baseIdx + 3] = Math.floor(255 * rgba[3])
    }
    ctx.putImageData(imgData, 0, 0)
    const dataUrl = canvas.toDataURL()
    return dataUrl
  }

  generateCanvas (opts = {}) {
    const { width, height } = opts
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  }

}

export default NoiseRenderer
