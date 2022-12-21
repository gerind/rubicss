import { ISideState } from './Side'

export type ISideKey = 'front' | 'left' | 'right' | 'top' | 'bottom' | 'back'

export class Block {
  public sides: {
    [key in ISideKey]: ISideState
  } = {
    front: 'void',
    left: 'void',
    right: 'void',
    top: 'void',
    bottom: 'void',
    back: 'void',
  }

  constructor(block?: Block) {
    if (block) this.sides = { ...block.sides }
  }

  turnRight() {
    const { front, left, right, top, bottom, back } = this.sides
    this.sides = {
      front: left,
      left: back,
      right: front,
      top,
      bottom,
      back: right,
    }
  }

  turnLeft() {
    const { front, left, right, top, bottom, back } = this.sides
    this.sides = {
      front: right,
      left: front,
      right: back,
      top,
      bottom,
      back: left,
    }
  }

  turnUp() {
    const { front, left, right, top, bottom, back } = this.sides
    this.sides = {
      front: bottom,
      left,
      right,
      top: front,
      bottom: back,
      back: top,
    }
  }

  turnDown() {
    const { front, left, right, top, bottom, back } = this.sides
    this.sides = {
      front: top,
      left,
      right,
      top: back,
      bottom: front,
      back: bottom,
    }
  }

  turnClockWise() {
    const { front, left, right, top, bottom, back } = this.sides
    this.sides = {
      front,
      left: bottom,
      right: top,
      top: left,
      bottom: right,
      back,
    }
  }

  turnAntiClockWise() {
    const { front, left, right, top, bottom, back } = this.sides
    this.sides = {
      front,
      left: top,
      right: bottom,
      top: right,
      bottom: left,
      back,
    }
  }
}
