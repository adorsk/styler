import renderers from '../renderers'


const initialState = {
  currentRendererKey: Object.keys(renderers)[0],
  formValues: {},
}

const reducer = (state = initialState, action) => {
  if (action.type === 'setCurrentRendererKey') {
    state = {
      ...state,
      currentRendererKey: action.payload
    }
  }
  return state
}

export default reducer
