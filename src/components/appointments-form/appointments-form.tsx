'use client';

import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { Cat, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const appointmentsFormSchema = z.object({
  tutorName: z.string().min(3, 'Tutor name is required'),
  petName: z.string().min(3, 'Pet name is required'),
  phone: z.string().min(10, 'Phone number is required'),
  description: z.string().min(3, 'Description is required'),
});

type AppointmentFormValues = z.infer<typeof appointmentsFormSchema>;

export const AppointmentsForm = () => {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentsFormSchema),
    defaultValues: {
      tutorName: '',
      petName: '',
      description: '',
      phone: '',
    },
  });

  const onSubmit = (data: AppointmentFormValues) => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="brand">New Schedule</Button>
      </DialogTrigger>

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

            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
