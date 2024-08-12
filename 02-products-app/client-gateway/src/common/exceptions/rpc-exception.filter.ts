import { Catch, ArgumentsHost } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

@Catch(RpcException)
export class ExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const rpcError = exception.getError()

    // capturando el error cuando un ms esta caído
    if (rpcError.toString().includes('Empty response')) {
      const message = rpcError.toString().substring(0, rpcError.toString().indexOf('(') - 1)
      return response.status(500).json({
        status: 500,
        message
      })
    }

    if (typeof rpcError === 'object' && 'status' in rpcError && 'message' in rpcError)
      return response.status(rpcError.status).json(rpcError)

    response.status(500).json({
      status: 500,
      message: rpcError
    })
  }
}
