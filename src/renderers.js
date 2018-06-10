import React from 'react'
import chroma from 'chroma-js'

import NoiseRenderer from './NoiseRenderer'
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
    const { tile, ctx } = opts
    const prng = ctx.prng
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

renderers['circles'] = {
  renderFn: (opts) => {
    const { tile, ctx } = opts
    const prng = ctx.prng
    const getColor = () => {
      const baseHue = prng.randomInt({min:0, max: 360})
      const hueStep = 30
      const hues = [...Array(3).keys()].map((i) => {
        return (baseHue + (hueStep * i)) % 360
      })
      const fuzz = 20
      const hue = (
        (
          utils.sample(hues, 1)[0]
          + prng.randomInt({min: -fuzz, max: fuzz})
        ) % 360
      )
      return chroma.hsl(hue, 1, .5)
    }
    const numCircles = prng.randomInt({min: 5, max: 10})
    return (
      <g>
        {
          [...Array(numCircles).keys()].map((i) => {
            const r = prng.randomInt({
              min: 5,
              max: .5 * Math.max(tile.box.width, tile.box.height),
            })
            const cx = prng.randomInt({
              min: -(2 * r),
              max: tile.box.width + (2 * r),
            })
            const cy = prng.randomInt({
              min: -(2 * r),
              max: tile.box.height + (2 * r),
            })
            const fill = getColor().alpha(.5).css()
            const circleProps = {r, cx, cy, fill}
            return (<circle key={i} {...circleProps} />)
          })
        }
      </g>
    )
  }
}


renderers['stripes'] = {
  renderFn: (opts) => {
    const { tile, ctx } = opts
    const prng = ctx.prng
    const getColor = () => {
      // const baseHue = prng.randomInt({min:0, max: 360})
      const baseHue = prng.randomInt({min:0, max: 30})
      const hueStep = 30
      const hues = [...Array(3).keys()].map((i) => {
        return (baseHue + (hueStep * i)) % 360
      })
      const fuzz = 20
      const hue = (
        (
          utils.sample(hues, 1)[0]
          + prng.randomInt({min: -fuzz, max: fuzz})
        ) % 360
      )
      return chroma.hsl(hue, 1, .5)
    }
    const numStripes = prng.randomInt({min: 5, max: 10})
    const stripeWidth = tile.box.width / numStripes
    return (
      <g>
        {
          [...Array(numStripes).keys()].map((i) => {
            const x = (.5 * stripeWidth) + (i * stripeWidth)
            const lineProps = {
              x1: x,
              x2: x,
              y1: 0,
              y2: tile.box.height,
              strokeWidth: stripeWidth,
              stroke: getColor().css(),
            }
            return (<line key={i} {...lineProps} />)
          })
        }
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
