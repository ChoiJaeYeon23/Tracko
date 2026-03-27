import { MMKV } from 'react-native-mmkv'
import uuid from 'react-native-uuid'
import type { LedgerExpense, LedgerCustomCategory } from '../../types/ledger'

export const ledgerStorage = new MMKV({ id: 'ledgerStorage' })

const EXPENSES_KEY = 'ledger:expenses'
const BUDGETS_KEY = 'ledger:budgets'
const CUSTOM_CATEGORIES_KEY = 'ledger:customCategories'

export const customCategoryStorageKey = (id: string) => `custom:${id}`

export const getAllLedgerExpenses = (): LedgerExpense[] => {
    try {
        const raw = ledgerStorage.getString(EXPENSES_KEY)
        return raw ? JSON.parse(raw) : []
    } catch (e) {
        console.error('[LedgerStorage] 지출 목록 로드 실패', e)
        return []
    }
}

const persistExpenses = (list: LedgerExpense[]) => {
    ledgerStorage.set(EXPENSES_KEY, JSON.stringify(list))
}

export const addLedgerExpense = (expense: LedgerExpense): void => {
    const list = getAllLedgerExpenses()
    persistExpenses([expense, ...list])
}

export const deleteLedgerExpense = (id: string): void => {
    const list = getAllLedgerExpenses().filter(e => e.id !== id)
    persistExpenses(list)
}

export const getBudgetMap = (): Record<string, number> => {
    try {
        const raw = ledgerStorage.getString(BUDGETS_KEY)
        return raw ? JSON.parse(raw) : {}
    } catch {
        return {}
    }
}

export const setMonthBudget = (monthKey: string, amount: number): void => {
    const map = getBudgetMap()
    map[monthKey] = Math.max(0, Math.round(amount))
    ledgerStorage.set(BUDGETS_KEY, JSON.stringify(map))
}

export const getMonthBudget = (monthKey: string): number => {
    const map = getBudgetMap()
    const v = map[monthKey]
    return typeof v === 'number' && !Number.isNaN(v) ? v : 0
}

export const filterExpensesByMonth = (
    expenses: LedgerExpense[],
    monthKey: string
): LedgerExpense[] =>
    expenses.filter(e => e.createdAt.slice(0, 7) === monthKey)

export const getCustomLedgerCategories = (): LedgerCustomCategory[] => {
    try {
        const raw = ledgerStorage.getString(CUSTOM_CATEGORIES_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

const persistCustomCategories = (list: LedgerCustomCategory[]) => {
    ledgerStorage.set(CUSTOM_CATEGORIES_KEY, JSON.stringify(list))
}

/** 추가된 categoryKey (`custom:<id>`) 반환, 실패 시 null */
export const addCustomLedgerCategory = (
    label: string,
    color: string
): string | null => {
    const t = label.trim()
    if (!t) return null
    const list = getCustomLedgerCategories()
    const id = String(uuid.v4())
    list.push({ id, label: t, color })
    persistCustomCategories(list)
    return customCategoryStorageKey(id)
}

export const deleteCustomLedgerCategory = (id: string): void => {
    const list = getCustomLedgerCategories().filter(c => c.id !== id)
    persistCustomCategories(list)
}