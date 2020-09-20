const dht=require("./build/Release/dht.node")


module.exports = {
    setup: dht.setup,
    teardown:dht.teardown,
    readValue:dht.readValue
}