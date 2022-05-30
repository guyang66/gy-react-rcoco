module.exports = (request, response, next) => {
  if (request.method === 'POST') {
    request.method = 'GET'
    request.query = request.body
  }
  next()
}
