export type LedgerExpense = {
    id: string
    amount: number
    categoryKey: string
    memo: string
    createdAt: string
}

export type LedgerCustomCategory = {
    id: string
    label: string
    color: string
}