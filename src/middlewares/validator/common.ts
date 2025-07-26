import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { CustomError } from 'errors'

export const commonValidator = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const errorArray = errors.array()
    return next(new CustomError(errorArray[0].msg, 400, 'INVALID_REQUEST'))
  }
  return next()
}
