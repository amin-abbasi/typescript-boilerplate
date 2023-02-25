import { Context, Next } from 'koa'
import Errors from 'http-errors'
import { ROLES } from '../configs'
import { UserAuth } from '../configs/types'
import { MESSAGES } from '../middlewares/i18n/types'
import { isValid }  from '../services/jwt'

// Function to set needed header auth
export async function checkToken(ctx: Context, next: Next): Promise<void> {
  try {
    const authToken: string | undefined = ctx.headers.authorization?.split(' ')[1]
    if (!authToken || authToken === '') throw new Errors.Unauthorized(MESSAGES.INVALID_ACCESS_TOKEN)
    const user = await isValid(authToken)
    if (!user) throw new Errors.Unauthorized(MESSAGES.INVALID_ACCESS_TOKEN)
    ctx.user = user as UserAuth
    await next()
  }
  catch (error: any) {
    console.log('>>>>> Check Token Error: ', error)
    ctx.error = error
    await next()
  }
}


// Function to set needed header auth
export function checkRole(roles?: string[]): (ctx: Context, next: Next) => Promise<void> {
  return async function(ctx: Context, next: Next): Promise<void> {
    try {
      const validRoles: string[] = roles ? roles : [ROLES.normal]
      const user: UserAuth = ctx.user
      if (!user || !validRoles.includes(user.role)) throw new Errors.Unauthorized(MESSAGES.UNAUTHORIZED)
      await next()
    }
    catch (error: any) {
      console.log('>>>>> Check Role Error: ', error)
      ctx.error = error
      await next()
    }
  }
}
