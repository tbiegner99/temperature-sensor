import Getopt from 'node-getopt';
import path from 'path';
import routes from './routes';
import { ConfigProcessor } from './ConfigProcessor';
import { Application } from './Application';

async function run() {
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
  const configProcessor = await ConfigProcessor.createFromFile(
    path.resolve(process.cwd(), options.config)
  );

  const config = await configProcessor.performInitialization();

  new Application(config)
    .addRoutes(routes)
    .start()
    .catch((err) => {
      console.error('Application failed to start', err);
    });
}
run();
