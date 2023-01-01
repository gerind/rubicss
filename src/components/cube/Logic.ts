import { Block } from './Block'
import { rotateOX, rotateOY, rotateOZ } from './geometry'
import { ISideState } from './Side'

export type ICube = {
  [key in IKey]: {
    [key in IKey]: {
      [key in IKey]: Block
    }
  }
}
export type ISquare = {
  [key in IKey]: {
    [key in IKey]: ISideState
  }
}
export type IKey = -1 | 0 | 1
export type ICoords = [IKey, IKey, IKey]

export type IMoveType =
  | 'R'
  | 'L'
  | 'F'
  | 'U'
  | 'D'
  | 'Up'
  | 'Left'
  | 'Right'
  | 'Down'

export const availableMoves: IMoveType[] = [
  'R',
  'L',
  'F',
  'U',
  'D',
  'Up',
  'Left',
  'Right',
  'Down',
]

export type IMatrix = number[][]

interface IRotateOptions {
  x?: IKey[]
  y?: IKey[]
  z?: IKey[]
  rotate: typeof rotateOX
  count: number
  turnBlock: typeof Block.prototype.turnRight
}
export interface IRotateResponce {
  before: ISquare
  after: ISquare
  affectedCoords: [IKey, IKey][]
  from: [number, number, number]
  to: [number, number, number]
}

export function forkey(callbackfn: (k: IKey) => void) {
  for (let k = -1 as IKey; k <= 1; ++k) callbackfn(k)
}
export function forkey2(callbackfn: (k1: IKey, k2: IKey) => void) {
  forkey(k1 => forkey(k2 => callbackfn(k1, k2)))
}
export function forkey3(callbackfn: (k1: IKey, k2: IKey, k3: IKey) => void) {
  forkey(k1 => forkey2((k2, k3) => callbackfn(k1, k2, k3)))
}

function coordsSatisfy([x, y, z]: [IKey, IKey, IKey], options: IRotateOptions) {
  return (
    (!options.x || options.x.some(i => i === x)) &&
    (!options.y || options.y.some(i => i === y)) &&
    (!options.z || options.z.some(i => i === z))
  )
}

export function generateCube(generateSides: boolean = true): ICube {
  const cube = {} as ICube

  forkey3((x, y, z) => {
    if (!(x in cube)) cube[x] = {} as ICube[IKey]
    if (!(y in cube[x])) cube[x][y] = {} as ICube[IKey][IKey]
    cube[x][y][z] = new Block()
  })

  if (!generateSides) return cube

  forkey2((x, y) => (cube[x][y][1].sides.front = 'blue'))
  forkey2((x, y) => (cube[x][y][-1].sides.back = 'green'))
  forkey2((y, z) => (cube[-1][y][z].sides.left = 'red'))
  forkey2((y, z) => (cube[1][y][z].sides.right = 'orange'))
  forkey2((x, z) => (cube[x][-1][z].sides.top = 'white'))
  forkey2((x, z) => (cube[x][1][z].sides.bottom = 'yellow'))

  return cube
}

export class Logic {
  public blocks = generateCube()

  getFrontSquare(): ISquare {
    const square = {} as ISquare
    forkey2((x, y) => {
      if (!(x in square)) square[x] = {} as ISquare[IKey]
      square[x][y] = this.blocks[x][y][1].sides.front
    })
    return square
  }

  private rotate(options: IRotateOptions): IRotateResponce {
    const before = this.getFrontSquare()

    const next = generateCube(false)
    forkey3((x, y, z) => {
      if (coordsSatisfy([x, y, z], options)) {
        const [nextX, nextY, nextZ] = options.rotate([x, y, z], options.count)
        const block = new Block(this.blocks[x][y][z])
        options.turnBlock.call(block)
        next[nextX][nextY][nextZ] = block
      } else {
        next[x][y][z] = new Block(this.blocks[x][y][z])
      }
    })
    this.blocks = next

    const affectedCoords: [IKey, IKey][] = []
    forkey2((x, y) => {
      if (options.x || options.y) {
        if (coordsSatisfy([x, y, 1], options)) affectedCoords.push([x, y])
      } else affectedCoords.push([x, y])
    })

    const from = [rotateOX, rotateOY, rotateOZ].map(f =>
      options.rotate === f ? options.count * -90 : 0
    ) as [number, number, number]
    const to = from.map(deg => (deg ? -deg : deg)) as typeof from

    return {
      before,
      after: this.getFrontSquare(),
      affectedCoords,
      from,
      to,
    }
  }

  rotateRight() {
    return this.rotate({
      rotate: rotateOY,
      count: -1,
      turnBlock: Block.prototype.turnLeft,
    })
  }
  rotateLeft() {
    return this.rotate({
      rotate: rotateOY,
      count: 1,
      turnBlock: Block.prototype.turnRight,
    })
  }
  rotateUp() {
    return this.rotate({
      rotate: rotateOX,
      count: -1,
      turnBlock: Block.prototype.turnDown,
    })
  }
  rotateDown() {
    return this.rotate({
      rotate: rotateOX,
      count: 1,
      turnBlock: Block.prototype.turnUp,
    })
  }

  rotateR(clockwise: boolean) {
    return this.rotate({
      x: [1],
      rotate: rotateOX,
      count: clockwise ? 1 : -1,
      turnBlock: clockwise ? Block.prototype.turnUp : Block.prototype.turnDown,
    })
  }
  rotateL(clockwise: boolean) {
    return this.rotate({
      x: [-1],
      rotate: rotateOX,
      count: clockwise ? -1 : 1,
      turnBlock: clockwise ? Block.prototype.turnDown : Block.prototype.turnUp,
    })
  }
  rotateU(clockwise: boolean) {
    return this.rotate({
      y: [-1],
      rotate: rotateOY,
      count: clockwise ? -1 : 1,
      turnBlock: clockwise
        ? Block.prototype.turnLeft
        : Block.prototype.turnRight,
    })
  }
  rotateD(clockwise: boolean) {
    return this.rotate({
      y: [1],
      rotate: rotateOY,
      count: clockwise ? 1 : -1,
      turnBlock: clockwise
        ? Block.prototype.turnRight
        : Block.prototype.turnLeft,
    })
  }
  rotateF(clockwise: boolean) {
    return this.rotate({
      z: [1],
      rotate: rotateOZ,
      count: clockwise ? 1 : -1,
      turnBlock: clockwise
        ? Block.prototype.turnClockWise
        : Block.prototype.turnAntiClockWise,
    })
  }

  performMove(moveType: IMoveType, clockwise?: boolean) {
    const methodName = `rotate${moveType}` as keyof this
    const method = this[methodName] as (clockwise?: boolean) => IRotateResponce
    return method.call(this, clockwise)
  }
}
