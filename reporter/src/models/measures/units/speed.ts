import { Unit } from '../unit';

export type Speed = 'm/s' | 'ft/s' | 'kmh' | 'mph';

export class SpeedUnit implements Unit<Speed> {
    static readonly MPS = new SpeedUnit('m/s', 'Meters per second', 1, ['mps', 'm/s', 'm_s-1']);
    static readonly FPS = new SpeedUnit('ft/s', 'Feet per second', 0.3048, [
        'fps',
        'ftps',
        'ft/s',
        'ft_s-1'
    ]);
    static readonly KMH = new SpeedUnit('kmh', 'Kilometers per hour', 0.277778, [
        'kph',
        'km/h',
        'kmph',
        'km_h-1'
    ]);
    static readonly MPH = new SpeedUnit('mph', 'Miles per hour', 0.44704, [
        'mi/h',
        'miph',
        'mi/h-1'
    ]);

    static readonly SUPPORTED_UNITS: SpeedUnit[] = [
        SpeedUnit.MPS,
        SpeedUnit.FPS,
        SpeedUnit.KMH,
        SpeedUnit.MPH
    ];

    static fromSymbol(symbol: string): Unit<Speed> {
        let unit = SpeedUnit.SUPPORTED_UNITS.find(
            (u) => u.symbol === symbol || u.aliasSymbols.includes(symbol)
        );
        if (!unit) {
            throw new Error(`Unsupported speed unit: ${symbol}`);
        }
        return unit;
    }

    private constructor(
        public readonly symbol: Speed,
        public readonly name: string,
        private readonly toMpsFactor: number,
        private readonly aliasSymbols: string[] = []
    ) {}

    toDisplayString(): string {
        return this.symbol;
    }

    toMps(unit: Unit<Speed>, value: number): number {
        const targetUnit = SpeedUnit.SUPPORTED_UNITS.find((u) => u.symbol === unit.symbol);
        if (!targetUnit) {
            throw new Error(`Unsupported speed unit: ${unit.symbol}`);
        }
        return value * targetUnit.toMpsFactor;
    }

    convertTo(unit: Unit<Speed>, value: number): number {
        if (!unit || unit.symbol === this.symbol) {
            return value;
        }
        const mps = this.toMps(this, value);
        const targetUnit = SpeedUnit.SUPPORTED_UNITS.find((u) => u.symbol === unit.symbol);
        if (!targetUnit) {
            throw new Error(`Unsupported speed unit: ${unit.symbol}`);
        }
        return mps / targetUnit.toMpsFactor;
    }
}
