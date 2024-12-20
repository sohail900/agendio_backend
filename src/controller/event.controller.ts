import type { NextFunction, Request, Response } from 'express'
import { EventType, PrismaClient, Role } from '@prisma/client'
import AppError from '../utils/errorHandler'
const prisma = new PrismaClient()

// create event controller only for admin
export const CreateEvent = async (
    req: Request,
    resp: Response,
    next: NextFunction
) => {
    const isAdmin = req.role
    const id = req.id

    if (isAdmin !== Role.Admin)
        return next(new AppError(401, 'Unauthorized user'))

    const { eventCategory, recurringType } = req.body

    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setMinutes(endDate.getMinutes() + 5)

    await prisma.event.create({
        data: {
            ...req.body,
            eventCategory,
            recurringType,
            startDate,
            endDate,
            createdBy: Number(id),
        },
    })
    resp.status(201).json({
        message: 'Event created successfully',
    })
}
