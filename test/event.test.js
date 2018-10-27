const event = require('../lib/event')
const urllib = require('url')

describe("Basic", async () => {
  var testevent = null
  beforeEach(async () => {
    testevent = createTestEvent()
  })
  it ('should generate correct href', async () => {
    var href = event.toHref(testevent)
    expect(href).toBe("https://host.com/path")

    // query parameters
    testevent.queryStringParameters = { "hello": "world" }
    href = event.toHref(testevent)
    expect(href).toBe("https://host.com/path?hello=world")

    // different port
    testevent.headers['X-Forwarded-Port'] = "8000"
    href = event.toHref(testevent)
    expect(href).toBe("https://host.com:8000/path?hello=world")

  })
  it ('should generate a URL object', async () => {
    var url = event.toUrl(testevent)
    expect(url).toEqual(new urllib.URL("https://host.com/path"))

    // query parameters
    testevent.queryStringParameters = { "hello": "world" }
    url = event.toUrl(testevent)
    expect(url).toEqual(new urllib.URL("https://host.com/path?hello=world"))
  })
  it ('should generate request options', async () => {
    var options = event.toOptions(testevent)
    expect(options).toMatchObject({
      protocol: 'https:',
      hostname: 'host.com',
      hash: '',
      search: '',
      pathname: '/path',
      path: '/path',
      headers: { 
        'Host': 'host.com',
        'X-Forwarded-Port': '443',
        'X-Forwarded-Proto': 'https' 
      },
      method: 'GET' 
    })
    
    // query parameters
    testevent.queryStringParameters = { "hello": "world" }
    options = event.toOptions(testevent)
    expect(options).toMatchObject({
      search: '?hello=world',
      pathname: '/path',
      path: '/path?hello=world'
    })

    // post body
    testevent.httpMethod = "POST"
    testevent.body = JSON.stringify({"foo": "bar"})
    options = event.toOptions(testevent)
    expect(options).toMatchObject({
      search: '?hello=world',
      pathname: '/path',
      path: '/path?hello=world',
      body: JSON.stringify({"foo": "bar"}),
      method: "POST"
    })
  })
})


function createTestEvent() {
  return {
    "path": "/path",
    "httpMethod": "GET",
    "headers": {
        "Host": "host.com",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https",
    },
    "queryStringParameters": null,
    "body": null,
    "isBase64Encoded": false
  }
}