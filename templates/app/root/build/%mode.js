

export default function(nodeEnv) {
  nodeEnv = nodeEnv || process.env.NODE_ENV || '';

  let isProduction = false;
  let isTesting = false;
  let isDevelopment = false;
  if (nodeEnv.match(/^prod/)) {
    isProduction = true;
    nodeEnv = 'production';
  } else if (nodeEnv.match(/^test/)) {
    isTesting = true;
    nodeEnv = 'testing';
  } else {
    isDevelopment = true;
    nodeEnv = 'development';
  }

  process.env.NODE_ENV = nodeEnv;
  
  return {
    isProduction,
    isTesting,
    isDevelopment
  };
};


