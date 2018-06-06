import { connect } from 'react-redux'

import React from 'react'
import Pattern from './Pattern'
import Form from './Form'
import renderers from './renderers'


class App extends React.Component {

  render() {
    const { currentRendererKey, formValues } = this.props
    const commonProps = {
      formValues,
      renderer: renderers[currentRendererKey],
    }
    return (
      <div className="App">
        {this.renderRendererSelect({currentRendererKey})}
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
}

const mapStateToProps = (state, ownProps) => {
  return state.app || {}
}

export default connect(mapStateToProps)(App)
