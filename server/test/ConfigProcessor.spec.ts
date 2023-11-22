import axios from 'axios';
import { describe, expect, it, beforeEach } from '@jest/globals';
import { ConfigProcessor } from '../src/ConfigProcessor';
import { LoggerReporter } from '../src/reporter/LoggerReporter';
import { CurrentStatusReporter } from '../src/reporter/CurrentStatusReporter';
import { DatabaseReporter } from '../src/reporter/DatabaseReporter';
import { HumidityFormatter } from '../src/reporter/formatter/HumidityFormatter';
import { TemperatureFormatter } from '../src/reporter/formatter/TemperatureFormatter';
import serviceInstance from '../src/service/CurrentConditionsManager';

describe('Config Processor', () => {
  describe('Defaults', () => {
    let result;
    beforeEach(async () => {
      const testConfig = {};
      result = await new ConfigProcessor(testConfig).performInitialization();
    });

    it('returns correct context root', () => {
      expect(result.contextRoot).toEqual('/api');
    });

    it('returns correct context root', () => {
      expect(result.appPort).toEqual(8080);
    });

    it('returns empty list of reporters', () => {
      expect(result.reporters).toEqual([]);
    });
  });
  describe('Basic config attributes', () => {
    let result;
    beforeEach(async () => {
      const testConfig = {
        contextRoot: '/root',
        appPort: 8181,
      };
      result = await new ConfigProcessor(testConfig).performInitialization();
    });

    it('returns correct context root', () => {
      expect(result.contextRoot).toEqual('/root');
    });

    it('returns correct context root', () => {
      expect(result.appPort).toEqual(8181);
    });

    it('returns empty list of reporters', () => {
      expect(result.reporters).toEqual([]);
    });
  });

  describe('reporter generation', () => {
    let result;
    describe('logger reporter', () => {
      describe('when no configuration', () => {
        beforeEach(async () => {
          const testConfig = {
            reporters: {
              logger: {},
            },
          };
          result = await new ConfigProcessor(testConfig).performInitialization();
        });
        it('returns exactly one reporter that is a logger reporter', () => {
          expect(result.reporters).toHaveLength(1);
          expect(result.reporters[0]).toBeInstanceOf(LoggerReporter);
        });

        it('has no formatters', () => {
          expect(result.reporters[0].formatters).toEqual([]);
        });
      });

      describe('with temp and humidity formatters', () => {
        beforeEach(async () => {
          const testConfig = {
            reporters: {
              logger: {
                formatters: {
                  temperature: {},
                  humidity: {},
                },
              },
            },
          };
          result = await new ConfigProcessor(testConfig).performInitialization();
        });
        it('has temperature and humidity formatter', () => {
          expect(result.reporters[0].formatters).toHaveLength(2);
          expect(result.reporters[0].formatters[0]).toBeInstanceOf(TemperatureFormatter);
          expect(result.reporters[0].formatters[1]).toBeInstanceOf(HumidityFormatter);
        });
        it('converts temp to celcius by default', () => {
          expect(result.reporters[0].formatters[0].unit).toEqual('C');
        });
      });

      describe('with temp formatters', () => {
        ['k', 'c', 'f', null, 'C', 'K', 'F', undefined].forEach((validUnit) => {
          describe(`with valid unit ${validUnit}`, () => {
            beforeEach(async () => {
              const testConfig = {
                reporters: {
                  logger: {
                    formatters: {
                      temperature: {
                        unit: validUnit,
                      },
                    },
                  },
                },
              };
              result = await new ConfigProcessor(testConfig).performInitialization();
            });
            it('has temperature anformatter', () => {
              expect(result.reporters[0].formatters).toHaveLength(1);
              expect(result.reporters[0].formatters[0]).toBeInstanceOf(TemperatureFormatter);
            });
            it(`formatter unit is ${validUnit}`, () => {
              const expectedUnit = !validUnit ? 'C' : validUnit.toUpperCase();
              expect(result.reporters[0].formatters[0].unit).toEqual(expectedUnit);
            });
          });
        });
      });
    });

    describe('current status reporter', () => {
      beforeEach(async () => {
        const testConfig = {
          reporters: {
            currentStatus: {},
          },
        };
        result = await new ConfigProcessor(testConfig).performInitialization();
      });
      it('returns exactly one reporter that is a logger reporter', () => {
        expect(result.reporters).toHaveLength(1);
        expect(result.reporters[0]).toBeInstanceOf(CurrentStatusReporter);
      });
      it('has instance of current status manager', () => {
        expect(result.reporters[0].currentStatusManager).toEqual(serviceInstance);
      });
    });

    describe('database reporter', () => {
      beforeEach(async () => {
        process.env.ZONE_NAME = 'zone_name';
        process.env.ZONE_DESCRIPTION = 'zone_desc';
        const testConfig = {
          reporters: {
            database: {
              host: 'host',
            },
          },
        };
        result = await new ConfigProcessor(testConfig).performInitialization();
      });
      it('returns exactly one reporter that is a Database reporter', () => {
        expect(result.reporters).toHaveLength(1);
        expect(result.reporters[0]).toBeInstanceOf(DatabaseReporter);
      });
      it('has instance of current status manager', () => {
        expect(result.reporters[0].reporterHost).toEqual('host');
        expect(result.reporters[0].httpClient).toEqual(axios);
        expect(result.reporters[0].zoneName).toEqual('zone_name');
        expect(result.reporters[0].zoneDescription).toEqual('zone_desc');
      });
    });
  });
});
