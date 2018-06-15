import React from 'react'
import chroma from 'chroma-js'

import SvgRenderer from './SvgRenderer'
import CanvasRenderer from './CanvasRenderer'
import NoiseRenderer from './NoiseRenderer'
import BasisGradientRenderer from './BasisGradientRenderer'
import StrokesRenderer from './StrokesRenderer'
import BlobsRenderer from './BlobsRenderer'
import LetterBoxRenderer from './LetterBoxRenderer'
import StampRenderer from './StampRenderer'

let registry = {}

registry['linear hue, index-based'] = new SvgRenderer({
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

registry['linear hue, x-based'] = new SvgRenderer({
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

registry['x:h, y:s'] = new SvgRenderer({
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

registry['x:h, y:c'] = new SvgRenderer({
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

registry['gradient'] = new SvgRenderer({
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

registry['circles'] = new SvgRenderer({
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


registry['stripes'] = new SvgRenderer({
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
  return new CanvasRenderer({
    renderTile: noiseRenderer.renderTile.bind(noiseRenderer),
  })
})()

registry['basis gradient'] = (() => {
  const basisRenderer = new BasisGradientRenderer()
  return new CanvasRenderer({
    renderTile: basisRenderer.renderTile.bind(basisRenderer),
  })
})()

registry['corners'] = (() => {
  return new CanvasRenderer({
    renderTile: (props) => {
      const { canvas, tile, palette, colorGenerator } = props
      const ctx = canvas.getContext('2d')
      const colorFn = colorGenerator({seedColor: palette.getColor()})
      const maxDimension = Math.max(tile.box.width, tile.box.height)
      const lineWidth = 1
      ctx.lineWidth = lineWidth
      for (let i = 0; i < maxDimension; i += lineWidth) {
        ctx.beginPath()
        ctx.strokeStyle = chroma(colorFn({t: i/maxDimension})).css()
        ctx.moveTo(0, i)
        ctx.lineTo(i, i)
        ctx.lineTo(i, 0)
        ctx.stroke()
      }
    }
  })
})()

registry['strokes'] = (() => {
  const strokesRenderer = new StrokesRenderer()
  return new CanvasRenderer({
    renderTile: strokesRenderer.renderTile.bind(strokesRenderer),
  })
})()

registry['blobs'] = (() => {
  const blobsRenderer = new BlobsRenderer()
  return new CanvasRenderer({
    renderTile: blobsRenderer.renderTile.bind(blobsRenderer),
  })
})()

registry['letter box'] = (() => {
  const letterBoxRenderer = new LetterBoxRenderer()
  return new CanvasRenderer({
    renderTile: letterBoxRenderer.renderTile.bind(letterBoxRenderer),
  })
})()

registry['stamp'] = (() => {
  const renderer = new StampRenderer()
  return new CanvasRenderer({
    preRenderTiles: renderer.preRenderTiles.bind(renderer),
    renderTile: renderer.renderTile.bind(renderer),
  })
})()


export default registry
