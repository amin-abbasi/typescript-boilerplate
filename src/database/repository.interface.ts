export interface BaseQueryData {
  page: number
  size: number
  sortType?: string
  [key: string]: any
}

export interface IRepository<T> {
  add(data: Partial<T>): Promise<T>
  list(query: BaseQueryData): Promise<{ total: number; list: T[] }>
  details(id: string): Promise<T>
  updateById(id: string, data: Partial<T>): Promise<T>
  softDelete(id: string): Promise<T>
  remove(id: string): Promise<boolean | T>
}
