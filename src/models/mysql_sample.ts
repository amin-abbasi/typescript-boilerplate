import { BeforeInsert, BeforeUpdate, Column, Entity, FindManyOptions, PrimaryGeneratedColumn, Repository, UpdateResult, getRepository } from 'typeorm'
import { Errors } from '../services'

import { config } from '../configs'
import { MESSAGES } from '../middlewares/i18n'

@Entity()
export class Sample {
  /**
   * Model Constructor
   * @param payload Object data to assign
   */
  constructor(payload: Sample) {
    Object.assign(this, payload)
  }

  @PrimaryGeneratedColumn()
  id: string

  @Column({ length: 24, unique: true })
  someId: string

  @Column({ default: 1 })
  age: number

  @Column({ default: true })
  isActive: boolean

  @Column({ length: 100 })
  name: string

  @Column({ default: Date.now() })
  createdAt: number

  @Column({ default: 0 })
  updatedAt: number

  @Column({ default: 0 })
  deletedAt: number

  @BeforeInsert()
  @BeforeUpdate()
  async setDates(): Promise<boolean> {
    const now: number = Date.now()
    if (!this.createdAt) this.createdAt = now
    else this.updatedAt = now
    return true
  }
}

export interface QueryData {
  page: number
  size: number
  deletedAt: number // Always filter deleted documents
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any // needs to specified later based on entity or model
}

export class SampleRepository {
  private repository: Repository<Sample> = getRepository<Sample>(Sample, config.env.DB_CONNECTION)

  async add(data: Sample): Promise<Sample> {
    const sample: Sample = new Sample(data)
    return await this.repository.save(sample)
  }

  async list(queryData: QueryData): Promise<{ total: number; list: Sample[] }> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, size, ...query } = queryData
    query.deletedAt = 0
    query.isActive = true

    // query.order = { [config.sortTypes[query.sortBy]]: 'DESC' }
    // delete query.sortBy
    const [list, total] = await this.repository.findAndCount(query as FindManyOptions<Sample>)
    return { total, list }
  }

  async details(someId: string): Promise<Sample> {
    const sample: Sample | null = await this.repository.findOneBy({ someId })
    if (!sample || sample.deletedAt !== 0 || !sample.isActive) throw Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
    return sample
  }

  async updateByQuery(query: QueryData, data: Sample): Promise<UpdateResult> {
    const sample: Sample | null = await this.repository.findOne(query as FindManyOptions<Sample>)
    if (!sample || sample.deletedAt !== 0 || !sample.isActive) throw Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
    const result = await this.repository.update(query, data)
    return result
  }

  async updateById(someId: string, data: Sample): Promise<UpdateResult> {
    const sample: Sample = await this.details(someId)
    return await this.repository.update(sample.id, data)
  }

  async softDelete(someId: string): Promise<UpdateResult> {
    const sample: Sample = await this.details(someId)
    return await this.repository.update(sample.id, { deletedAt: Date.now() })
  }

  async remove(someId: string): Promise<Sample | { isSampleRemoved: boolean }> {
    const sample: Sample | null = await this.repository.findOneBy({ someId })
    if (!sample) return { isSampleRemoved: false }
    return await this.repository.remove(sample)
  }

  async restore(someId: string): Promise<UpdateResult> {
    const sample: Sample = await this.details(someId)
    return await this.repository.update(sample.id, { deletedAt: 0 })
  }
}

// --------------- Swagger Models Definition ---------------

/**
 * @openapi
 * components:
 *   schemas:
 *     Sample:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *           description: Email for the user, needs to be unique.
 *       example:
 *         name: 'Amin'
 *         email: 'amin.abbasi.rs@gmail.com'
 */
