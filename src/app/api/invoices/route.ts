import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const invoiceSchema = z.object({
  customerId: z.string().min(1),
  total: z.coerce.number().positive(),
  dueDate: z.string().min(1),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE']).optional(),
  notes: z.string().optional().or(z.literal('')),
});

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const invoices = await prisma.invoice.findMany({
    where: { userId: user.id },
    include: {
      customer: true,
      payments: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(invoices);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = invoiceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid invoice data.' }, { status: 400 });
    }

    const invoice = await prisma.invoice.create({
      data: {
        userId: user.id,
        customerId: parsed.data.customerId,
        total: parsed.data.total,
        dueDate: new Date(parsed.data.dueDate),
        status: parsed.data.status ?? 'PENDING',
        notes: parsed.data.notes || null,
      },
      include: {
        customer: true,
        payments: true,
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error('Invoice creation error:', error);
    return NextResponse.json({ message: 'Failed to create invoice.' }, { status: 500 });
  }
}
