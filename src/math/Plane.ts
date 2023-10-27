import { Vector3 } from "./Vector3";

export interface Plane {
  normal: Vector3;
  distance: number;
  intersect(start: Vector3, direction: Vector3): Vector3 | undefined;
}

const A_Far_Away_Distance = 1_000_000;

const PlaneProto = {
  intersect(
    this: Plane,
    start: Vector3,
    direction: Vector3
  ): Vector3 | undefined {
    const delta = direction.clone().multiply(A_Far_Away_Distance);

    const denominator = this.normal.dotProduct(delta);

    if (denominator === 0) {
      // line is coplanar, return origin
      // if (this.distanceToPoint(line.start) === 0) {
      //   return target.copy(line.start);
      // }

      // Unsure if this is the correct method to handle this case.
      return undefined;
    }

    const t = -(start.dotProduct(this.normal) + this.distance) / denominator;
    // const t = - ( line.start.dot( this.normal ) + this.constant ) / denominator;

    if (t < 0 || t > 1) {
      return undefined;
    }

    return start.clone().add(delta.clone().multiply(t));
  },
};

export function Plane(normal: Vector3, distance: number): Plane {
  return Object.assign(Object.create(PlaneProto), { normal, distance });
}
