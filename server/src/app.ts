const Getopt = require('node-getopt');
const path = require('path');
const routes = require('./routes');
const ConfigProcessor = require('./ConfigProcessor');
const Application = require('./Application');

// Getopt arguments options
//   '=':   has argument
//   '[=]': has argument but optional
//   '+':   multiple option supported
const getopt = new Getopt([
  ['c', 'config=', 'location of the configuration file'],
  ['h', 'help'],
]).bindHelp();

const { options } = getopt.parse(process.argv.slice(2));

if (!options.config) {
  console.error('Config file is required. Pass --config');
  process.exit(1);
}
const configProcessor = ConfigProcessor.createFromFile(path.resolve(process.cwd(), options.config));

const config = configProcessor.performInitialization();

new Application(config)
  .addRoutes(routes)
  .start()
  .catch((err) => {
    console.error('Application failed to start', err);
  });
