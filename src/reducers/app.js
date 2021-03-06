import renderers from '../renderers/registry'
import tilers from '../tilers'
import palettes from '../palettes'
import colorGenerators from '../colorGenerators'


const initialState = {
  currentRendererKey: Object.keys(renderers)[0],
  currentTilerKey: Object.keys(tilers)[0],
  currentPaletteKey: Object.keys(palettes)[0],
  currentColorGeneratorKey: Object.keys(colorGenerators)[0],
  currentSeed: 2,
  formValues: {},
}

const reducer = (state = initialState, action) => {
  if (action.type === 'setCurrentRendererKey') {
    state = {
      ...state,
      currentRendererKey: action.payload
    }
  }
  else if (action.type === 'setCurrentTilerKey') {
    state = {
      ...state,
      currentTilerKey: action.payload
    }
  }
  else if (action.type === 'setCurrentPaletteKey') {
    state = {
      ...state,
      currentPaletteKey: action.payload
    }
  }
  else if (action.type === 'setCurrentColorGeneratorKey') {
    state = {
      ...state,
      currentColorGeneratorKey: action.payload
    }
  }
  else if (action.type === 'setCurrentSeed') {
    state = {
      ...state,
      currentSeed: action.payload
    }
  }
  return state
}

export default reducer
