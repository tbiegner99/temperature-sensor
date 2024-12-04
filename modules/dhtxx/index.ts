const dht = require("bindings")("dht"); 
export interface DHTReading {
  temperature: number;
  humidity: number;
}
export interface DHT22 {
  setup(): void;
  teardown(): void;
  readValue(pinNumber: number): Promise<DHTReading>;
}
export const DHTModule: DHT22 = dht;
