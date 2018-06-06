import React from 'react'


const SVG_NS = 'http://www.w3.org/2000/svg'

class Pattern extends React.Component {
  render () {
    const width = 360
    const height = 360
    const n = 24
    const regions = this.generateRegions({width, height, n})
    const overallBounds = {width, height}
    return (
      <div>
        <svg
          xmlns={SVG_NS}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
        >
          {this.renderRegions({regions, overallBounds})}
        </svg>
      </div>
    )
  }

  generateRegions (opts) {
    const { width, height, n } = {
      ...{width: 100, height: 100},
      ...opts,
    }
    const steps = {x: (width / n), y: (height / n)}
    const regions = []
    for (let x = 0; x < width; x += steps.x) {
      for (let y = 0; y < height; y += steps.y) {
        const region = {
          key: `(${x}, ${y})`,
          x,
          y,
          bounds: {
            x0: x,
            x1: x + steps.x,
            y0: y,
            y1: y + steps.y,
          }
        }
        regions.push(region)
      }
    }
    return regions
  }

  renderRegions (opts = {}) {
    const { regions, overallBounds } = opts
    return regions.map((region, i) => {
      return this.renderRegion({
        region,
        index: i,
        regions,
        overallBounds,
      })
    })
  }

  renderRegion (opts = {}) {
    const { renderer, formValues } = this.props
    const { region, regions, index, overallBounds } = opts
    return (
      <svg
        key={region.key}
        xmlns={SVG_NS}
        x={region.x}
        y={region.y}
        width={region.bounds.x1 - region.bounds.x0}
        height={region.bounds.y1 - region.bounds.y0}
      >
        {
          renderer.renderFn({
            region,
            regions,
            index,
            formValues,
            overallBounds,
          })}
      </svg>
    )
  }
}

export default Pattern
