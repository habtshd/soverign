import prisma from '../../config/database.js';
import { AppError } from '../../middleware/errorHandler.js';
import { logAuditEvent } from '../../middleware/audit.js';

export class FinanceService {
  static async getOverview() {
    const [incomes, expenses, invoices, payments] = await Promise.all([
      prisma.income.aggregate({ _sum: { amount: true } }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
      prisma.invoice.findMany({
        include: {
          member: {
            include: { user: { select: { firstName: true, lastName: true, email: true } } },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.payment.findMany({
        include: {
          member: {
            include: { user: { select: { firstName: true, lastName: true } } },
          },
          invoice: true,
        },
        orderBy: { paidAt: 'desc' },
        take: 20,
      }),
    ]);

    const totalIncome = incomes._sum.amount || 0;
    const totalExpenses = expenses._sum.amount || 0;
    const netBalance = totalIncome - totalExpenses;

    const recentExpenses = await prisma.expense.findMany({
      include: {
        category: true,
        approvedBy: { select: { firstName: true, lastName: true } },
      },
      orderBy: { date: 'desc' },
      take: 15,
    });

    return {
      metrics: {
        totalIncome,
        totalExpenses,
        netBalance,
        pendingInvoicesCount: invoices.filter((i) => i.status === 'PENDING').length,
      },
      invoices,
      payments,
      recentExpenses,
    };
  }

  static async getCategories() {
    return prisma.financialCategory.findMany();
  }

  static async recordExpense(data: any, approvedById?: string) {
    const expense = await prisma.expense.create({
      data: {
        categoryId: data.categoryId,
        title: data.title,
        amount: Number(data.amount),
        date: data.date ? new Date(data.date) : new Date(),
        receiptUrl: data.receiptUrl,
        notes: data.notes,
        approvedById,
      },
      include: { category: true },
    });

    await logAuditEvent({
      userId: approvedById,
      action: 'CREATE',
      entity: 'Expense',
      entityId: expense.id,
      details: { title: expense.title, amount: expense.amount },
    });

    return expense;
  }

  static async recordIncome(data: any) {
    return prisma.income.create({
      data: {
        categoryId: data.categoryId,
        title: data.title,
        amount: Number(data.amount),
        date: data.date ? new Date(data.date) : new Date(),
        source: data.source || 'MEMBERSHIP_DUES',
        notes: data.notes,
      },
      include: { category: true },
    });
  }

  static async createInvoice(data: any) {
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-2026-${String(count + 1).padStart(4, '0')}`;

    return prisma.invoice.create({
      data: {
        invoiceNumber,
        memberId: data.memberId,
        amount: Number(data.amount),
        dueDate: new Date(data.dueDate),
        itemsJson: typeof data.items === 'string' ? data.items : JSON.stringify(data.items),
        status: 'PENDING',
      },
    });
  }

  static async recordPayment(data: any) {
    const payment = await prisma.payment.create({
      data: {
        invoiceId: data.invoiceId || null,
        memberId: data.memberId,
        amount: Number(data.amount),
        paymentMethod: data.paymentMethod || 'CREDIT_CARD',
        referenceNumber: data.referenceNumber,
        status: 'COMPLETED',
      },
    });

    if (data.invoiceId) {
      await prisma.invoice.update({
        where: { id: data.invoiceId },
        data: { status: 'PAID' },
      });
    }

    return payment;
  }
}
