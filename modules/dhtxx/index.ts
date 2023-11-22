const dht = require("./build/Release/dht");
export interface DHTReading {
  temperature: number;
  humidity: number;
}
export interface DHT22 {
  setup(): void;
  teardown(): void;
  readValue(pinNumber: number): Promise<DHTReading>;
}
export const DHTModule: DHT22 = {
  setup: dht.setup,
  teardown: dht.teardown,
  readValue: dht.readValue,
};
