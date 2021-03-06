import React from 'react'


class PatternContainer extends React.Component {
  render () {
    const {
      renderer, tiler, palette, prng, colorGenerator
    } = this.props
    const width = 360
    const height = 360
    const tiles = tiler({width, height})
    const globalBox = {width, height}
    return renderer.renderPattern({
      tiles, globalBox, palette, prng, colorGenerator
    })
  }
}

export default PatternContainer
