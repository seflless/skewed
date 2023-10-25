import { Vector3 } from "./Vector3";

export interface Plane {
  normal: Vector3;
  distance: number;
  intersect(start: Vector3, direction: Vector3): Vector3 | undefined;
}

const PlaneProto = {
  intersect(
    this: Plane,
    start: Vector3,
    direction: Vector3
  ): Vector3 | undefined {
    const end = start.clone().add(direction.clone().multiply(100000));

    const denom = this.normal.dotProduct(direction);
    if (Math.abs(denom) < 1e-6) {
      // Ray and plane are parallel
      return undefined;
    }

    /*
        start(0,1000,0)

           ^
           | (0,1,0)
        _______

        end(0,-100,0)

        t = start/(end-start[1100])
    */

    const startD = start.dotProduct(this.normal);
    const endD = end.dotProduct(this.normal);
    const t = startD / (endD - startD);
    if (t < 0) {
      // Intersection is behind the ray's origin
      return undefined;
    }
    return start.clone().add(direction.clone().multiply(t));
  },
};

export function Plane(normal: Vector3, distance: number): Plane {
  return Object.assign(Object.create(PlaneProto), { normal, distance });
}
