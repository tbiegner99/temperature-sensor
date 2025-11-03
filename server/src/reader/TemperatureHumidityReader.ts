import { DHTModule } from '@tbiegner99/dhtxx';
import { HumidityReading } from '../reading/HumidityReading';
import { TemperatureReading } from '../reading/TemperatureReading';
import { Reader } from './Reader';
import { Reading, Reporter } from '@tbiegner99/reporter';

export class TemperatureHumidityReader extends Reader<any> {
  pinNumber: number;
  paused: boolean;
  constructor(pinNumber: number, reporters?: Reporter[]) {
    super(reporters);
    this.pinNumber = pinNumber;
    this.paused = false;
  }

  async takeReadings(): Promise<Reading<any>[]> {
    try {
      const { temperature, humidity } = await DHTModule.readValue(this.pinNumber);
      return [new HumidityReading(humidity), new TemperatureReading(temperature)];
    } catch (err) {
      throw new Error(
        `An error occurred while reading temperature on pin ${this.pinNumber}: \n${err.message}`
      );
    }
  }
}
