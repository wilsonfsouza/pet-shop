import {
  Appointment,
  AppointmentAPIResponse,
  AppointmentPeriod,
  AppointmentPeriodDay,
} from '@/types/appointment';

function getPeriod(hour: number): AppointmentPeriodDay {
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

export function groupAppoitmentsByPeriod(
  appointments: AppointmentAPIResponse[]
): AppointmentPeriod[] {
  const transformedAppointments: Appointment[] = appointments.map(
    (appointment) => {
      return {
        ...appointment,
        time: appointment.scheduledAt.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        service: appointment.description,
        period: getPeriod(appointment.scheduledAt.getHours()),
      };
    }
  );

  const morningAppointments = transformedAppointments.filter(
    (appointment) => appointment.period === 'morning'
  );
  const afternoonAppointments = transformedAppointments.filter(
    (appointment) => appointment.period === 'afternoon'
  );
  const eveningAppointments = transformedAppointments.filter(
    (appointment) => appointment.period === 'evening'
  );

  return [
    {
      title: 'Morning',
      type: 'morning',
      timeRange: '9am-11am',
      appointments: morningAppointments,
    },
    {
      title: 'Afternoon',
      type: 'afternoon',
      timeRange: '12pm-5pm',
      appointments: afternoonAppointments,
    },
    {
      title: 'Evening',
      type: 'evening',
      timeRange: '6pm-9pm',
      appointments: eveningAppointments,
    },
  ];
}
