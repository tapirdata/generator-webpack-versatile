import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import yargs from 'yargs';

const envNames = [
  'development',
  'testing',
  'production',
];

const configBase = './config';

function guessEnv(preName) {
  let envName;
  if (!preName) {
    envName = envNames[0];
  } else {
    for (const name of envNames) {
      if (name.startsWith(preName)) {
        envName = name;
        break;
      }
    }
    if (!envName) {
      throw(new Error(`invalid mode "${preName}"`));
    }
  }
  return envName;
}


function readConf(config, envName) {
  const confs = [];
  for (const name of [envName, 'default']) {
    const confPath = path.join(configBase, name) + '.json';
    let confText;
    try {
      confText = fs.readFileSync(confPath);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(`No such config file: "${confPath}".`);
      continue;
    }
    const conf = JSON.parse(confText);
    confs.push(conf);
  }
  _.defaultsDeep(config, ...confs);
}

function configFactory() {
  let argv = yargs.argv;
  const envName = guessEnv(process.env.NODE_ENV || argv.env);
  const mode = {
    ['is' + _.capitalize(envName)]: true
  };
  const config = {
    mode
  };
  readConf(config, envName);
  return config;
}

export default configFactory;


