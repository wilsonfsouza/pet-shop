'use server';

import { prisma } from '@/lib/prisma';
import { calculatePeriodOfDay } from '@/utils/groupAppoitmentsByPeriod';
import { revalidatePath } from 'next/cache';
import z from 'zod';

const appointmentSchema = z.object({
  tutorName: z.string(),
  petName: z.string(),
  phone: z.string(),
  description: z.string(),
  scheduledAt: z.date(),
});

type CreateAppointmentDTO = z.infer<typeof appointmentSchema>;

export async function createAppointment(data: CreateAppointmentDTO) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduledAt } = parsedData;
    const hour = scheduledAt.getHours();

    const { isMorning, isAfternoon, isEvening } = calculatePeriodOfDay(hour);

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error:
          'Appointments can only be scheduled between 9am-12pm, 1pm-6pm, or 7pm-9pm',
      };
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        scheduledAt,
      },
    });

    if (existingAppointment) {
      return {
        error: 'This time slot is already reserved',
      };
    }

    const currentDate = new Date();

    await prisma.appointment.create({
      data: {
        ...parsedData,
        createdAt: currentDate,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.log(error);
    return {
      error: 'Error while creating appointment. Try again later.',
    };
  }
}

type UpdateAppointmentDTO = z.infer<typeof appointmentSchema>;

export async function updateAppointment(
  id: string,
  data: UpdateAppointmentDTO
) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduledAt } = parsedData;
    const hour = scheduledAt.getHours();

    const { isMorning, isAfternoon, isEvening } = calculatePeriodOfDay(hour);

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error:
          'Appointments can only be scheduled between 9am-12pm, 1pm-6pm, or 7pm-9pm',
      };
    }

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        scheduledAt,
        id: {
          not: id,
        },
      },
    });

    if (existingAppointment) {
      return {
        error: 'This time slot is already reserved',
      };
    }

    await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        ...parsedData,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.log(error);

    return {
      error: 'Error while updating appointment. Try again later.',
    };
  }
}

export async function removeAppointment(id: string) {
  try {
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        id,
      },
    });

    if (!existingAppointment) {
      return {
        error: 'Selected appointment does not exist',
      };
    }

    await prisma.appointment.delete({
      where: {
        id,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.log(error);

    return {
      error: 'Error while removing appointment. Try again later.',
    };
  }
}
