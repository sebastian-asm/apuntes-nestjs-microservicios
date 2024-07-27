import 'dotenv/config'
import * as yup from 'yup'

interface EnvVars {
  PORT: number
}

const envsSchema = yup.object({
  PORT: yup.number().required()
})

let value: any
try {
  value = envsSchema.validateSync(process.env)
} catch (error) {
  throw new Error(error)
}

const envVars: EnvVars = value
export const envs = {
  port: envVars.PORT
}
