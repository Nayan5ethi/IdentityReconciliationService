import { LinkPrecedence, Contact } from '@prisma/client'
import { prisma } from 'utils/prisma/client'

export const identifyService = async (email?: string, phoneNumber?: string) => {
  const existingContacts = await prisma.contact.findMany({
    where: {
      OR: [email ? { email: email } : {}, phoneNumber ? { phoneNumber: phoneNumber } : {}].filter(Boolean),
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  let primaryContact: Contact | null = null
  let mergedPrimaryIds: number[] = []

  if (existingContacts.length === 0) {
    primaryContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber,
        linkPrecedence: LinkPrecedence.primary,
      },
    })
  } else {
    const potentialPrimaryContacts: Contact[] = []
    for (const contact of existingContacts) {
      if (contact.linkPrecedence === LinkPrecedence.primary) {
        potentialPrimaryContacts.push(contact)
      } else if (contact.linkedId) {
        const linkedPrimary = await prisma.contact.findUnique({
          where: { id: contact.linkedId },
        })
        if (linkedPrimary && linkedPrimary.linkPrecedence === LinkPrecedence.primary) {
          potentialPrimaryContacts.push(linkedPrimary)
        }
      }
    }

    const uniquePrimaryContacts = Array.from(new Map(potentialPrimaryContacts.map((p) => [p.id, p])).values())

    if (uniquePrimaryContacts.length === 0) {
      primaryContact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: LinkPrecedence.primary,
        },
      })
    } else {
      primaryContact = uniquePrimaryContacts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0]

      if (uniquePrimaryContacts.length > 1) {
        for (const potentialPrimary of uniquePrimaryContacts) {
          if (potentialPrimary.id !== primaryContact.id) {
            mergedPrimaryIds.push(potentialPrimary.id)
            await prisma.contact.update({
              where: { id: potentialPrimary.id },
              data: {
                linkPrecedence: LinkPrecedence.secondary,
                linkedId: primaryContact.id,
              },
            })
          }
        }
      }

      // Check if we need to create a new secondary contact
      const exactMatch = existingContacts.find((c) => c.email === email && c.phoneNumber === phoneNumber)

      if (!exactMatch) {
        // Check if this combination brings new information
        const hasNewEmail = email && !existingContacts.some((c) => c.email === email)
        const hasNewPhone = phoneNumber && !existingContacts.some((c) => c.phoneNumber === phoneNumber)

        // Create secondary contact if we have new information
        if (hasNewEmail || hasNewPhone) {
          await prisma.contact.create({
            data: {
              email,
              phoneNumber,
              linkedId: primaryContact.id,
              linkPrecedence: LinkPrecedence.secondary,
            },
          })
        }
      }
    }
  }

  for (const mergedId of mergedPrimaryIds) {
    await prisma.contact.updateMany({
      where: { linkedId: mergedId },
      data: { linkedId: primaryContact!.id },
    })
  }

  const finalLinkedContacts = await prisma.contact.findMany({
    where: {
      OR: [{ id: primaryContact!.id }, { linkedId: primaryContact!.id }],
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  const emails: string[] = []
  const phoneNumbers: string[] = []
  const secondaryContactIds: number[] = []

  // Add primary contact's info first
  if (primaryContact!.email) emails.push(primaryContact!.email)
  if (primaryContact!.phoneNumber) phoneNumbers.push(primaryContact!.phoneNumber)

  // Add secondary contacts' info
  for (const contact of finalLinkedContacts) {
    if (contact.id !== primaryContact!.id) {
      if (contact.email && !emails.includes(contact.email)) {
        emails.push(contact.email)
      }
      if (contact.phoneNumber && !phoneNumbers.includes(contact.phoneNumber)) {
        phoneNumbers.push(contact.phoneNumber)
      }
      if (contact.linkPrecedence === LinkPrecedence.secondary) {
        secondaryContactIds.push(contact.id)
      }
    }
  }

  return {
    contact: {
      primaryContactId: primaryContact!.id,
      emails: emails,
      phoneNumbers: phoneNumbers,
      secondaryContactIds: secondaryContactIds.sort((a, b) => a - b),
    },
  }
}
