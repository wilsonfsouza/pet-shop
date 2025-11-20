'use client';

import { createAppointment, updateAppointment } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Appointment } from '@/types/appointment';
import { zodResolver } from '@hookform/resolvers/zod';
import { PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { format, setHours, setMinutes, startOfToday } from 'date-fns';
import {
  CalendarIcon,
  Cat,
  ChevronDownIcon,
  Clock,
  Loader2,
  Phone,
  User,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IMaskInput } from 'react-imask';
import { toast } from 'sonner';
import z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const generateTimeOptions = () => {
  const times = [];

  for (let hour = 9; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const isAfterCloseTime = hour === 21 && minute > 0;
      if (isAfterCloseTime) break;

      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }

  return times;
};

const TIME_OPTIONS = generateTimeOptions();

const appointmentsFormSchema = z
  .object({
    tutorName: z.string().min(3, 'Tutor name is required'),
    petName: z.string().min(3, 'Pet name is required'),
    phone: z.string().min(10, 'Phone number is required'),
    description: z.string().min(3, 'Description is required'),
    scheduledAt: z
      .date({
        error: 'Date is required',
      })
      .min(startOfToday(), {
        message: 'Date cannot be in the past',
      }),
    time: z.string().min(1, 'Time is required'),
  })
  .refine(
    (data) => {
      const [hour, minute] = data.time.split(':');
      const scheduledDateTime = setMinutes(
        setHours(data.scheduledAt, Number(hour)),
        Number(minute)
      );
      const isScheduledDateTimeInFuture = scheduledDateTime > new Date();
      return isScheduledDateTimeInFuture;
    },
    {
      path: ['time'],
      error: 'Selected time must be a time in the future',
    }
  );

type AppointmentFormValues = z.infer<typeof appointmentsFormSchema>;

type AppointmentsFormProps = {
  children?: React.ReactNode;
  appointment?: Appointment;
};

export const AppointmentsForm = ({
  appointment,
  children,
}: AppointmentsFormProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleForm = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentsFormSchema),
    defaultValues: {
      tutorName: '',
      petName: '',
      description: '',
      phone: '',
      scheduledAt: undefined,
      time: '',
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    const [hour, minute] = data.time.split(':');

    const scheduledAt = setMinutes(
      setHours(data.scheduledAt, Number(hour)),
      Number(minute)
    );

    const isEditMode = !!appointment?.id;

    const result = isEditMode
      ? await updateAppointment(appointment.id, { ...data, scheduledAt })
      : await createAppointment({
          ...data,
          scheduledAt,
        });

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(
      `Appointment ${isEditMode ? 'updated' : 'created'} with success`
    );

    handleToggleForm(false);
    form.reset();
  };

  useEffect(() => {
    if (appointment) form.reset(appointment);
  }, [appointment, form]);

  return (
    <Dialog open={isOpen} onOpenChange={handleToggleForm}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent
        variant="appointment"
        overlayVariant="blurred"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle size="modal">Schedule a service</DialogTitle>
          <DialogDescription size="modal">
            Fill in the client&apos;s information to make an appointment:
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tutorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Tutor name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="size-5 absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand" />
                      <Input
                        placeholder="Tutor name"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="petName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Pet name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Cat className="size-5 absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand" />
                      <Input
                        placeholder="Pet name"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Phone number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="size-5 absolute left-3 top-1/2 -translate-y-1/2 transform text-content-brand" />
                      <IMaskInput
                        placeholder="(999) 999-9999"
                        mask="(000) 000-0000"
                        className="pl-10 flex h-12 w-full rounded-md border border-border-primary bg-background-tertiary px-3 py-2 text-sm text-content-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-border-brand disabled:cursor-not-allowed disabled:opacity-50 hover:border-border-secondary focus:border-border-brand focus-visible:border-border-brand aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Service description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Service description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 md:grid-cols-2 gap-4 md:space-y-0">
              <FormField
                control={form.control}
                name="scheduledAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col relative">
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            data-empty={!field.value}
                            className={cn(
                              'w-full justify-between text-left font-normal bg-background-tertiary border-border-primary text-content-primary hover:bg-background-tertiary hover:border-border-secondary hover:text-content-primary focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-border-brand focus:border-border-brand focus-visible:border-border-brand',
                              !field.value && 'text-content-secondary'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="size-5 text-content-brand" />
                              {field.value ? (
                                format(field.value, 'MM/dd/yyyy')
                              ) : (
                                <span>Select a date</span>
                              )}
                            </div>
                            <ChevronDownIcon className="opacity-50 size-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < startOfToday()}
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Time
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Clock className="size-5 text-content-brand" />
                            <SelectValue placeholder="--:-- --" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="brand"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Schedule
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
