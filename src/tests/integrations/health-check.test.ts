import app from '../jest.setup'

describe('Health Check Endpoints', () => {
  it('should return 200 for GET /', async () => {
    const response = await app.get('/')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Service is healthy')
  })

  it('should return 200 for GET /health', async () => {
    const response = await app.get('/health')
    expect(response.status).toBe(200)
    expect(response.text).toBe('Service is healthy')
  })
})
