import { identifyService } from '../../services/contact.service'
import { prisma } from '../../utils/prisma/client'

const TEST_DATA = {
  contacts: {
    lorraine: {
      email: 'lorraine@hillvalley.edu',
      phone: '123456',
    },
    mcfly: {
      email: 'mcfly@hillvalley.edu',
      phone: '123456',
    },
    george: {
      email: 'george@hillvalley.edu',
      phone: '919191',
    },
    biff: {
      email: 'biffsucks@hillvalley.edu',
      phone: '717171',
    },
    emailOnly: {
      email: 'test@example.com',
      phone: undefined,
    },
    phoneOnly: {
      email: undefined,
      phone: '123456789',
    },
    first: {
      email: 'first@example.com',
      phone: '111111',
    },
    second: {
      email: 'second@example.com',
      phone: '111111',
    },
  },
}

describe('Contact Identification Service', () => {
  const createdContactIds: number[] = []

  beforeEach(async () => {
    createdContactIds.length = 0
  })

  afterEach(async () => {
    if (createdContactIds.length > 0) {
      await prisma.contact.deleteMany({
        where: {
          id: {
            in: createdContactIds,
          },
        },
      })
    }
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  const trackContact = async (email?: string, phoneNumber?: string) => {
    const result = await identifyService(email, phoneNumber)

    const relatedContacts = await prisma.contact.findMany({
      where: {
        OR: [{ id: result.contact.primaryContactId }, { id: { in: result.contact.secondaryContactIds } }],
      },
    })

    relatedContacts.forEach((contact) => {
      if (!createdContactIds.includes(contact.id)) {
        createdContactIds.push(contact.id)
      }
    })

    return result
  }

  describe('New Contact Creation', () => {
    it('should create a new primary contact when no existing contacts', async () => {
      const { lorraine } = TEST_DATA.contacts
      const result = await trackContact(lorraine.email, lorraine.phone)

      expect(result.contact.emails).toEqual([lorraine.email])
      expect(result.contact.phoneNumbers).toEqual([lorraine.phone])
      expect(result.contact.secondaryContactIds).toEqual([])
      expect(result.contact.primaryContactId).toBeDefined()
    })
  })

  describe('Secondary Contact Creation', () => {
    it('should create secondary contact when new info is provided', async () => {
      const { lorraine, mcfly } = TEST_DATA.contacts

      await trackContact(lorraine.email, lorraine.phone)

      const result = await trackContact(mcfly.email, mcfly.phone)

      expect(result.contact.emails).toContain(lorraine.email)
      expect(result.contact.emails).toContain(mcfly.email)
      expect(result.contact.phoneNumbers).toEqual([lorraine.phone])
      expect(result.contact.secondaryContactIds).toHaveLength(1)
    })

    it('should return existing contact when exact match exists', async () => {
      const { lorraine } = TEST_DATA.contacts

      const firstResult = await trackContact(lorraine.email, lorraine.phone)

      const secondResult = await trackContact(lorraine.email, lorraine.phone)

      expect(firstResult.contact.primaryContactId).toBe(secondResult.contact.primaryContactId)
      expect(secondResult.contact.secondaryContactIds).toEqual([])
    })
  })

  describe('Primary Contact Merging', () => {
    it('should merge two primary contacts when they share information', async () => {
      const { george, biff } = TEST_DATA.contacts

      await trackContact(george.email, george.phone)
      await trackContact(biff.email, biff.phone)

      const result = await trackContact(george.email, biff.phone)

      expect(result.contact.emails).toContain(george.email)
      expect(result.contact.emails).toContain(biff.email)
      expect(result.contact.phoneNumbers).toContain(george.phone)
      expect(result.contact.phoneNumbers).toContain(biff.phone)
      expect(result.contact.secondaryContactIds).toHaveLength(1)
    })
  })

  describe('Edge Cases', () => {
    it('should handle email-only request', async () => {
      const { emailOnly } = TEST_DATA.contacts
      const result = await trackContact(emailOnly.email, emailOnly.phone)

      expect(result.contact.emails).toEqual([emailOnly.email])
      expect(result.contact.phoneNumbers).toEqual([])
      expect(result.contact.secondaryContactIds).toEqual([])
    })

    it('should handle phone-only request', async () => {
      const { phoneOnly } = TEST_DATA.contacts
      const result = await trackContact(phoneOnly.email, phoneOnly.phone)

      expect(result.contact.emails).toEqual([])
      expect(result.contact.phoneNumbers).toEqual([phoneOnly.phone])
      expect(result.contact.secondaryContactIds).toEqual([])
    })

    it('should maintain chronological order in response', async () => {
      const { first, second } = TEST_DATA.contacts

      await trackContact(first.email, first.phone)

      await trackContact(second.email, second.phone)

      const result = await trackContact(first.email, first.phone)

      expect(result.contact.emails[0]).toBe(first.email)
      expect(result.contact.phoneNumbers[0]).toBe(first.phone)
    })
  })
})
