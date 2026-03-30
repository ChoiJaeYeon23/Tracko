import type { LedgerEntryKind, LedgerExpense } from '../types/ledger'

export const ledgerEntryKind = (e: LedgerExpense): LedgerEntryKind =>
    e.kind === 'income' ? 'income' : 'expense'
