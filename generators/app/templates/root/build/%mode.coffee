

module.exports = (nodeEnv) ->
  nodeEnv = nodeEnv or process.env.NODE_ENV or ''

  isProduction = false
  isTesting = false
  isDevelopment = false
  if nodeEnv.match /^prod/
    isProduction = true
    nodeEnv = 'production'
  else if nodeEnv.match /^test/
    isTesting = true
    nodeEnv = 'testing'
  else
    isDevelopment = true
    nodeEnv = 'development'

  process.env.NODE_ENV = nodeEnv
  
  isProduction: isProduction
  isTesting: isTesting
  isDevelopment: isDevelopment


