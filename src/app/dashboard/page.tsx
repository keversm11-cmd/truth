import { redirect } from 'next/navigation';
import { DashboardView } from '@/components/dashboard-view';
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return <DashboardView user={user} />;
}
