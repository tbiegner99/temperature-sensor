import { Reading } from '../../models';

export class Formatter {
  appliesTo(reading: Reading<any>): boolean {
    return true;
  }

  format(reading: Reading<any>): string {
    return `${reading.type}: ${reading.reading.toDisplayString(2)}`;
  }
}
