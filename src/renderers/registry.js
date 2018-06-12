import React from 'react'
import chroma from 'chroma-js'

import SvgPattern from './SvgPattern'
import CanvasPattern from './CanvasPattern'
import NoiseRenderer from './NoiseRenderer'
import BasisGradientRenderer from './BasisGradientRenderer'

let registry = {}

registry['linear hue, index-based'] = new SvgPattern({
  renderTile: (props) => {
    const { index, tiles } = props
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
})

registry['linear hue, x-based'] = new SvgPattern({
  renderTile: (props) => {
    const { tile, globalBox } = props
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
})

registry['x:h, y:s'] = new SvgPattern({
  renderTile: (props) => {
    const { tile, globalBox } = props
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
})

registry['x:h, y:c'] = new SvgPattern({
  renderTile: (props) => {
    const { tile, globalBox } = props
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
})

registry['gradient'] = new SvgPattern({
  renderTile: (props) => {
    const { tile, prng, palette } = props
    const stops = [
      ...(
        (() => {
          const numStops = prng.randomInt({min: 2, max: 5})
          return [...Array(numStops).keys()].map((i) => {
            return {
              offset: Math.round((i / numStops) * 100),
              color: palette.getColor().css(),
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
})

registry['circles'] = new SvgPattern({
  renderTile: (props) => {
    const { tile, prng, palette } = props
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
            const fill = palette.getColor().alpha(.5).css()
            const circleProps = {r, cx, cy, fill}
            return (<circle key={i} {...circleProps} />)
          })
        }
      </g>
    )
  }
})


registry['stripes'] = new SvgPattern({
  renderTile: (props) => {
    const { tile, prng, palette} = props
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
              stroke: palette.getColor().css(),
            }
            return (<line key={i} {...lineProps} />)
          })
        }
      </g>
    )
  }
})

registry['noise'] = (() => {
  const noiseRenderer = new NoiseRenderer()
  return new CanvasPattern({
    renderTile: noiseRenderer.renderTile.bind(noiseRenderer),
  })
})()

registry['basis gradient'] = (() => {
  const basisRenderer = new BasisGradientRenderer()
  return new CanvasPattern({
    renderTile: basisRenderer.renderTile.bind(basisRenderer),
  })
})()


export default registry
