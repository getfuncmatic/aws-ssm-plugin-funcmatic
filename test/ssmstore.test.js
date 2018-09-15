require('dotenv').config()
var funcmatic = require('@funcmatic/funcmatic')
var SSMStorePlugin = require('../lib/ssmstore')

describe('Request', () => {
  beforeEach(async () => {
    funcmatic = funcmatic.clone()
    console.log("getplugins", funcmatic.plugins)
  })
  afterEach(async () => {
    await funcmatic.teardown()
    funcmatic.clear()
  })
  it ('IAM external-user should not have permission /Funcmatic/*', async () => {
    funcmatic.use(SSMStorePlugin, {
      path: '/Funcmatic/dev/SSMStorePlugin',
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
      region: process.env.region,
    })
    var event = { }
    var context = { }
    var error = null
    try {
      await funcmatic.invoke(event, context, async (event, context, { ssm }) => {
        // SSMStorePulgin should throw error in start before we get here
      })  
    } catch (err) {
      error = err 
    }
    expect(error.code).toBe("AccessDeniedException")
  })
  it ('IAM external-user should get parameters from /External/*', async () => {
    funcmatic.use(SSMStorePlugin, {
      path: '/External/ssmplugin/DEV',
      accessKeyId: process.env.accessKeyId,
      secretAccessKey: process.env.secretAccessKey,
      region: process.env.region,
    })
    var plugin = funcmatic.getPlugin('ssm')
    var event = { }
    var context = { }
    var error = null

    await funcmatic.invoke(event, context, async (event, context, { ssm }) => {
      expect(ssm).toMatchObject({
        VARIABLE_A: 'value.a',
        VARIABLE_B: 'value.b'
      })
      expect(process.env).toMatchObject(ssm)
    })  
  })
}) 