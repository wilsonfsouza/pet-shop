import { AppointmentsForm } from '@/components/appointments-form';
import { PeriodSection } from '@/components/period-section';
import { APPOINTMENTS_DATA } from '@/mock-data/appointments';
import { groupAppoitmentsByPeriod } from '@/utils/groupAppoitmentsByPeriod';

export default async function Home() {
  const appointmentsPerPeriod = groupAppoitmentsByPeriod(APPOINTMENTS_DATA);
  return (
    <main className="bg-background-primary p-6">
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-title-size text-content-primary mb-2">
              Your schedule
            </h1>
            <p className="text-paragraph-medium text-content-secondary">
              Here you can see all of your clients and services scheduled for
              today.
            </p>
          </div>
        </div>
        <div className="pb-24 md:pb-0 flex flex-col gap-3">
          {appointmentsPerPeriod.map((period) => (
            <PeriodSection key={period.type} period={period} />
          ))}
        </div>
      </section>
      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-background-tertiary py-4.5 px-6 md:bottom-8 md:right-7.5 md:left-auto md:top-auto md:w-auto md:bg-transparent md:p-0">
        <AppointmentsForm />
      </div>
    </main>
  );
}
