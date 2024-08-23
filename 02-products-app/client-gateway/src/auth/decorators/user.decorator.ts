import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common'

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  if (!request.user) throw new InternalServerErrorException('Hubo un error en la petición (user)')
  return request.user
})
