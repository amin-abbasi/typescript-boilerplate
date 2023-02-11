import { Request, Response } from 'express'
import { Language, Translate } from '../../src/services/i18n'
import { UserAuth } from '../../src/configs/types'

declare global {
  namespace Express {
    interface Request {
      language: Language
      user: UserAuth
    }

    interface Response {
      t: Translate
      result: any
    }
  }
}
