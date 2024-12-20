import { EventCategory, EventType, RecurringType } from '@prisma/client'
import { z } from 'zod'

export const createEventSchema = z
    .object({
        name: z
            .string()
            .min(5, { message: 'Name should be atleast 5 characters' })
            .max(100, { message: 'Name should be less than 100 characters' }),
        description: z.string().max(500, {
            message: 'Description should be less than 500 characters',
        }),
        location: z.string().max(200, {
            message: 'Location should be less than 200 characters',
        }),
        eventType: z.enum(
            [EventType.PRIVATE, EventType.PUBLIC, EventType.RECURRING],
            { message: 'Invalid event type' }
        ),
        eventCategory: z.enum(
            [EventCategory.MEETING, EventCategory.HACKATHON],
            {
                message: 'Invalid event category',
            }
        ),
        recurringType: z
            .enum(
                [
                    RecurringType.DAILY,
                    RecurringType.WEEKLY,
                    RecurringType.MONTHLY,
                ],
                { message: 'Invalid recurring type' }
            )
            .optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
    })
    .required({
        description: true,
        location: true,
        eventType: true,
        eventCategory: true,
    })
