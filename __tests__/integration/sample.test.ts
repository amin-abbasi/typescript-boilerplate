import 'reflect-metadata'
import mongoose from 'mongoose'
import supertest from 'supertest'

import app from '../../src/app'
import dbConnect from '../../src/database'
import { config } from '../../src/configs'
import { AppDataSource } from '../../src/database/mysql'
import { Redis } from '../../src/services'
import body_sample from '../fixtures/sample.json'

const request = supertest(app)

describe(`Sample API with ${config.env.DB_TYPE}`, () => {
  let sampleId: string

  beforeAll(async () => {
    await dbConnect()
  })

  afterAll(async () => {
    if (Redis.isOpen) await Redis.quit()
    if (config.env.DB_TYPE === 'mongodb') {
      await mongoose.disconnect()
    } else {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy()
      }
    }
  })

  // Create Samples
  it('should create a sample', async () => {
    const res = await request.post('/api/v1/samples').send(body_sample)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    sampleId = res.body.result._id || res.body.result.id
    expect(sampleId).toBeDefined()
  })

  // List of Samples
  it('should get list of samples', async () => {
    const res = await request.get('/api/v1/samples')
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(Array.isArray(res.body.result.list)).toBeTruthy()
  })

  // Sample Details
  it('should get sample details', async () => {
    const res = await request.get(`/api/v1/samples/${sampleId}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.result.result.name).toBe(body_sample.name)
  })

  // Update Sample
  it('should update sample details', async () => {
    const updateData = { age: 31 }
    const res = await request.put(`/api/v1/samples/${sampleId}`).send(updateData)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  // Delete a Sample
  it('should delete a sample', async () => {
    const res = await request.delete(`/api/v1/samples/${sampleId}`)
    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })
})
