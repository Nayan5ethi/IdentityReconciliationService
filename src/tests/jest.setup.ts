import 'dotenv/config'
import supertest from 'supertest'
import { createApp } from 'app'

const expressApp = createApp()
const app = supertest(expressApp)

export default app
