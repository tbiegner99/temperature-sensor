export interface Unit<T> {
  symbol: T;
  convertTo(unit: Unit<T>, value: number): number;
  toString(): string;
  toDisplayString(): string;
}

export const Unitless: Unit<void> = {
  symbol: null,
  convertTo(unit: Unit<void>, value: number): number {
    return value;
  },
  toString(): string {
    return '';
  },
  toDisplayString(): string {
    return '';
  },
};

export class Value<T> {
  value: number;
  unit: Unit<T>;

  constructor(value: number, unit: Unit<T>) {
    this.value = value;
    this.unit = unit;
  }

  static fromString<T>(value: string, unit: Unit<T>): Value<T> | undefined {
    const parsedValue = parseFloat(value);

    return Value.from(parsedValue, unit);
  }

  static from<T>(value: number, unit: Unit<T>): Value<T> | undefined {
    if (isNaN(value)) {
      return undefined;
    }
    return new Value(value, unit);
  }

  add(other: Value<T>): Value<T> {
    if (this.unit.symbol !== other.unit.symbol) {
      throw new Error(
        `Cannot add values with different units: ${this.unit.symbol} and ${other.unit.symbol}`
      );
    }
    return new Value(this.value + other.value, this.unit);
  }

  divide(divisor: number): Value<T> {
    return new Value(this.value / divisor, this.unit);
  }

  convertTo(unit: Unit<T>): Value<T> {
    const newValue = this.unit.convertTo(unit, this.value);
    return new Value(newValue, unit);
  }

  toDisplayString(places = 1): string {
    return `${this.value.toFixed(places)} ${this.unit.toDisplayString()}`;
  }

  toString(): string {
    return `${this.value} ${this.unit.toString()}`;
  }
}

export interface Reading<T> {
  timestamp: Date;
  reading: Value<T>;
  type: string;
}
