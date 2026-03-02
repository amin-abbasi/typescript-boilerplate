import { IRepository } from '../repository.interface'
import { Sample } from '../../models/core/sample'

export interface ISampleRepository extends IRepository<Sample> {
  greetings(id: string): Promise<string>
  findByAge(age: number): Promise<Sample | null>
}
