import { connect } from 'react-redux'

import React from 'react'
import Pattern from './Pattern'
import Form from './Form'
import renderers from './renderers'
import tilers from './tilers'
import Prng from './Prng'


class App extends React.Component {
  constructor (props) {
    super(props)
    this.prng = new Prng()
  }

  render() {
    const {
      currentRendererKey,
      currentTilerKey,
      formValues,
      currentSeed,
    } = this.props
    this.prng.setSeed(currentSeed)
    const commonProps = {
      formValues,
      prng: this.prng,
      renderer: renderers[currentRendererKey],
      tiler: tilers[currentTilerKey],
    }
    return (
      <div className="App">
        {this.renderRendererSelect({currentRendererKey})}
        {this.renderTilerSelect({currentTilerKey})}
        {this.renderSeedInput({currentSeed})}
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

  renderSeedInput (opts = {}) {
    const { currentSeed } = opts
    return (
      <input
        type="number"
        value={currentSeed}
        onChange={(e) => {
          this.props.dispatch({
            type: 'setCurrentSeed',
            payload: parseInt(e.target.value, 10),
          })
        }}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return state.app || {}
}

export default connect(mapStateToProps)(App)
