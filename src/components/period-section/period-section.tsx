import { AppointmentPeriod } from '@/types/appointment';
import { Cloudy, Moon, Sun } from 'lucide-react';
import { AppointmentCard } from './appointment-card';

type PeriodSectionProps = {
  period: AppointmentPeriod;
};

const periodIcons = {
  morning: <Sun className="text-accent-blue" />,
  afternoon: <Cloudy className="text-accent-orange" />,
  evening: <Moon className="text-accent-yellow" />,
};

export const PeriodSection = ({ period }: PeriodSectionProps) => {
  const hasAppointments = period.appointments.length > 0;
  return (
    <section className="bg-background-tertiary rounded-custom-lg">
      <div className="flex items-center px-5 py-3 justify-between border-b border-[#2E2C30]">
        <div className="flex items-center gap-2">
          {periodIcons[period.type]}
          <h2 className="text-label-large-size text-content-primary">
            {period.title}
          </h2>
        </div>
        <span className="text-label-large-size text-content-secondary">
          {period.timeRange}
        </span>
      </div>

      {hasAppointments ? (
        <div className="px-5">
          <div>
            {period.appointments.map((appointment, index) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                isFirstInSection={index === 0}
              />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-paragraph-small-size text-content-secondary py-3 px-5">
          No appointments for this period.
        </p>
      )}
    </section>
  );
};
