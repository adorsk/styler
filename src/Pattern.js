import React from 'react'
import utils from './utils'


const SVG_NS = 'http://www.w3.org/2000/svg'

class Pattern extends React.Component {
  render () {
    const { tiler, palette, prng } = this.props
    const width = 360
    const height = 360
    const n = 24
    const tiles = tiler({width, height, n})
    const globalBox = {width, height}
    const renderCtx = { prng, palette }
    return (
      <div>
        <svg
          xmlns={SVG_NS}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          {this.renderTiles({tiles, globalBox, renderCtx})}
        </svg>
      </div>
    )
  }

  renderTiles (opts = {}) {
    const { tiles, globalBox, renderCtx } = opts
    return tiles.map((tile, index) => {
      return this.renderTile({
        tile,
        index,
        tiles,
        globalBox,
        ctx: renderCtx,
      })
    })
  }

  renderTile (opts = {}) {
    const { renderer, formValues } = this.props
    const { tile, tiles, index, globalBox, ctx } = opts
    const clipId = `${tile.key}-clip`
    return (
      <svg
        key={tile.key}
        xmlns={SVG_NS}
        x={tile.x}
        y={tile.y}
        width={tile.box.width}
        height={tile.box.height}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={utils.pathDefToD(tile.pathDef)} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          {
            renderer.renderFn({
              tile,
              tiles,
              index,
              formValues,
              globalBox,
              ctx,
            })}
        </g>
      </svg>
    )
  }
}

export default Pattern
