import { injectable } from 'tsyringe'

import { ISampleRepository } from './sample.repository.interface'
import { Sample } from '../../models/core/sample'
import { BaseQueryData } from '../repository.interface'
import { Model } from '../../models/mongo_sample'

@injectable()
export class MongoSampleRepository implements ISampleRepository {
  async add(data: Partial<Sample>): Promise<Sample> {
    const result = await Model.model.create(data)
    return result as unknown as Sample
  }

  async list(query: BaseQueryData): Promise<{ total: number; list: Sample[] }> {
    const { total, list } = await Model.list(query as any)
    return { total, list: list as unknown as Sample[] }
  }

  async details(id: string): Promise<Sample> {
    const result = await Model.details(id)
    return result as unknown as Sample
  }

  async updateById(id: string, data: Partial<Sample>): Promise<Sample> {
    const result = await Model.updateById(id, data as any)
    return result as unknown as Sample
  }

  async softDelete(id: string): Promise<Sample> {
    const result = await Model.softDelete(id)
    return result as unknown as Sample
  }

  async remove(id: string): Promise<boolean | Sample> {
    const result = await Model.remove(id)
    return result as unknown as Sample
  }

  async greetings(id: string): Promise<string> {
    return await Model.greetings(id)
  }

  async findByAge(age: number): Promise<Sample | null> {
    return (await Model.findByAge(age)) as unknown as Sample
  }
}
