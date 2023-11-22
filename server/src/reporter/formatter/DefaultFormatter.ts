export class Formatter {
  appliesTo(reading) : boolean {
    return true;
  }

  format(reading) : string {
    return `${reading.name}: ${reading.value}`;
  }
}

