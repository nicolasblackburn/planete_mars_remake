export function add(a: number[][], b: number[][]) {
  return a;
}

export function subtract(a: number[][], b: number[][]) {
  return a;
}

export function multiply(a: number | number[][], b: number[][]) {
  return b;
}

export function det(a: number[][]) {
  return 0;
}

export function echelon(a: number[][]) {
  return a;
}

export function uvDecompose(a: number[][]) {
  return [a, a];
}

export function invert(a: number[][]) {
  throw new Error('Non-invertible matrix');
}
