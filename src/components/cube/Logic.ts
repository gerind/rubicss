import { Block } from './Block'

type ICube = {
  [key in -1 | 0 | 1]: {
    [key in -1 | 0 | 1]: {
      [key in -1 | 0 | 1]: Block
    }
  }
}
type IKey = -1 | 0 | 1
type ICoords = [IKey, IKey, IKey]

type IMatrix = number[][]

//these functions accept count of 90-degree rotations in positive direction
//rotations matrixes are for left-side coordinate system(out system is left-side)
function sin(count: number): number {
  return [0, 1, 0, -1][((count % 4) + 4) % 4]
}
function cos(count: number): number {
  return [1, 0, -1, 0][((count % 4) + 4) % 4]
}
function getRotationMatrixOX(count: number): IMatrix {
  return [
    [1, 0, 0],
    [0, cos(count), sin(count)],
    [0, -sin(count), cos(count)],
  ]
}
function getRotationMatrixOY(count: number): IMatrix {
  return [
    [cos(count), 0, -sin(count)],
    [0, 1, 0],
    [sin(count), 0, cos(count)],
  ]
}
function getRotationMatrixOZ(count: number): IMatrix {
  return [
    [cos(count), sin(count), 0],
    [-sin(count), cos(count), 0],
    [0, 0, 1],
  ]
}

function matrixProduct(a: IMatrix, b: IMatrix): IMatrix {
  const n = a.length,
    m = b[0].length
  if (a[0].length !== b.length) throw new Error('Error Error!!!')
  const c = new Array(n).fill(0).map(() => new Array(m).fill(0))
  for (let i = 0; i < n; ++i)
    for (let j = 0; j < m; ++j)
      for (let r = 0; r < b.length; ++r) c[i][j] += a[i][r] * b[r][j]
  return c
}

function rotateOX([x, y, z]: ICoords, count: number): ICoords {
  const result = matrixProduct([[x, y, z]], getRotationMatrixOX(count))
  return result[0] as ICoords
}
function rotateOY([x, y, z]: ICoords, count: number): ICoords {
  const result = matrixProduct([[x, y, z]], getRotationMatrixOY(count))
  return result[0] as ICoords
}
function rotateOZ([x, y, z]: ICoords, count: number): ICoords {
  const result = matrixProduct([[x, y, z]], getRotationMatrixOZ(count))
  return result[0] as ICoords
}

function generateCube(generateSides: boolean = true): ICube {
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
          const [nextX, nextY, nextZ] = rotateOY([x, y, z], -1) as ICoords
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
          const [nextX, nextY, nextZ] = rotateOY([x, y, z], 1) as ICoords
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
          const [nextX, nextY, nextZ] = rotateOX([x, y, z], -1) as ICoords
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
          const [nextX, nextY, nextZ] = rotateOX([x, y, z], 1) as ICoords
          next[nextX][nextY][nextZ] = block
        }
    this.blocks = next
  }

  rotateR(clockwise: boolean) {
    // const next = generateCube(false)
    // for (let x = -1 as IKey; x <= 1; ++x) {
    //   for (let y = -1 as IKey; y <= 1; ++y) {
    //     for (let z = -1 as IKey; z <= 1; ++z) {
    //       const block = new Block(this.blocks[x][y][z])
    //     }
    //   }
    // }
  }

  rotateL() {}
}
