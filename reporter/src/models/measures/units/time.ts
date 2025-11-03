import { Unit } from '../unit';

export type Time = 's' | 'min' | 'h' | 'd';

export class TimeUnit implements Unit<Time> {
    static readonly SECOND = new TimeUnit('s', 'Second', 1, ['sec', 'secs']);
    static readonly MINUTE = new TimeUnit('min', 'Minute', 60);
    static readonly HOUR = new TimeUnit('h', 'Hour', 3600, ['hr']);
    static readonly DAY = new TimeUnit('d', 'Day', 86400, ['day']);

    static readonly SUPPORTED_UNITS: TimeUnit[] = [
        TimeUnit.SECOND,
        TimeUnit.MINUTE,
        TimeUnit.HOUR,
        TimeUnit.DAY
    ];

    static fromSymbol(symbol: string): Unit<Time> {
        let unit = TimeUnit.SUPPORTED_UNITS.find(
            (u) => u.symbol === symbol || u.aliasSymbols.includes(symbol)
        );
        if (!unit) {
            throw new Error(`Unsupported time unit: ${symbol}`);
        }
        return unit;
    }

    private constructor(
        public readonly symbol: Time,
        public readonly name: string,
        private readonly toSecondsFactor: number,
        private readonly aliasSymbols: string[] = []
    ) {}

    toDisplayString(): string {
        return this.symbol;
    }

    toSeconds(unit: Unit<Time>, value: number): number {
        const targetUnit = TimeUnit.SUPPORTED_UNITS.find((u) => u.symbol === unit.symbol);
        if (!targetUnit) {
            throw new Error(`Unsupported time unit: ${unit.symbol}`);
        }
        return value * targetUnit.toSecondsFactor;
    }

    convertTo(unit: Unit<Time>, value: number): number {
        if (!unit || unit.symbol === this.symbol) {
            return value;
        }
        const seconds = this.toSeconds(unit, value);
        const targetUnit = TimeUnit.SUPPORTED_UNITS.find((u) => u.symbol === unit.symbol);
        if (!targetUnit) {
            throw new Error(`Unsupported time unit: ${unit.symbol}`);
        }
        return seconds / targetUnit.toSecondsFactor;
    }
}
