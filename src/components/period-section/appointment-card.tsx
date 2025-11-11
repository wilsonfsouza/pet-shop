import { cn } from '@/lib/utils';
import { Appointment } from '@/types/appointment';

type AppointmentCardProps = {
  appointment: Appointment;
  isFirstInSection?: boolean;
};

export const AppointmentCard = ({
  appointment,
  isFirstInSection = false,
}: AppointmentCardProps) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-[15%_35%_30%_20%] items-center py-3',
        !isFirstInSection && 'border-t border-border-divisor'
      )}
    >
      <div className="text-left pr-4 md:pr-0">
        <p className="text-label-small text-content-primary font-semibold">
          <time dateTime={appointment.time}>{appointment.time}</time>
        </p>
      </div>

      <div className="text-right md:text-left md:pr-4">
        <div className="flex items-center justify-end md:justify-start gap-1">
          <p className="text-label-small-size text-content-primary font-semibold">
            {appointment.petName}
          </p>
          <p className="text-paragraph-small-size text-content-secondary">/</p>
          <p className="text-paragraph-small-size text-content-secondary">
            {appointment.tutorName}
          </p>
        </div>
      </div>

      <div className="text-left pr-4 mt-1 md:mt-0 col-span-2 md:col-span-1 hidden md:block">
        <p className="text-paragraph-small-size text-content-secondary">
          {appointment.description}
        </p>
      </div>
    </div>
  );
};
