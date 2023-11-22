import { Reading } from '../../reading/Reading';

export class Formatter {
  appliesTo(reading: Reading): boolean {
    return true;
  }

  format(reading: Reading): string {
    return `${reading.type}: ${reading.value}`;
  }
}
