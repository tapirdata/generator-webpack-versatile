import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import { Readable } from 'stream';
import VinylFile from 'vinyl';
import Modernizr from 'modernizr';

export default function() {
  return function(options) {
    if (!options) { options = {}; }
    let { configPath } = options;
    if (configPath === 'ALL') {
      let modernizrDir = path.dirname(require.resolve('modernizr'));
      configPath = path.join(modernizrDir, 'config-all.json');
    }
    let outStream = new Readable({objectMode: true});
    let buildStarted = false;
    outStream._read = function() {
      if (buildStarted) {
        return outStream.push(null);
      } else {
        let config;
        if (configPath) { 
          try {
            config = JSON.parse(fs.readFileSync(configPath));
          } catch (error) {
            throw `Cannot find Modernizer config file '${configPath}': ${error}`;
          }
        } else {
          config = {};
        }
        if (options.config) {
          _.merge(config, options.config);
        }
        buildStarted = true;
        return Modernizr.build(config, function(output) {
          let outFile = new VinylFile({
            path: 'modernizr.js',
            contents: new Buffer(output)
          });
          return outStream.push(outFile);
        }
        );
      }
    };
    return outStream;
  };
}



