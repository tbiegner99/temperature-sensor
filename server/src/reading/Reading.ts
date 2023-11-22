export class Reading {
  constructor(private _name, private _value, private _unit) {}
  

  get name() {
    return this._name;
  }

  get value() {
    return this._value;
  }

  get unit() {
    return this._unit;
  }
}

