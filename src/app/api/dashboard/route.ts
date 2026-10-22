import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const [customers, invoices] = await Promise.all([
    prisma.customer.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.invoice.findMany({
      where: { userId: user.id },
      include: { customer: true, payments: true },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalRevenue = invoices
    .filter((invoice) => invoice.status === 'PAID')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const outstanding = invoices
    .filter((invoice) => invoice.status !== 'PAID')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const pendingCount = invoices.filter((invoice) => invoice.status === 'PENDING').length;

  return NextResponse.json({
    user,
    customers,
    invoices,
    summary: {
      customers: customers.length,
      invoices: invoices.length,
      totalRevenue,
      outstanding,
      pendingCount,
    },
  });
}
