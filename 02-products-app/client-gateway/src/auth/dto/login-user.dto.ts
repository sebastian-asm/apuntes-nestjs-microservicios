import { IsEmail, IsString } from 'class-validator'

export class LoginUserDto {
  @IsEmail()
  email: string

  @IsString()
  // @IsStrongPassword()
  password: string
}
