var Funcmatic = require('@funcmatic/funcmatic')
var SSMStorePlugin = require('../lib/ssmstore')


var handler = Funcmatic.wrap(async (event, { ssm }) => {
  console.log("SSM", ssm)
  return {
    statusCode: 200
  }
})

describe('Request', () => {
  beforeEach(() => {
    Funcmatic.clear()
  })
  it ('should send a papertrail log event', async () => {
    Funcmatic.use(SSMStorePlugin, { 
      path: '/Funcmatic/dev/SSMStorePlugin',
      region: 'us-west-2'
    })
    var event = { }
    var context = { }
    var ret = await handler(event, context)
    console.log("RET", ret)
  })
}) 