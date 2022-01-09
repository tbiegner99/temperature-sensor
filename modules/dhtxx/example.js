const dht = require("./build/Release/dht.node");

const GPIO4 = 4;

const run = async () => {
  dht.setup();
  try {
    const { temperature, humidity } = await dht.readValue(GPIO4);
    console.log({
      humidity: `${humidity}%`,
      celcius: `${temperature}`,
      farenheight: `${(9 / 5) * temperature + 32}`,
    });
  } catch (err) {
    console.log("Error");
    console.log(err);
  }
  dht.teardown();
};

run();
