import React from 'react'

import utils from '../utils'
import BaseRenderer from './BaseRenderer'


const SVG_NS = 'http://www.w3.org/2000/svg'

class SvgRenderer extends BaseRenderer {
  constructor (props = {}) {
    super(props)
    this.renderTile = props.renderTile || (() => null)
  }

  renderPattern (props = {}) {
    const { globalBox } = props
    return (
      <svg
        xmlns={SVG_NS}
        width={globalBox.width}
        height={globalBox.height}
        viewBox={`0 0 ${globalBox.width} ${globalBox.height}`}
      >
        {this.renderTiles(props)}
      </svg>
    )
  }

  renderTiles (props = {}) {
    const { tiles } = props
    return tiles.map((tile, index) => {
      return this.renderTileContainer({
        ...props,
        tile,
        index,
        children: this.renderTile({...props, tile, index})
      })
    })
  }

  renderTileContainer (props = {}) {
    const { tile, index, children } = props
    const clipId = `${tile.key}-clip`
    return (
      <svg
        key={index}
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
          {children}
        </g>
      </svg>
    )
  }
}

export default SvgRenderer
