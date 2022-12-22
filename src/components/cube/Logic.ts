import { Block } from './Block'
import { rotateOX, rotateOY, rotateOZ } from './geometry'

export type ICube = {
  [key in -1 | 0 | 1]: {
    [key in -1 | 0 | 1]: {
      [key in -1 | 0 | 1]: Block
    }
  }
}
export type IKey = -1 | 0 | 1
export type ICoords = [IKey, IKey, IKey]

export type IMatrix = number[][]

export function generateCube(generateSides: boolean = true): ICube {
  const cube = {} as ICube

  for (let x = -1 as IKey; x <= 1; ++x) {
    cube[x] = {} as ICube[IKey]
    for (let y = -1 as IKey; y <= 1; ++y) {
      cube[x][y] = {} as ICube[IKey][IKey]
      for (let z = -1 as IKey; z <= 1; ++z) cube[x][y][z] = new Block()
    }
  }

  if (!generateSides) return cube

  //front blue
  for (let x = -1 as IKey; x <= 1; ++x)
    for (let y = -1 as IKey; y <= 1; ++y) cube[x][y][1].sides.front = 'blue'
  //back green
  for (let x = -1 as IKey; x <= 1; ++x)
    for (let y = -1 as IKey; y <= 1; ++y) cube[x][y][-1].sides.back = 'green'
  //left red
  for (let y = -1 as IKey; y <= 1; ++y)
    for (let z = -1 as IKey; z <= 1; ++z) cube[-1][y][z].sides.left = 'red'
  //right orange
  for (let y = -1 as IKey; y <= 1; ++y)
    for (let z = -1 as IKey; z <= 1; ++z) cube[1][y][z].sides.right = 'orange'
  //top white
  for (let x = -1 as IKey; x <= 1; ++x)
    for (let z = -1 as IKey; z <= 1; ++z) cube[x][-1][z].sides.top = 'white'
  //bottom yellow
  for (let x = -1 as IKey; x <= 1; ++x)
    for (let z = -1 as IKey; z <= 1; ++z) cube[x][1][z].sides.bottom = 'yellow'

  return cube
}

export class Logic {
  public blocks = generateCube()

  rotateRight() {
    const next = generateCube(false)
    for (let x = -1 as IKey; x <= 1; ++x)
      for (let y = -1 as IKey; y <= 1; ++y)
        for (let z = -1 as IKey; z <= 1; ++z) {
          const block = new Block(this.blocks[x][y][z])
          block.turnLeft()
          const [nextX, nextY, nextZ] = rotateOY([x, y, z], -1)
          next[nextX][nextY][nextZ] = block
        }
    this.blocks = next
  }
  rotateLeft() {
    const next = generateCube(false)
    for (let x = -1 as IKey; x <= 1; ++x)
      for (let y = -1 as IKey; y <= 1; ++y)
        for (let z = -1 as IKey; z <= 1; ++z) {
          const block = new Block(this.blocks[x][y][z])
          block.turnRight()
          const [nextX, nextY, nextZ] = rotateOY([x, y, z], 1)
          next[nextX][nextY][nextZ] = block
        }
    this.blocks = next
  }
  rotateUp() {
    const next = generateCube(false)
    for (let x = -1 as IKey; x <= 1; ++x)
      for (let y = -1 as IKey; y <= 1; ++y)
        for (let z = -1 as IKey; z <= 1; ++z) {
          const block = new Block(this.blocks[x][y][z])
          block.turnDown()
          const [nextX, nextY, nextZ] = rotateOX([x, y, z], -1)
          next[nextX][nextY][nextZ] = block
        }
    this.blocks = next
  }
  rotateDown() {
    const next = generateCube(false)
    for (let x = -1 as IKey; x <= 1; ++x)
      for (let y = -1 as IKey; y <= 1; ++y)
        for (let z = -1 as IKey; z <= 1; ++z) {
          const block = new Block(this.blocks[x][y][z])
          block.turnUp()
          const [nextX, nextY, nextZ] = rotateOX([x, y, z], 1)
          next[nextX][nextY][nextZ] = block
        }
    this.blocks = next
  }

  rotateR(clockwise: boolean) {
    const next = generateCube(false)
    for (let x = -1 as IKey; x <= 1; ++x) {
      for (let y = -1 as IKey; y <= 1; ++y) {
        for (let z = -1 as IKey; z <= 1; ++z) {
          const block = new Block(this.blocks[x][y][z])
          if (x === 1) {
            block[clockwise ? 'turnUp' : 'turnDown']()
            const [nextX, nextY, nextZ] = rotateOX(
              [x, y, z],
              clockwise ? 1 : -1
            )
            next[nextX][nextY][nextZ] = block
          } else next[x][y][z] = block
        }
      }
    }
    this.blocks = next
  }

  rotateL(clockwise: boolean) {
    const next = generateCube(false)
    for (let x = -1 as IKey; x <= 1; ++x) {
      for (let y = -1 as IKey; y <= 1; ++y) {
        for (let z = -1 as IKey; z <= 1; ++z) {
          const block = new Block(this.blocks[x][y][z])
          if (x === -1) {
            block[clockwise ? 'turnDown' : 'turnUp']()
            const [nextX, nextY, nextZ] = rotateOX(
              [x, y, z],
              clockwise ? -1 : 1
            )
            next[nextX][nextY][nextZ] = block
          } else next[x][y][z] = block
        }
      }
    }
    this.blocks = next
  }

  rotateU(clockwise: boolean) {
    const next = generateCube(false)
    for (let x = -1 as IKey; x <= 1; ++x) {
      for (let y = -1 as IKey; y <= 1; ++y) {
        for (let z = -1 as IKey; z <= 1; ++z) {
          const block = new Block(this.blocks[x][y][z])
          if (y === -1) {
            block[clockwise ? 'turnLeft' : 'turnRight']()
            const [nextX, nextY, nextZ] = rotateOY(
              [x, y, z],
              clockwise ? -1 : 1
            )
            next[nextX][nextY][nextZ] = block
          } else next[x][y][z] = block
        }
      }
    }
    this.blocks = next
  }

  rotateD(clockwise: boolean) {
    const next = generateCube(false)
    for (let x = -1 as IKey; x <= 1; ++x) {
      for (let y = -1 as IKey; y <= 1; ++y) {
        for (let z = -1 as IKey; z <= 1; ++z) {
          const block = new Block(this.blocks[x][y][z])
          if (y === 1) {
            block[clockwise ? 'turnRight' : 'turnLeft']()
            const [nextX, nextY, nextZ] = rotateOY(
              [x, y, z],
              clockwise ? 1 : -1
            )
            next[nextX][nextY][nextZ] = block
          } else next[x][y][z] = block
        }
      }
    }
    this.blocks = next
  }

  rotateF(clockwise: boolean) {
    const next = generateCube(false)
    for (let x = -1 as IKey; x <= 1; ++x) {
      for (let y = -1 as IKey; y <= 1; ++y) {
        for (let z = -1 as IKey; z <= 1; ++z) {
          const block = new Block(this.blocks[x][y][z])
          if (z === 1) {
            block[clockwise ? 'turnClockWise' : 'turnAntiClockWise']()
            const [nextX, nextY, nextZ] = rotateOZ(
              [x, y, z],
              clockwise ? 1 : -1
            )
            next[nextX][nextY][nextZ] = block
          } else next[x][y][z] = block
        }
      }
    }
    this.blocks = next
  }
}
