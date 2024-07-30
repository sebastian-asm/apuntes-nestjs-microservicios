import { Catch, ArgumentsHost } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

@Catch(RpcException)
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const rpcError = exception.getError()

    if (typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError)
      return response.status(rpcError.status).json(rpcError)

    response.status(500).json({
      status: 500,
      message: rpcError
    })
  }
}
