import { Unit } from '../unit';

export type Pressure =
    | 'Pa'
    | 'hPa'
    | 'kPa'
    | 'MPa'
    | 'bar'
    | 'mbar'
    | 'psi'
    | 'atm'
    | 'inHg'
    | 'mmHg';
export class PressureUnit implements Unit<Pressure> {
    static PASCAL: PressureUnit = new PressureUnit('Pa', 'Pascal', 1);
    static HECTOPASCAL: PressureUnit = new PressureUnit('hPa', 'Hectopascal', 100);
    static KILOPASCAL: PressureUnit = new PressureUnit('kPa', 'Kilopascal', 1000);
    static MEGAPASCAL: PressureUnit = new PressureUnit('MPa', 'Megapascal', 1_000_000);
    static BAR: PressureUnit = new PressureUnit('bar', 'Bar', 100_000);
    static MILLIBAR: PressureUnit = new PressureUnit('mbar', 'Millibar', 100, ['mb', 'millibar']);
    static PSI: PressureUnit = new PressureUnit('psi', 'Pound per Square Inch', 6894.76);
    static ATMOSPHERE: PressureUnit = new PressureUnit('atm', 'Atmosphere', 101_325);
    static MILLIMETER_OF_MERCURY: PressureUnit = new PressureUnit(
        'mmHg',
        'Millimeter of Mercury',
        133.322
    );
    static INCH_OF_MERCURY: PressureUnit = new PressureUnit('inHg', 'Inch of Mercury', 3386.39);

    static SUPPORTED_UNITS: PressureUnit[] = [
        PressureUnit.PASCAL,
        PressureUnit.HECTOPASCAL,
        PressureUnit.KILOPASCAL,
        PressureUnit.MEGAPASCAL,
        PressureUnit.BAR,
        PressureUnit.MILLIBAR,
        PressureUnit.PSI,
        PressureUnit.ATMOSPHERE,
        PressureUnit.MILLIMETER_OF_MERCURY,
        PressureUnit.INCH_OF_MERCURY
    ];

    static fromSymbol(symbol: string): Unit<Pressure> {
        let unit = PressureUnit.SUPPORTED_UNITS.find(
            (u) => u.symbol === symbol || u.aliasSymbols.includes(symbol)
        );
        if (!unit) {
            throw new Error(`Unsupported pressure unit: ${symbol}`);
        }
        return unit;
    }

    private constructor(
        public readonly symbol: Pressure,
        public readonly name: string,
        private readonly toPascalsFactor: number,
        private readonly aliasSymbols: string[] = []
    ) {}

    toDisplayString(): string {
        return this.symbol;
    }

    toPascals(unit: Unit<Pressure>, value: number): number {
        const targetUnit = PressureUnit.SUPPORTED_UNITS.find((u) => u.symbol === unit.symbol);
        if (!targetUnit) {
            throw new Error(`Unsupported pressure unit: ${unit.symbol}`);
        }
        return value * targetUnit.toPascalsFactor;
    }

    convertTo(unit: Unit<Pressure>, value: number): number {
        if (!unit || unit.symbol === this.symbol) {
            return value;
        }
        const pascals = this.toPascals(this, value);
        const targetUnit = PressureUnit.SUPPORTED_UNITS.find((u) => u.symbol === unit.symbol);
        if (!targetUnit) {
            throw new Error(`Unsupported pressure unit: ${unit.symbol}`);
        }
        return pascals / targetUnit.toPascalsFactor;
    }
}
