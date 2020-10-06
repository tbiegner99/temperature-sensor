class Reading {
  constructor(name, value, unit) {
    this._name = name;
    this._value = value;
    this._unit = unit || '';
  }

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

module.exports = Reading;
