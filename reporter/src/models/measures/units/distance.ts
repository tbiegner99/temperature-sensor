import { Unit } from '../unit';

export type MetricDistanceUnit = 'mm' | 'cm' | 'm' | 'km';
export type ImperialDistanceUnit = 'in' | 'ft' | 'yd' | 'mi' | 'nmi';
export type Distance = MetricDistanceUnit | ImperialDistanceUnit;

export class DistanceUnit implements Unit<Distance> {
    static MILLIMETER: DistanceUnit = new DistanceUnit('mm', 'Millimeter', 0.001);
    static CENTIMETER: DistanceUnit = new DistanceUnit('cm', 'Centimeter', 0.01);
    static METER: DistanceUnit = new DistanceUnit('m', 'Meter', 1);
    static KILOMETER: DistanceUnit = new DistanceUnit('km', 'Kilometer', 1000);
    static INCH: DistanceUnit = new DistanceUnit('in', 'Inch', 0.0254);
    static FOOT: DistanceUnit = new DistanceUnit('ft', 'Foot', 0.3048);
    static YARD: DistanceUnit = new DistanceUnit('yd', 'Yard', 0.9144);
    static MILE: DistanceUnit = new DistanceUnit('mi', 'Mile', 1609.34);
    static NAUTICAL_MILE: DistanceUnit = new DistanceUnit('nmi', 'Nautical Mile', 1852);
    static SUPPORTED_UNITS: DistanceUnit[] = [
        DistanceUnit.MILLIMETER,
        DistanceUnit.CENTIMETER,
        DistanceUnit.METER,
        DistanceUnit.KILOMETER,
        DistanceUnit.INCH,
        DistanceUnit.FOOT,
        DistanceUnit.YARD,
        DistanceUnit.MILE,
        DistanceUnit.NAUTICAL_MILE
    ];

    static fromSymbol(symbol: string): Unit<Distance> {
        let unit = DistanceUnit.SUPPORTED_UNITS.find(
            (u) => u.symbol === symbol || u.aliasSymbols.includes(symbol)
        );
        if (!unit) {
            throw new Error(`Unsupported distance unit: ${symbol}`);
        }
        return unit;
    }

    private constructor(
        public readonly symbol: Distance,
        public readonly name: string,
        private readonly toMetersFactor: number,
        private readonly aliasSymbols: string[] = []
    ) {}
    toDisplayString(): string {
        return this.symbol;
    }

    toMeters(unit: Unit<Distance>, value: number): number {
        const targetUnit = DistanceUnit.SUPPORTED_UNITS.find((u) => u.symbol === unit.symbol);
        if (!targetUnit) {
            throw new Error(`Unsupported distance unit: ${unit.symbol}`);
        }
        return value * targetUnit.toMetersFactor;
    }

    convertTo(unit: Unit<Distance>, value: number): number {
        if (!unit || unit.symbol === this.symbol) {
            return value;
        }
        const meters = this.toMeters(this, value);
        const targetUnit = DistanceUnit.SUPPORTED_UNITS.find((u) => u.symbol === unit.symbol);
        if (!targetUnit) {
            throw new Error(`Unsupported distance unit: ${unit.symbol}`);
        }
        return meters / targetUnit.toMetersFactor;
    }
}
