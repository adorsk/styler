let tilers = {}

tilers.rects = (opts) => {
  const { width, height, n } = {
    ...{width: 100, height: 100},
    ...opts,
  }
  const rectDimensions = {
    width: (width / n),
    height: (height / n)
  }
  const tiles = []
  for (let x = 0; x < width; x += rectDimensions.width) {
    for (let y = 0; y < height; y += rectDimensions.height) {
      const tile = {
        key: `${x}-${y}`,
        x,
        y,
        pathDef: [
          ['M', [0, 0]],
          ['L', [rectDimensions.width, 0]],
          ['L', [rectDimensions.width, rectDimensions.height]],
          ['L', [0, rectDimensions.height]],
          ['L', [0, 0]],
        ],
        box: {
          x0: x,
          x1: x + rectDimensions.width,
          y0: y,
          y1: y + rectDimensions.height,
          width: rectDimensions.width,
          height: rectDimensions.height,
        },
      }
      tiles.push(tile)
    }
  }
  return tiles
}

export default tilers
