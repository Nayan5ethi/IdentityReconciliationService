import { Router } from 'express'
import { identifyContact } from 'controllers/contact.controller'
import { validateIdentifyContact } from 'middlewares/validator/contact.validator'

const router = Router()

router.post('/identify', validateIdentifyContact, identifyContact)

export default router
