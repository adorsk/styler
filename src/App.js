import { connect } from 'react-redux'

import React from 'react'
import Pattern from './Pattern'
import Form from './Form'
import renderers from './renderers'
import tilers from './tilers'


class App extends React.Component {

  render() {
    const { currentRendererKey, currentTilerKey, formValues } = this.props
    const commonProps = {
      formValues,
      renderer: renderers[currentRendererKey],
      tiler: tilers[currentTilerKey],
    }
    return (
      <div className="App">
        {this.renderRendererSelect({currentRendererKey})}
        {this.renderTilerSelect({currentTilerKey})}
        <Pattern {...commonProps} />
        <Form {...commonProps} />
      </div>
    );
  }

  renderRendererSelect (opts = {}) {
    const { currentRendererKey } = opts
    return (
      <select
        value={currentRendererKey}
        onChange={(e) => {
          this.props.dispatch({
            type: 'setCurrentRendererKey',
            payload: e.target.value,
          })
        }}
      >
        {
          Object.keys(renderers).map((rendererKey) => {
            return (
              <option key={rendererKey} value={rendererKey}>
                {rendererKey}
              </option>
            )
          })
        }
      </select>
    )
  }

  renderTilerSelect (opts = {}) {
    const { currentTilerKey } = opts
    return (
      <select
        value={currentTilerKey}
        onChange={(e) => {
          this.props.dispatch({
            type: 'setCurrentTilerKey',
            payload: e.target.value,
          })
        }}
      >
        {
          Object.keys(tilers).map((tilerKey) => {
            return (
              <option key={tilerKey} value={tilerKey}>
                {tilerKey}
              </option>
            )
          })
        }
      </select>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return state.app || {}
}

export default connect(mapStateToProps)(App)
