import { Unit } from '../unit';

export type Percent = '%' | '‰' | '';

export class PercentUnit implements Unit<Percent> {
    static readonly PERCENT = new PercentUnit('%', 'Percent', 0.01, ['pct', 'percent']);
    static readonly PERMILLE = new PercentUnit('‰', 'Permille', 0.001, []);
    static readonly DECIMAL = new PercentUnit('', 'Fraction', 1, []);
    static readonly SUPPORTED_UNITS: PercentUnit[] = [
        PercentUnit.PERCENT,
        PercentUnit.PERMILLE,
        PercentUnit.DECIMAL
    ];

    static fromSymbol(symbol: string): Unit<Percent> {
        let unit = PercentUnit.SUPPORTED_UNITS.find(
            (u) => u.symbol === symbol || u.aliasSymbols.includes(symbol)
        );
        if (!unit) {
            throw new Error(`Unsupported percent unit: ${symbol}`);
        }
        return unit;
    }

    private constructor(
        public readonly symbol: Percent,
        public readonly name: string,
        private readonly toDecimalFactor: number,
        private readonly aliasSymbols: string[]
    ) {}

    toDisplayString(): string {
        return this.symbol;
    }

    toDecimal(unit: Unit<Percent>, value: number): number {
        const targetUnit = PercentUnit.SUPPORTED_UNITS.find((u) => u.symbol === unit.symbol);
        if (!targetUnit) {
            throw new Error(`Unsupported percent unit: ${unit.symbol}`);
        }
        return value * targetUnit.toDecimalFactor;
    }

    convertTo(unit: Unit<Percent>, value: number): number {
        if (!unit || unit.symbol === this.symbol) {
            return value;
        }
        const decimal = this.toDecimal(unit, value);
        const targetUnit = PercentUnit.SUPPORTED_UNITS.find((u) => u.symbol === unit.symbol);
        if (!targetUnit) {
            throw new Error(`Unsupported percent unit: ${unit.symbol}`);
        }
        return decimal / targetUnit.toDecimalFactor;
    }
}
