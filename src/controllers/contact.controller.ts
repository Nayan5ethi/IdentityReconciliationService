import { Request, Response } from 'express'
import { identifyService } from 'services/contact.service'
import logger from 'utils/logger'

export const identifyContact = async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body
  try {
    const result = await identifyService(email, phoneNumber)
    res.status(200).json(result)
  } catch (error) {
    logger.error(`[ContactController] Error identifying contact: ${error.message}`)
    throw error
  }
}
