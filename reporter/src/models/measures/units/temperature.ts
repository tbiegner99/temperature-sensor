import { Unit } from '../unit';

export type Temperature = 'C' | 'F' | 'K';

export class TemperatureUnit implements Unit<Temperature> {
    static CELSIUS: TemperatureUnit = new TemperatureUnit('C', 'Celsius', ['degC', '°C']);
    static FAHRENHEIT: TemperatureUnit = new TemperatureUnit('F', 'Fahrenheit', ['degF', '°F']);
    static KELVIN: TemperatureUnit = new TemperatureUnit('K', 'Kelvin', ['K']);

    static SUPPORTED_UNITS: TemperatureUnit[] = [
        TemperatureUnit.CELSIUS,
        TemperatureUnit.FAHRENHEIT,
        TemperatureUnit.KELVIN
    ];

    static fromSymbol(symbol: string): Unit<Temperature> {
        let unit = TemperatureUnit.SUPPORTED_UNITS.find(
            (u) => u.symbol === symbol || u.aliasSymbols.includes(symbol)
        );
        if (!unit) {
            throw new Error(`Unsupported temperature unit: ${symbol}`);
        }
        return unit;
    }

    private constructor(
        public readonly symbol: Temperature,
        public readonly name: string,
        public readonly aliasSymbols: string[] = []
    ) {}

    toDisplayString(): string {
        return `°${this.symbol}`;
    }

    convertTo(unit: Unit<Temperature>, value: number): number {
        if (!unit || unit.symbol === this.symbol) {
            return value;
        }
        if (unit.symbol === 'C') {
            switch (this.symbol) {
                case 'F':
                    return (value * 5) / 9 - 32;
                case 'K':
                    return value - 273.15;
                case 'C':
                    return value;
                default:
                    throw new Error(`Unsupported temperature unit: ${unit.symbol}`);
            }
        }

        var normalizedValue = this.convertTo(TemperatureUnit.CELSIUS, value);
        switch (unit.symbol) {
            case 'F':
                return (normalizedValue * 9) / 5 + 32;
            case 'K':
                return normalizedValue + 273.15;
        }
    }

    toString(): string {
        return this.name;
    }
}
