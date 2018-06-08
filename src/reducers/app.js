import renderers from '../renderers'
import tilers from '../tilers'


const initialState = {
  currentRendererKey: Object.keys(renderers)[0],
  currentTilerKey: Object.keys(tilers)[0],
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
  else if (action.type === 'setCurrentSeed') {
    state = {
      ...state,
      currentSeed: action.payload
    }
  }
  return state
}

export default reducer
