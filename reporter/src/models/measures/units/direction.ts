import { Unit, Value } from '../unit';

export type Direction = 'compass' | 'degrees' | 'radians';

export const CompassDirections = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW'
];

export class DirectionUnit implements Unit<Direction> {
    static COMPASS: DirectionUnit = new DirectionUnit('compass', 'Compass', [...CompassDirections]);
    static DEGREES: DirectionUnit = new DirectionUnit('degrees', 'Degrees', [
        '°',
        'deg',
        'degT',
        'degree_(angle)'
    ]);
    static RADIANS: DirectionUnit = new DirectionUnit('radians', 'Radians');
    static SUPPORTED_UNITS: DirectionUnit[] = [
        DirectionUnit.COMPASS,
        DirectionUnit.DEGREES,
        DirectionUnit.RADIANS
    ];

    static fromSymbol(symbol: string): Unit<Direction> {
        let unit = DirectionUnit.SUPPORTED_UNITS.find(
            (u) => u.symbol === symbol || u.aliasSymbols.includes(symbol)
        );
        if (!unit) {
            throw new Error(`Unsupported direction unit: ${symbol}`);
        }
        return unit;
    }

    static fromCompassDirection(direction: string): Value<Direction> {
        const index = CompassDirections.indexOf(direction);
        if (index === -1) {
            throw new Error(`Invalid compass direction: ${direction}`);
        }
        return new Value(index, DirectionUnit.COMPASS);
    }

    static toCompassDirection(value?: Value<Direction>): string {
        if (!value) {
            return '';
        }
        if (value.unit.symbol !== 'compass') {
            value = value.convertTo(DirectionUnit.COMPASS);
        }
        const index = Math.round(value.value) % CompassDirections.length;
        return CompassDirections[index];
    }

    private constructor(
        public readonly symbol: Direction,
        public readonly name: string,
        private readonly aliasSymbols: string[] = []
    ) {}

    toDisplayString(): string {
        if (this.symbol === 'compass') {
            return '';
        }
        return '°';
    }

    toDegrees(unit: Unit<Direction>, value: number): number {
        if (!unit || unit.symbol === 'degrees') {
            return value;
        } else if (unit.symbol === 'radians') {
            return (value * 180) / Math.PI;
        } else if (unit.symbol === 'compass') {
            const index = value;
            const sliceWidth = 360 / CompassDirections.length;
            return index * sliceWidth;
        }
        throw new Error(`Unsupported direction unit: ${unit.symbol}`);
    }

    convertTo(unit: Unit<Direction>, value: number): number {
        if (!unit || unit.symbol === this.symbol) {
            return value;
        }
        const degrees = this.toDegrees(unit, value);
        if (unit.symbol === 'degrees') {
            return degrees;
        } else if (unit.symbol === 'radians') {
            return (degrees * Math.PI) / 180;
        } else if (unit.symbol === 'compass') {
            const sliceWidth = 360 / CompassDirections.length;
            const normalizedAngle = (degrees + sliceWidth / 2) % 360;
            return Math.floor(normalizedAngle / sliceWidth);
        }
        throw new Error(`Unsupported direction unit: ${unit.symbol}`);
    }
}
