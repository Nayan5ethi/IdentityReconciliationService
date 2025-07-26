import path from 'path'
import config from './src/config'

module.exports = {
  schema: path.resolve(__dirname, 'prisma/schema.prisma'),
  env: {
    DATABASE_URL: config.DATABASE_URL,
  },
}
