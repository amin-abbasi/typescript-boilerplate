import { Context } from 'koa'
import { Language, Translate } from '../src/middlewares/i18n'
import { ResponseError } from '../src/middlewares/transformer'
import { UserAuth } from '../src/configs/types'

declare module 'koa' {
  interface ExtendableContext {
    language: Language
    user: UserAuth
    t: Translate
    error: ResponseError
    result: any
  }
}
