import React from 'react'
import _ from 'lodash'


class Canvas extends React.Component {
  static defaultProps = {
    updateCanvas: () => null,
  }

  componentDidMount () {
    this.updateCanvas()
  }

  updateCanvas () {
    this.props.updateCanvas(this.canvas)
  }

  componentDidUpdate () {
    this.updateCanvas()
  }

  render () {
    const passThroughProps = _.omit(this.props, ['updateCanvas'])
    return (
      <canvas
        ref={((canvas) => {this.canvas = canvas})}
        {...passThroughProps}
      />
    )
  }
}

export default Canvas
