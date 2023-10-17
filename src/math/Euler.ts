import { Matrix4x4 } from "./Matrix4x4";

const _matrix = /*@__PURE__*/ Matrix4x4();

export enum EulerOrder {
  XYZ = "XYZ",
  ZYX = "ZYX",
  DEFAULT_ORDER = XYZ,
}

class Euler {
  public isEuler = true;

  constructor(
    private _x = 0,
    private _y = 0,
    private _z = 0,
    private _order: EulerOrder = EulerOrder.DEFAULT_ORDER
  ) {}

  get x() {
    return this._x;
  }

  set x(value) {
    this._x = value;
    // this._onChangeCallback();
  }

  get y() {
    return this._y;
  }

  set y(value) {
    this._y = value;
    // this._onChangeCallback();
  }

  get z() {
    return this._z;
  }

  set z(value) {
    this._z = value;
    // this._onChangeCallback();
  }

  get order() {
    return this._order;
  }

  set order(value) {
    this._order = value;
    // this._onChangeCallback();
  }

  //   set(x, y, z, order = this._order) {
  //     this._x = x;
  //     this._y = y;
  //     this._z = z;
  //     this._order = order;

  //     // this._onChangeCallback();

  //     return this;
  //   }

  //   clone() {
  //     return new Euler(this._x, this._y, this._z, this._order);
  //   }

  //   copy(euler: Euler) {
  //     this._x = euler._x;
  //     this._y = euler._y;
  //     this._z = euler._z;
  //     this._order = euler._order;

  //     // this._onChangeCallback();

  //     return this;
  //   }

  setFromRotationMatrix(m: Matrix4x4, order: EulerOrder = this._order) {
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    const te = m.elements;
    const m11 = te[0],
      m12 = te[4],
      m13 = te[8];
    const m21 = te[1],
      m22 = te[5],
      m23 = te[9];
    const m31 = te[2],
      m32 = te[6],
      m33 = te[10];

    switch (order) {
      case EulerOrder.XYZ:
        this._y = Math.asin(clamp(m13, -1, 1));

        if (Math.abs(m13) < 0.9999999) {
          this._x = Math.atan2(-m23, m33);
          this._z = Math.atan2(-m12, m11);
        } else {
          this._x = Math.atan2(m32, m22);
          this._z = 0;
        }

        break;

      //   case "YXZ":
      //     this._x = Math.asin(-clamp(m23, -1, 1));

      //     if (Math.abs(m23) < 0.9999999) {
      //       this._y = Math.atan2(m13, m33);
      //       this._z = Math.atan2(m21, m22);
      //     } else {
      //       this._y = Math.atan2(-m31, m11);
      //       this._z = 0;
      //     }

      //     break;

      //   case "ZXY":
      //     this._x = Math.asin(clamp(m32, -1, 1));

      //     if (Math.abs(m32) < 0.9999999) {
      //       this._y = Math.atan2(-m31, m33);
      //       this._z = Math.atan2(-m12, m22);
      //     } else {
      //       this._y = 0;
      //       this._z = Math.atan2(m21, m11);
      //     }

      //     break;

      case EulerOrder.ZYX:
        this._y = Math.asin(-clamp(m31, -1, 1));

        if (Math.abs(m31) < 0.9999999) {
          this._x = Math.atan2(m32, m33);
          this._z = Math.atan2(m21, m11);
        } else {
          this._x = 0;
          this._z = Math.atan2(-m12, m22);
        }

        break;

      //   case "YZX":
      //     this._z = Math.asin(clamp(m21, -1, 1));

      //     if (Math.abs(m21) < 0.9999999) {
      //       this._x = Math.atan2(-m23, m22);
      //       this._y = Math.atan2(-m31, m11);
      //     } else {
      //       this._x = 0;
      //       this._y = Math.atan2(m13, m33);
      //     }

      //     break;

      //   case "XZY":
      //     this._z = Math.asin(-clamp(m12, -1, 1));

      //     if (Math.abs(m12) < 0.9999999) {
      //       this._x = Math.atan2(m32, m22);
      //       this._y = Math.atan2(m13, m11);
      //     } else {
      //       this._x = Math.atan2(-m23, m33);
      //       this._y = 0;
      //     }

      //     break;

      //   default:
      //     console.warn(
      //       "THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " +
      //         order
      //     );
    }

    this._order = order;

    // if (update === true) this._onChangeCallback();

    return this;
  }

  //   setFromVector3(v, order = this._order) {
  //     return this.set(v.x, v.y, v.z, order);
  //   }

  //   reorder(newOrder) {
  //     // WARNING: this discards revolution information -bhouston

  //     _quaternion.setFromEuler(this);

  //     return this.setFromQuaternion(_quaternion, newOrder);
  //   }

  //   equals(euler) {
  //     return (
  //       euler._x === this._x &&
  //       euler._y === this._y &&
  //       euler._z === this._z &&
  //       euler._order === this._order
  //     );
  //   }

  //   fromArray(array) {
  //     this._x = array[0];
  //     this._y = array[1];
  //     this._z = array[2];
  //     if (array[3] !== undefined) this._order = array[3];

  //     this._onChangeCallback();

  //     return this;
  //   }

  //   toArray(array = [], offset = 0) {
  //     array[offset] = this._x;
  //     array[offset + 1] = this._y;
  //     array[offset + 2] = this._z;
  //     array[offset + 3] = this._order;

  //     return array;
  //   }

  //   _onChange(callback) {
  //     this._onChangeCallback = callback;

  //     return this;
  //   }

  //   _onChangeCallback() {}

  //   *[Symbol.iterator]() {
  //     yield this._x;
  //     yield this._y;
  //     yield this._z;
  //     yield this._order;
  //   }
}

export { Euler };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
