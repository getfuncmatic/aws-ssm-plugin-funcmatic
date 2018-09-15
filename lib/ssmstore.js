const awsParamStore = require( 'aws-param-store')

class SSMStorePlugin {
  
  constructor() {
    this.name = 'ssm'
  }
  
  async start(conf) {
    this.name == conf.name || this.name
    this.path = conf.path
    this.awsOptions = {
      accessKeyId: conf.accessKeyId,
      secretAccessKey: conf.secretAccessKey,
      region: conf.region
    }
    var data = await awsParamStore.getParametersByPath(this.path, this.awsOptions)
    this.params = paramsToHash(this.path, data)
    for (var name in this.params) {
      process.env[name] = this.params[name]
    }
    return this.params
  }
  
  async request(event, context) {
    var service = this.params
    return { service }
  }
}

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

module.exports = SSMStorePlugin


//https://github.com/vandium-io/aws-param-store

// awsParamStore.getParametersByPath( '/project1/service1/production' )
//     .then( (parameters) => {

//         // do something here
//     });
    

// awsParamStore.getParametersByPath( '/project1/service1/production', { region: 'us-east-1' } )
//     .then( (parameters) => {

//         // do something here
//     });
    
    