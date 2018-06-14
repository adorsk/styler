import chroma from 'chroma-js'

export const colorGenerators = {}

colorGenerators.foo = (props) => {
  const { seedColor } = props
  const colors = {}
  const mode = 'rgb'
  colors.primary = seedColor
  colors.complement = seedColor.set(
    'hsl.h', (seedColor.get('hsl.h') + 180) % 360)
  colors.neighbor = seedColor.set(
    'hsl.h', (seedColor.get('hsl.h') + 330) % 360)
  colors['p+n'] = chroma.mix(colors.primary, colors.neighbor, .5, mode)
  const subFns = [
    {
      range: [0, .05],
      fn: (
        chroma.scale([colors.primary, colors.complement])
        .domain([0, .05])
        .mode(mode)
      )
    },
    {
      range: [.05, .15], 
      fn: (
        chroma.scale([colors.complement, colors.neighbor])
        .domain([.05, .15])
        .mode(mode)
      ),
    },
    {
      range: [.15, .2],
      fn: (
        chroma.scale([colors.neighbor, colors['p+n']])
        .domain([.15, .2])
        .mode(mode)
      )
    },
    {range: [.2, .22], fn: () => colors['p+n']} ,
    {range: [.22, 1.1], fn: (t) => {
      const ratio = (t - .22) / (1 - .22)
      return chroma.mix(colors['p+n'], colors.complement, ratio, mode)
    }},
  ]
  const generator = ((opts) => {
    const { t } = opts
    for (let subFn of subFns) {
      const range = subFn.range
      if ( (t >= range[0]) && (t < range[1]) ) {
        return subFn.fn(t)
      }
    }
  })
  return generator
}

colorGenerators.scale = (props) => {
  const { colors, mode } = {mode: 'rgb', ...props}
  const scaleFn = chroma.scale(colors).mode(mode)
  const generator = ((opts) => scaleFn(opts.t))
  return generator
}

colorGenerators.toWhite = (props) => {
  return colorGenerators.scale({colors: [props.seedColor, 'white']})
}

colorGenerators.toBlack = (props) => {
  return colorGenerators.scale({colors: [props.seedColor, 'black']})
}

colorGenerators.toTransparent = (props) => {
  const generator = (opts) => {
    const c = chroma(props.seedColor).alpha(opts.t)
    return c
  }
  return generator
}

colorGenerators.identity = (props) => {
  return () => props.seedColor
}

colorGenerators.random = () => chroma.random

export default colorGenerators

