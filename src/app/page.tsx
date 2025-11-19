import { AppointmentsForm } from '@/components/appointments-form';
import { DatePicker } from '@/components/date-picker';
import { PeriodSection } from '@/components/period-section';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { groupAppoitmentsByPeriod } from '@/utils/groupAppoitmentsByPeriod';
import { endOfDay, parseISO, startOfDay } from 'date-fns';

type HomeProps = {
  searchParams: Promise<{ date: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const { date } = await searchParams;
  const TODAY = new Date();
  const selectedDate = date ? parseISO(date) : TODAY;

  const appointments = await prisma.appointment.findMany({
    where: {
      scheduledAt: {
        gte: startOfDay(selectedDate),
        lte: endOfDay(selectedDate),
      },
    },
    orderBy: {
      scheduledAt: 'asc',
    },
  });
  const appointmentsPerPeriod = groupAppoitmentsByPeriod(appointments);
  return (
    <div className="bg-background-primary p-6">
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-title-size text-content-primary mb-2 md:mb-0">
              Your schedule
            </h1>
            <p className="text-paragraph-medium text-content-secondary">
              Here you can see all of your clients and services scheduled for
              today.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <DatePicker />
          </div>
        </div>

        <div className="mt-3 mb-8 flex items-center gap-4 md:hidden">
          <DatePicker />
        </div>

        <div className="pb-24 md:pb-0 flex flex-col gap-3">
          {appointmentsPerPeriod.map((period) => (
            <PeriodSection key={period.type} period={period} />
          ))}
        </div>
      </section>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-background-tertiary py-4.5 px-6 md:bottom-8 md:right-7.5 md:left-auto md:top-auto md:w-auto md:bg-transparent md:p-0">
        <AppointmentsForm>
          <Button variant="brand">New Schedule</Button>
        </AppointmentsForm>
      </div>
    </div>
  );
}
