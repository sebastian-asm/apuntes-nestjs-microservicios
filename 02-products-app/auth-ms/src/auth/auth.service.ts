import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { JwtService } from '@nestjs/jwt'
import { PrismaClient } from '@prisma/client'
import { compareSync, hashSync } from 'bcrypt'

import { LoginUserDto, RegisterUserDto } from './dto'
import { JwtPayload } from './interfaces'
import { envs } from 'src/config'

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthMS')

  constructor(private readonly jwtService: JwtService) {
    super()
  }

  onModuleInit() {
    this.$connect()
    this.logger.log('✅ Database connected')
  }

  async signJwt(payload: JwtPayload) {
    return this.jwtService.sign(payload)
  }

  async verifyToken(token: string) {
    try {
      // extraer solo los datos del usuario
      const { sub, iat, exp, ...user } = this.jwtService.verify(token, { secret: envs.jwtSecret })
      return {
        user,
        // se aprovecha de generar nuevo token
        token: await this.signJwt(user)
      }
    } catch (error) {
      throw new RpcException({
        status: 401,
        message: 'Token inválido'
      })
    }
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    const { name, email, password } = registerUserDto
    try {
      let user = await this.user.findUnique({ where: { email } })
      if (user) {
        throw new RpcException({
          status: 400,
          message: 'El usuario ya existe'
        })
      }

      user = await this.user.create({
        data: {
          email,
          password: hashSync(password, 10),
          name
        }
      })
      const { password: _, ...rest } = user
      return {
        user: rest,
        token: await this.signJwt(rest)
      }
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      })
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto
    try {
      let user = await this.user.findUnique({ where: { email } })
      if (!user) {
        throw new RpcException({
          status: 400,
          message: 'Las credenciales no son válidas (email)'
        })
      }

      const isPasswordValid = compareSync(password, user.password)
      if (!isPasswordValid) {
        throw new RpcException({
          status: 400,
          message: 'Las credenciales no son válidas (password)'
        })
      }

      const { password: _, ...rest } = user
      return {
        user: rest,
        token: await this.signJwt(rest)
      }
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message
      })
    }
  }
}
