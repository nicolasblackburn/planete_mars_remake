import * as vec from './vector';

/**
 * Calculate the minkowski sum of two convex and positively oriented polygons.
 */
export function minkowskiSum(pointsA: number[][], pointsB: number[][]) {
  switch (pointsB.length) {
    case 0:
      // Polygon 2 has no points therefore we return an empty polygon
      return [];

    case 1:
      // Polygon 2 has only one point therefore we return polygon 1 translated
      return vec.translate(pointsA, pointsB[0]);

    default:
      const points = [];
      const segmentCount = pointsB.length;
      let segmentIndex = 0;
      let lastPointIndex;

      while (segmentIndex < segmentCount) {
        const segmentPointA = pointsB[segmentIndex];
        const segmentPointB = pointsB[(segmentIndex + 1) % segmentCount];
        const segment = vec.subtract(segmentPointB, segmentPointA);
        const normal = vec.normal2d(segment);
        const pointIndex = furthestPointIndex(pointsA, normal);
        console.log('Furthest point: ' + pointsA[pointIndex].toString() + ', index: ' + pointIndex);
        console.log('Translated to: ' + segmentPointB.toString() + ', result: ' + vec.add(pointsA[pointIndex], segmentPointB).toString());

        if (typeof lastPointIndex === 'undefined') {
          lastPointIndex = pointIndex;
          points.push(vec.add(pointsA[lastPointIndex], segmentPointB));
        } else {
          while (lastPointIndex < pointIndex) {
            lastPointIndex++;
            points.push(vec.add(pointsA[lastPointIndex], segmentPointA));
          }
          points.push(vec.add(pointsA[lastPointIndex], segmentPointB));
        }

        segmentIndex++;
      }

      return points;
  }
}

export function furthestPointIndex(points: number[][], vector: number[]) {
  switch (points.length) {
    case 0:
      throw new Error('Cannot search an empty list of points');

    case 1:
      return 0;

    default:
      let maxIndex = 0;
      let maxLength = vec.projectionLength(points[maxIndex], vector);

      let i = maxIndex + 1;
      let point = points[i];
      let length = vec.projectionLength(point, vector);

      while (length >= maxLength) {
        maxIndex = i;
        maxLength = length;

        i = (i + 1) % points.length;
        point = points[i];
        length = vec.projectionLength(point, vector);
      }

      return maxIndex;
  }
}
