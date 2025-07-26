import { CustomError } from 'errors'

export const BadRequestError = (message: string) => new CustomError(message, 400, 'BAD_REQUEST')
export const UnauthorizedError = (message: string) => new CustomError(message, 401, 'UNAUTHORIZED')
