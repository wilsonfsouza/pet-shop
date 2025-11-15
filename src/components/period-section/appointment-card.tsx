'use client';

import { removeAppointment } from '@/app/actions';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types/appointment';
import {
  Pen as EditIcon,
  Loader2 as LoadingIcon,
  Trash2 as RemoveIcon,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AppointmentsForm } from '../appointments-form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

type AppointmentCardProps = {
  appointment: Appointment;
  isFirstInSection?: boolean;
};

export const AppointmentCard = ({
  appointment,
  isFirstInSection = false,
}: AppointmentCardProps) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleAppointmentRemoval = async (id: string) => {
    setIsRemoving(true);

    const result = await removeAppointment(id);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success('Appointment removed successfully!');
    setIsRemoving(false);
  };

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

      <div className="text-tight mt-2 md:mt-0 col-span-2 md:col-span-1 flex justify-end items-center gap-2">
        <AppointmentsForm appointment={appointment}>
          <Button variant="edit" size="icon">
            <EditIcon className="size-4" />
          </Button>
        </AppointmentsForm>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="remove" size="icon">
              <RemoveIcon className="size-4" />
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove appointment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this appointment? This action is
                irreversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleAppointmentRemoval(appointment.id)}
                disabled={isRemoving}
              >
                {isRemoving && (
                  <LoadingIcon className="mr-2 size-4 animate-spin" />
                )}
                Confirm removal
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
