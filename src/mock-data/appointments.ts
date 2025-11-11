import { AppointmentAPIResponse } from '@/types/appointment';

export const APPOINTMENTS_DATA: AppointmentAPIResponse[] = [
  {
    id: '1',
    petName: 'Rex',
    description: 'Consult',
    tutorName: 'John',
    phone: '1234567890',
    scheduledAt: new Date('2025-11-10T10:00:00'),
    createdAt: new Date('2025-11-10T10:00:00'),
  },
  {
    id: '2',
    petName: 'Mimi',
    tutorName: 'Mary',
    description: 'Grooming',
    phone: '1234567890',
    scheduledAt: new Date('2025-11-10T11:00:00'),
    createdAt: new Date('2025-11-10T11:00:00'),
  },
  {
    id: '3',
    petName: 'Nina',
    tutorName: 'Natalia',
    description: 'Consult',
    phone: '1234567890',
    scheduledAt: new Date('2025-11-10T14:00:00'),
    createdAt: new Date('2025-11-10T14:00:00'),
  },
  {
    id: '4',
    petName: 'Nina',
    tutorName: 'Natalia',
    description: 'Consult',
    phone: '1234567890',
    scheduledAt: new Date('2025-11-10T19:00:00'),
    createdAt: new Date('2025-11-10T19:00:00'),
  },
];
