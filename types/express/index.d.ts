import { Context } from 'koa'
import { Language, Translate } from '../../src/middlewares/i18n'
import { UserAuth } from '../../src/configs/types'
import { ResponseError } from '../../src/middlewares/transformer'

declare global {
  namespace Koa {
    interface Context {
      language: Language
      user: UserAuth
      t: Translate
      result: any
      error: ResponseError
    }
  }
}
