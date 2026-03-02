import { ISampleRepository } from './sample.repository.interface'
import { Sample as CoreSample } from '../../models/core/sample'
import { BaseQueryData } from '../repository.interface'
import { Sample } from '../../models/mysql_sample'
import { AppDataSource } from '../mysql'
import { Errors } from '../../services'
import { MESSAGES } from '../../middlewares/i18n'
import { injectable } from 'tsyringe'

@injectable()
export class TypeORMSampleRepository implements ISampleRepository {
  private get repo() {
    return AppDataSource.getRepository(Sample)
  }

  async add(data: Partial<CoreSample>): Promise<CoreSample> {
    const sample = new Sample(data as any)
    const result = await this.repo.save(sample)
    return result as unknown as CoreSample
  }

  async list(queryData: BaseQueryData): Promise<{ total: number; list: CoreSample[] }> {
    const { page, size, ...query } = queryData
    query.deletedAt = 0
    query.isActive = true

    const [list, total] = await this.repo.findAndCount({
      where: query as any,
      skip: (page - 1) * size,
      take: size
    })
    return { total, list: list as unknown as CoreSample[] }
  }

  async details(id: string): Promise<CoreSample> {
    const sample = await this.repo.findOneBy({ id: id as any }) // or someId if defined
    if (!sample || Number(sample.deletedAt) !== 0 || !sample.isActive) throw Errors.NotFound(MESSAGES.MODEL_NOT_FOUND)
    return sample as unknown as CoreSample
  }

  async updateById(id: string, data: Partial<CoreSample>): Promise<CoreSample> {
    await this.details(id)
    await this.repo.update(id, data as any)
    return await this.details(id)
  }

  async softDelete(id: string): Promise<CoreSample> {
    await this.details(id)
    await this.repo.update(id, { deletedAt: Date.now() })
    return await this.details(id)
  }

  async remove(id: string): Promise<boolean | CoreSample> {
    const sample = await this.repo.findOneBy({ id: id as any })
    if (!sample) return false
    const removed = await this.repo.remove(sample)
    return removed as unknown as CoreSample
  }

  async greetings(id: string): Promise<string> {
    const sample = await this.details(id)
    return 'Hi ' + sample.name + '!!'
  }

  async findByAge(age: number): Promise<CoreSample | null> {
    const sample = await this.repo.findOneBy({ age })
    return sample as unknown as CoreSample
  }
}
