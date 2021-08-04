const errorHandler = (error, request, response, next) => {

  if(error.name === 'ValidationError'){
    return response.status(400).send({
      error: error.message
    })
  } else if(error.name === 'JsonWebTokenError'){
    return response.status(401).send({
      error: 'invalid token'
    })
  } else if(error.name === 'CastError'){
    return response.status(400).send({
      error: error.message
    })
  }

  next(error)
}

const tokenExtractor = (request, response, next) => {
  const auth = request.get('authorization')
  if(auth && auth.toLowerCase().startsWith('bearer ')){
    request.token = auth.substring(7)
  }
  next()
}

module.exports = {
  errorHandler,
  tokenExtractor
}