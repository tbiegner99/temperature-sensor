const {DHTModule :DHT} = require("./index.js");

const GPIO4 = 2;

const run = async () => {
  DHT.setup();
  try {
    const { temperature, humidity } = await DHT.readValue(GPIO4);
    console.log({
      humidity: `${humidity}%`,
      celcius: `${temperature}`,
      farenheight: `${(9 / 5) * temperature + 32}`,
    });
  } catch (err) {
    console.log("Error");
    console.log(err);
  }
  DHT.teardown();
};

run();
