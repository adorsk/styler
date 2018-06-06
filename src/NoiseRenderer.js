import React from 'react'
import chroma from 'chroma-js'

import Prng from './Prng'
import utils from './utils'


class NoiseRenderer {
  constructor (opts = {}) {
    this.prng = new Prng()
  }

  render (opts) {
    const { region, overallBounds } = opts
    const width = region.bounds.x1 - region.bounds.x0
    const height = region.bounds.y1 - region.bounds.y0
    const numNoises = 2
    let noiseUrls = []
    // const hues = [0, 30, 240]
    const hues = [0, 30]
    for (let i = 0; i < numNoises; i++) {
      /*
      const hue = (
        2 *
        Math.floor((region.x / overallBounds.width) * 360)
        + (i * (360 / numNoises))
        % 360
      )
      */
      // const hue = this.prng.randomInt({min: 0, max: 360})
      const hue = (
        utils.sample(hues, 1)[0] 
        + (this.prng.randomInt({min: -10, max: 10}))
      )
      const noiseUrl = this.generateNoiseUrl({
        width,
        height,
        // density: (region.x / overallBounds.width),
        // density: .3,
        density: (
          .2 + (this.prng.randomInt({min: 0, max: 5}) * .1)
        ),
        rgba: chroma.hsl(hue, 1, .5).alpha(.6).rgba(),
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
    const { width, height, density, rgba} = {
      density: .5,
      rgba: [0, 0, 0, 1],
      ...opts
    }
    const numPixels = width * height
    const numNoisePixels = Math.floor(density * numPixels)
    const pixelIdxs = [...Array(numPixels).keys()]
    const noisePixelIdxs = utils.sample(pixelIdxs, numNoisePixels, {random: this.prng.random.bind(this.prng)})
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
