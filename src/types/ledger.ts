export type LedgerEntryKind = 'expense' | 'income'

export type LedgerExpense = {
    id: string
    amount: number
    categoryKey: string
    memo: string
    createdAt: string
    /** 없으면 지출(기존 데이터 호환) */
    kind?: LedgerEntryKind
}

export type LedgerCustomCategory = {
    id: string
    label: string
    color: string
}