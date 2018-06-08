import React from 'react'
import chroma from 'chroma-js'

import NoiseRenderer from './NoiseRenderer'
import Prng from './Prng'
import utils from './utils'


let renderers = {}

renderers['linear hue, index-based'] = {
  renderFn: (opts) => {
    const { index, tiles } = opts
    const h = (index / tiles.length) * 360
    const fill = `hsl(${h}, 100%, 50%)`
    return (
      <g>
        <rect
          x="0" y="0" height="100%" width="100%"
          fill={fill} />
      </g>
    )
  }
}

renderers['linear hue, x-based'] = {
  renderFn: (opts) => {
    const { tile, globalBox } = opts
    const h = ((2 * tile.x / globalBox.width) * 360) % 360
    const fill = `hsl(${h}, 100%, 50%)`
    return (
      <g>
        <rect
          x="0" y="0" height="100%" width="100%"
          fill={fill} />
      </g>
    )
  }
}

renderers['x:h, y:s'] = {
  renderFn: (opts) => {
    const { tile, globalBox } = opts
    const h = ((2 * tile.x / globalBox.width) * 360) % 360
    const s = ((2 * tile.y / globalBox.height) * 100) % 100
    const fill = `hsl(${h}, ${s}%, 50%)`
    return (
      <g>
        <rect
          x="0" y="0" height="100%" width="100%"
          fill={fill} />
      </g>
    )
  }
}


renderers['x:h, y:c'] = {
  renderFn: (opts) => {
    const { tile, globalBox } = opts
    const h = ((2 * tile.x / globalBox.width) * 360) % 360
    const c = ((2 * tile.y / globalBox.height) * 100) % 100
    const fill = chroma.hcl(h, c, 100).css()
    return (
      <g>
        <rect
          x="0" y="0" height="100%" width="100%"
          fill={fill} />
      </g>
    )
  }
}

renderers['gradient'] = {
  renderFn: (opts) => {
    const { tile } = opts
    const prng = new Prng()
    const getColor = () => {
      const hues = [0, 30, 60]
      const fuzz = 40
      const hue = (
        (
          utils.sample(hues, 1)[0]
          + prng.randomInt({min: -fuzz, max: fuzz})
        ) % 360
      )
      return chroma.hsl(hue, 1, .5)
    }
    const stops = [
      // {offset: 0, color: chroma.random().css()},
      // {offset: 100, color: chroma.random().css()},
      /*
      {offset: 0, color: getColor().css()},
      {offset: 100, color: getColor().css()},
      */
      ...(
        (() => {
          const numStops = prng.randomInt({min: 2, max: 5})
          return [...Array(numStops).keys()].map((i) => {
            return {
              offset: Math.round((i / numStops) * 100),
              color: getColor().css(),
            }
          })
        })()
      ),
    ]
    const gradientId = `${tile.key}-gradient`
    return (
      <g>
        <defs>
          <linearGradient id={gradientId}>
            {
              stops.map((stop, i) => {
                return (
                  <stop
                    key={i}
                    offset={`${stop.offset}%`}
                    stopColor={stop.color}
                  />
                )
              })
            }
          </linearGradient>
        </defs>
        <rect
          x="0" y="0" height="100%" width="100%"
          fill={`url(#${gradientId})`} />
      </g>
    )
  }
}

renderers['noise'] = {
  renderFn: (() => {
    const noiseRenderer = new NoiseRenderer()
    return noiseRenderer.render.bind(noiseRenderer)
  })()
}

export default renderers
