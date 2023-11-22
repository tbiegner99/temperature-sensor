export class Reading {
  constructor(private _type, private _value, private _unit) {}

  get type() {
    return this._type;
  }

  get value() {
    return this._value;
  }

  get unit() {
    return this._unit;
  }
}
