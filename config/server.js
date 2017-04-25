const Joi = require('joi')

const envVarsSchema = Joi.object()
  .keys({'PORT': Joi.number().default(80)})
  .unknown()
  .required()

const {error, 'value': envVars} = Joi.validate(process.env, envVarsSchema)

if (error) {
  throw new Error(`Config error message ${error.message}`)
}

const config = {'port': envVars.PORT}

module.exports = config
