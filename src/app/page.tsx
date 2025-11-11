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
    </main>
  );
}
