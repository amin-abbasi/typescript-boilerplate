const supertest = require('supertest')
const config    = require('../src/configs/config')
const server    = require('../src/server')
const body_sample = require('./body_samples/body_sample.json')

jest.setTimeout(30000)
// jest.mock('../__mocks__/samples.js')

const { SERVER_PROTOCOL, SERVER_HOST, SERVER_PORT, DB_HOST, DB_PORT } = config.default.env
const url = `${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/api`

// ---------------------------------- MongoDB ----------------------------------------
// const mongoose = require('mongoose')
// const mongoDB = {
//   mongoose,
//   connect: () => {
//     mongoose.Promise = Promise;
//     mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/testDB`, { useNewUrlParser: true });
//   },
//   disconnect: (done) => { mongoose.disconnect(done) },
// }


let sampleId
const request = supertest(url)

describe('Sample Worker', () => {

  // beforeAll(() => { mongoDB.connect() })
  // afterAll((done) => { mongoDB.disconnect(done) })

  // Create Samples
  test('should create a sample', async (done) => {
    const res = await request.post('/v1/samples').send(body_sample)
    const response = JSON.parse(res.text)
    sampleId = response.result._id
    expect(response.statusCode).toBe(200)
    expect(response.success).toBe(true)
    expect(response.result).toBeTruthy()
    expect(response.result).toMatchSnapshot()
    done()
  })

  // List of Samples
  test('should get list of samples', async (done) => {
    const res = await request.get('/v1/samples')
    const response = JSON.parse(res.text)
    expect(response.statusCode).toBe(200)
    expect(response.success).toBe(true)
    expect(response.result).toBeTruthy()
    expect(response.result).toMatchSnapshot()
    done()
  })

  // Sample Details
  test('should get sample details', async (done) => {
    const res = await request.get('/v1/samples/' + sampleId)
    const response = JSON.parse(res.text)
    expect(response.statusCode).toBe(200)
    expect(response.success).toBe(true)
    expect(response.result).toBeTruthy()
    expect(response.result).toMatchSnapshot()
    done()
  })

  // Update Sample
  const updateData = { name: 'Changed Name' } // Some data to update
  test('should get sample details', async (done) => {
    const res = await request.put('/v1/samples/' + sampleId).send(updateData)
    const response = JSON.parse(res.text)
    expect(response.statusCode).toBe(200)
    expect(response.success).toBe(true)
    expect(response.result).toBeTruthy()
    expect(response.result).toMatchSnapshot()
    done()
  })

  // Delete a Sample
  test('should delete a sample', async (done) => {
    const res = await request.del('/v1/samples/' + sampleId)
    const response = JSON.parse(res.text)
    expect(response.statusCode).toBe(200)
    expect(response.success).toBe(true)
    expect(response.result).toBeTruthy()
    expect(response.result).toMatchSnapshot()
    done()
  })
})
