"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DHTModule = void 0;
const dht = require("./build/Release/dht");
exports.DHTModule = {
    setup: dht.setup,
    teardown: dht.teardown,
    readValue: dht.readValue,
};
