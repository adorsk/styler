let tilers = {}

/* A single big rectangle. */
tilers.bigRect = (opts) => {
  const { width, height } = {
    ...{width: 100, height: 100},
    ...opts,
  }
  const tiles = [{
    key: `bigTile`,
    x: 0,
    y: 0,
    pathDef: [
      ['M', [0, 0]],
      ['L', [width, 0]],
      ['L', [width, height]],
      ['L', [0, height]],
      ['L', [0, 0]],
    ],
    box: {
      x0: 0,
      x1: width,
      y0: 0,
      y1: height,
      width,
      height,
      center: {x: width / 2, y: height / 2},
    },
  }]
  return tiles
}

tilers.rects = (opts) => {
  const { width, height, n } = {
    ...{width: 100, height: 100},
    n: 12,
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
          center: {x: rectDimensions.width / 2, y: rectDimensions.height / 2},
        },
      }
      tiles.push(tile)
    }
  }
  return tiles
}


// wallpaper group cm
tilers.diamonds = (opts) => {
  const { width, height, n } = {
    ...{width: 100, height: 100},
    n: 12,
    ...opts,
  }
  const dimensions = {
    width: (width / n),
    height: (height / n)
  }
  const tiles = []
  // offset rows
  const offsets = [
    [0, 0],
    [(dimensions.width / 2), (dimensions.height / 2)]
  ]
  // start outside of bounds, to allow for partial tiles.
  for (let y = -dimensions.height; y < height; y += dimensions.height) {
    for (const offset of offsets) {
      for (let x = -dimensions.width; x < width; x += dimensions.width) {
        const offsetX = x + offset[0]
        const offsetY = y + offset[1]
        const tile = {
          key: `${x}-${y}--${offset.join('-')}`,
          x: offsetX,
          y: offsetY,
          pathDef: [
            ['M', [0, (dimensions.height / 2)]],
            ['L', [(dimensions.width / 2), 0]],
            ['L', [dimensions.width, (dimensions.height / 2)]],
            ['L', [(dimensions.width / 2), dimensions.height]],
            ['L', [0, (dimensions.height / 2)]],
          ],
          box: {
            x0: offsetX,
            x1: offsetX + dimensions.width,
            y0: offsetY,
            y1: offsetY + dimensions.height,
            width: dimensions.width,
            height: dimensions.height,
            center: {x: dimensions.width / 2, y: dimensions.height / 2},
          },
        }
        tiles.push(tile)
      }
    }
  }
  return tiles
}


tilers.hexagons = (opts) => {
  const { width, height, n } = {
    ...{width: 100, height: 100},
    n: 12,
    ...opts,
  }
  const dimensions = { width: (width / n) }
  dimensions.height = dimensions.width * (Math.pow(3, .5) / 2)

  const tiles = []
  // offset rows
  const quarterWidth = dimensions.width / 4
  const offsets = [
    [0, 0],
    [3 * quarterWidth, dimensions.height / 2]
  ]
  // start outside of bounds, to allow for partial tiles.
  for (let y = -dimensions.height; y < height; y += dimensions.height) {
    for (const offset of offsets) {
      for (let x = -dimensions.width; x < width; x += (6 * quarterWidth)) {
        const offsetX = x + offset[0]
        const offsetY = y + offset[1]
        const tile = {
          key: `${x}-${y}--${offset.join('-')}`,
          x: offsetX,
          y: offsetY,
          pathDef: [
            ['M', [0, (dimensions.height / 2)]],
            ['L', [quarterWidth, 0]],
            ['L', [3 * quarterWidth, 0]],
            ['L', [dimensions.width, (dimensions.height / 2)]],
            ['L', [3 * quarterWidth, dimensions.height]],
            ['L', [quarterWidth, dimensions.height]],
            ['L', [0, (dimensions.height / 2)]],
          ],
          box: {
            x0: offsetX,
            x1: offsetX + dimensions.width,
            y0: offsetY,
            y1: offsetY + dimensions.height,
            width: dimensions.width,
            height: dimensions.height,
            center: {x: dimensions.width / 2, y: dimensions.height / 2},
          },
        }
        tiles.push(tile)
      }
    }
  }
  return tiles
}

export default tilers
