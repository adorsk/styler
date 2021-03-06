import React from 'react'

import BaseRenderer from './BaseRenderer'
import Canvas from './Canvas'
import utils from '../utils'


class CanvasRenderer extends BaseRenderer {
  constructor (props = {}) {
    super(props)
    this.renderTile = props.renderTile || (() => null)
    this.preRenderTiles = props.preRenderTiles || (() => null)
  }

  renderPattern (props = {}) {
    const { globalBox } = props
    return (
      <Canvas
        width={globalBox.width}
        height={globalBox.height}
        updateCanvas={(canvas) => {
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
          this.renderTiles({...props, canvas})
        }}
      />
    )
    
  }

  renderTiles (props = {}) {
    this.preRenderTiles(props)
    const { canvas, tiles } = props
    const ctx = canvas.getContext('2d')
    tiles.map((tile, index) => {
      ctx.save()
      ctx.translate(tile.x, tile.y)
      ctx.beginPath()
      ctx.clip(new Path2D(utils.pathDefToD(tile.pathDef)))
      this.renderTile({...props, tile, index, canvas})
      ctx.restore()
      return null
    })
  }
}

export default CanvasRenderer
