
const url = require('url');

function toHref(event) {
  return `${event.headers['X-Forwarded-Proto']}://${getHostWithPort(event)}${getPathWithQueryStringParams(event)}`
}

function toUrl(event) {
  return new url.URL(toHref(event))
}

function toOptions(event) {
  var URL = toUrl(event)
  return {
    protocol: URL.protocol,
    hostname: URL.hostname,
    hash: URL.hash,
    search: URL.search,
    pathname: URL.pathname,
    path: `${URL.pathname}${URL.search}`,
    headers: JSON.parse(JSON.stringify(event.headers)),
    method: event.httpMethod,
    body: event.body || null
  }
}

function getHostWithPort(event) {
  var s = `${event.headers['Host']}`
  if (![ "80", "443" ].includes(event.headers['X-Forwarded-Port'])) {
    s += `:${event.headers['X-Forwarded-Port']}`
  }
  return s
}

function getPathWithQueryStringParams(event) {
  return `${event.path}${queryString(event.queryStringParameters)}`
}

function queryString(query) {
  var params = [ ]
  if (!query) return ''
  for (var name in query) {
    params.push(`${name}=${query[name]}`)
  }
  return `?${params.join(',')}`
}

function getEventBody(event) {
  return Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8')
}


module.exports = {
  toUrl,
  toHref,
  toOptions
}