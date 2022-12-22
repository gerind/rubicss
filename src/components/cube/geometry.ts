import { ICoords, IMatrix } from './Logic'

//these functions accept count of 90-degree rotations in positive direction
//rotations matrixes are for left-side coordinate system(out system is left-side)
export function sin(count: number): number {
  return [0, 1, 0, -1][((count % 4) + 4) % 4]
}
export function cos(count: number): number {
  return [1, 0, -1, 0][((count % 4) + 4) % 4]
}
export function getRotationMatrixOX(count: number): IMatrix {
  return [
    [1, 0, 0],
    [0, cos(count), sin(count)],
    [0, -sin(count), cos(count)],
  ]
}
export function getRotationMatrixOY(count: number): IMatrix {
  return [
    [cos(count), 0, -sin(count)],
    [0, 1, 0],
    [sin(count), 0, cos(count)],
  ]
}
export function getRotationMatrixOZ(count: number): IMatrix {
  return [
    [cos(count), sin(count), 0],
    [-sin(count), cos(count), 0],
    [0, 0, 1],
  ]
}

export function matrixProduct(a: IMatrix, b: IMatrix): IMatrix {
  const n = a.length,
    m = b[0].length
  if (a[0].length !== b.length) throw new Error('Error Error!!!')
  const c = new Array(n).fill(0).map(() => new Array(m).fill(0))
  for (let i = 0; i < n; ++i)
    for (let j = 0; j < m; ++j)
      for (let r = 0; r < b.length; ++r) c[i][j] += a[i][r] * b[r][j]
  return c
}

export function rotateOX([x, y, z]: ICoords, count: number): ICoords {
  const result = matrixProduct([[x, y, z]], getRotationMatrixOX(count))
  return result[0] as ICoords
}
export function rotateOY([x, y, z]: ICoords, count: number): ICoords {
  const result = matrixProduct([[x, y, z]], getRotationMatrixOY(count))
  return result[0] as ICoords
}
export function rotateOZ([x, y, z]: ICoords, count: number): ICoords {
  const result = matrixProduct([[x, y, z]], getRotationMatrixOZ(count))
  return result[0] as ICoords
}
