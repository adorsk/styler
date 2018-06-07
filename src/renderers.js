import React from 'react'
import chroma from 'chroma-js'

import NoiseRenderer from './NoiseRenderer'


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

renderers['opacity=1, x:num overlays'] = {
  renderFn: (opts) => {
    const { tile, globalBox } = opts
    const numOverlays = Math.floor(100 * tile.x / globalBox.width)
    const fill = chroma.rgb(255, 0, 0).alpha(.01).css()
    return (
      <g>
        {
          [...Array(numOverlays).keys()].map((i) => {
            return (
              <rect
                key={i}
                x="0" y="0" height="100%" width="100%"
                fill={fill} />
            )
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
