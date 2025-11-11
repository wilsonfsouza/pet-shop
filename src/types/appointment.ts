import { Appointment as PrismaAppointment } from '@/generated/prisma/client';

export type AppointmentAPIResponse = PrismaAppointment;

export type AppointmentPeriodDay = 'morning' | 'afternoon' | 'evening';

export type Appointment = PrismaAppointment & {
  time: string;
  service: string;
  period: AppointmentPeriodDay;
};

export type AppointmentPeriod = {
  title: string;
  type: AppointmentPeriodDay;
  timeRange: string;
  appointments: Appointment[];
};
