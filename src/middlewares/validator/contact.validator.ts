import { body } from 'express-validator'
import { commonValidator } from './common'

export const validateIdentifyContact = [
  body().custom((_value, { req }) => {
    const { email, phoneNumber } = req.body

    if ((!email || email === null) && (!phoneNumber || phoneNumber === null)) {
      throw new Error('Either email or phoneNumber must be provided')
    }

    if (email && email !== null && typeof email !== 'string') {
      throw new Error('Email must be a string')
    }

    if (email && email !== null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please provide a valid email address')
    }

    if (phoneNumber && phoneNumber !== null && typeof phoneNumber !== 'string') {
      throw new Error('Phone number must be a string')
    }

    if (phoneNumber && phoneNumber !== null && !/^\+?[\d\s-()]+$/.test(phoneNumber)) {
      throw new Error('Please provide a valid phone number')
    }

    return true
  }),

  commonValidator,
]
