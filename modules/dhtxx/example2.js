const {DHTModule :DHT} = require("./index.js");

const GPIO4 = 2;

const run = async () => {
  DHT.setup();
  const start = new Date();
  console.log("Started collecting at: "+start.toISOString())
  while(true) {
    try {
      const { temperature, humidity } = await DHT.readValue(GPIO4);
      const duration = new Date().valueOf()-start.valueOf()
      console.log({
        time: new Date().toISOString(),
        duration: `${Math.floor(duration/60000)} min ${Math.floor(duration/1000)%60} sec`,
        humidity: `${humidity}%`,
        celcius: `${temperature}`,
        farenheight: `${(9 / 5) * temperature + 32}`,
      });
    } catch (err) {
      console.log("Error");
      console.log(err);
    }
    await new Promise(resolve=>setTimeout(resolve,2000))
  }
};

run();
