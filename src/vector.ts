export function translate(points: number[][], v: number[]) {
  return points.map((point) => {
    return add(point, v);
  });
}

export function equals(u: number[], v: number[]) {
  return u.every((u_i, i) => { return u_i === v[i]; });
}

export function add(u: number[], v: number[]) {
  return u.map((u_i, i) => { return u_i + v[i]; });
}

export function subtract(u: number[], v: number[]) {
  return u.map((u_i, i) => { return u_i - v[i]; });
}

export function multiply(n: number, v: number[]) {
  return v.map((v_i) => { return n * v_i; });
}

export function normal2d(v: number[]) {
  return [v[1], -v[0]];
}

export function innerProduct(u: number[], v: number[]) {
  return u.reduce((sum, u_i, i) => {
    return sum + u_i * v[i];
  }, 0);
}

export function norm(v: number[]) {
  return Math.sqrt(innerProduct(v, v));
}

export function projectionLength(u: number[], v: number[]) {
  return innerProduct(u, v) / norm(v);
}

export function projectOnto(u: number[], v: number[]) {
  return multiply(projectionLength(u, v), v);
}
