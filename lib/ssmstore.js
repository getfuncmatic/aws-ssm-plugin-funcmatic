const awsParamStore = require( 'aws-param-store')

class SSMStorePlugin {
  
  constructor() {
    this.name = 'ssm'
    this.cachedDb = null
    this.cache = false
  }
  
  async start(conf) {
    this.name == conf.name || this.name
    this.conf = conf
    this.path = conf.path
    this.region = conf.region
    this.params = paramsToHash(this.path, await awsParamStore.getParametersByPath(this.path, { region: this.region }))
    for (var name in this.params) {
      process.env[name] = this.params[name]
    }
    return this.params
  }
  
  async request(event, context) {
    context[this.name] = this.params
    return { event, context }
  }
}

module.exports = new SSMStorePlugin()

// [ { Name: '/Funcmatic/dev/SSMStorePlugin/VARIABLE_A',
//         Type: 'String',
//         Value: 'value-a',
//         Version: 1 },
//       { Name: '/Funcmatic/dev/SSMStorePlugin/VARIABLE_B',
//         Type: 'String',
//         Value: 'value-b',
//         Version: 1 } ]
        
function paramsToHash(path, params) {
  var h = { }
  for (var param of params) {
    var name = param.Name.replace(path, '')
    if (name.startsWith('/')) {
      name = name.substring(1)
    }
    h[name] = param.Value
  }
  return h
}
//https://github.com/vandium-io/aws-param-store

// awsParamStore.getParametersByPath( '/project1/service1/production' )
//     .then( (parameters) => {

//         // do something here
//     });
    

// awsParamStore.getParametersByPath( '/project1/service1/production', { region: 'us-east-1' } )
//     .then( (parameters) => {

//         // do something here
//     });
    
    