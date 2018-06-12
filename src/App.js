import { connect } from 'react-redux'

import React from 'react'
import PatternContainer from './PatternContainer'
import renderers from './renderers/registry'
import tilers from './tilers'
import palettes from './palettes'
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
      currentPaletteKey,
      formValues,
      currentSeed,
    } = this.props
    this.prng.setSeed(currentSeed)
    const commonProps = {
      formValues,
      prng: this.prng,
      renderer: renderers[currentRendererKey],
      tiler: tilers[currentTilerKey],
      palette: palettes[currentPaletteKey]({prng: this.prng}),
    }
    return (
      <div className="App">
        {this.renderRendererSelect({currentRendererKey})}
        {this.renderTilerSelect({currentTilerKey})}
        {this.renderPaletteSelect({currentPaletteKey})}
        {this.renderSeedInput({currentSeed})}
        <PatternContainer {...commonProps} />
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

  renderPaletteSelect (opts = {}) {
    const { currentPaletteKey } = opts
    return (
      <select
        value={currentPaletteKey}
        onChange={(e) => {
          this.props.dispatch({
            type: 'setCurrentPaletteKey',
            payload: e.target.value,
          })
        }}
      >
        {
          Object.keys(palettes).map((paletteKey) => {
            return (
              <option key={paletteKey} value={paletteKey}>
                {paletteKey}
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
