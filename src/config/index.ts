import dotenv from 'dotenv'
dotenv.config()
import logger from 'utils/logger'
import environmentVariables from './envs'

function validateEnv() {
  const missingEnvs = Object.keys(environmentVariables).filter((env) => !process.env[env])
  if (missingEnvs.length > 0) {
    logger.error(`Missing required environment variables: ${missingEnvs.join(', ')}`)
  }
}

validateEnv()

export default environmentVariables
