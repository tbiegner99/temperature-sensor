import { Reporter } from "./Reporter";
import { Formatter } from "./formatter/DefaultFormatter";
import { FormatterFactory } from "./formatter/FormatterFactory";


export class LoggerReporter extends Reporter {
  formatters:Formatter[];
  constructor(public config : any, public env :any) {
    super();
  
  }

  async init() {
    this.formatters = this.config.formatters
    ?await  new FormatterFactory(this.config.formatters).constructFormatters()
    : [];
  }

  formatReading(reading) {
    for (let i = 0; i < this.formatters.length; i++) {
      if (this.formatters[i].appliesTo(reading)) {
        return this.formatters[i].format(reading);
      }
    }
    return new Formatter().format(reading);
  }

  reportReading(reading) {
    console.log(this.formatReading(reading));
  }
}

