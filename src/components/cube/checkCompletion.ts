import { forkey3, ICube } from './Logic'

export function checkCompletion(blocks: ICube) {
  const left = blocks[-1][0][0].sides.left
  const right = blocks[1][0][0].sides.right
  const front = blocks[0][0][1].sides.front
  const back = blocks[0][0][-1].sides.back
  const top = blocks[0][-1][0].sides.top
  const bottom = blocks[0][1][0].sides.bottom
  let completed = true
  forkey3((x, y, z) => {
    if (x === -1) completed &&= blocks[x][y][z].sides.left === left
    if (x === 1) completed &&= blocks[x][y][z].sides.right === right
    if (y === -1) completed &&= blocks[x][y][z].sides.top === top
    if (y === 1) completed &&= blocks[x][y][z].sides.bottom === bottom
    if (z === -1) completed &&= blocks[x][y][z].sides.back === back
    if (z === 1) completed &&= blocks[x][y][z].sides.front === front
  })
  return completed
}
