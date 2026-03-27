import { useCallback, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import uuid from 'react-native-uuid'
import {
    addLedgerExpense,
    deleteLedgerExpense,
    getAllLedgerExpenses,
    getMonthBudget,
    setMonthBudget,
    filterExpensesByMonth,
    addCustomLedgerCategory,
    deleteCustomLedgerCategory,
    getCustomLedgerCategories,
} from '../database/ledger/ledgerStorage'
import {
    getLedgerCategory,
    getAllLedgerCategories,
} from '../constants/ledgerCategories'
import type { LedgerExpense } from '../types/ledger'

export type CategoryAggregate = {
    categoryKey: string
    label: string
    color: string
    total: number
    shareOfMonth: number
    items: LedgerExpense[]
}

const sortByDateDesc = (a: LedgerExpense, b: LedgerExpense) =>
    b.createdAt.localeCompare(a.createdAt)

export function useLedger() {
    const monthKey = dayjs().format('YYYY-MM')
    const [tick, setTick] = useState(0)

    const refresh = useCallback(() => setTick(t => t + 1), [])

    const expensesThisMonth = useMemo(() => {
        const all = getAllLedgerExpenses()
        return filterExpensesByMonth(all, monthKey).sort(sortByDateDesc)
    }, [monthKey, tick])

    const budget = useMemo(() => getMonthBudget(monthKey), [monthKey, tick])

    const allCategories = useMemo(() => getAllLedgerCategories(), [tick])

    const customCategories = useMemo(() => getCustomLedgerCategories(), [tick])

    const totalSpent = useMemo(
        () => expensesThisMonth.reduce((s, e) => s + e.amount, 0),
        [expensesThisMonth]
    )

    const spentPercent =
        budget > 0 ? Math.min(100, (totalSpent / budget) * 100) : 0
    const displayPercent = budget > 0 ? (totalSpent / budget) * 100 : 0

    const categoryAggregates: CategoryAggregate[] = useMemo(() => {
        const map = new Map<string, LedgerExpense[]>()
        for (const e of expensesThisMonth) {
            const list = map.get(e.categoryKey) ?? []
            list.push(e)
            map.set(e.categoryKey, list)
        }
        return [...map.entries()]
            .map(([categoryKey, items]) => {
                const sorted = [...items].sort(sortByDateDesc)
                const total = sorted.reduce((s, i) => s + i.amount, 0)
                const def = getLedgerCategory(categoryKey)
                return {
                    categoryKey,
                    label: def.label,
                    color: def.color,
                    total,
                    shareOfMonth: totalSpent > 0 ? (total / totalSpent) * 100 : 0,
                    items: sorted,
                }
            })
            .sort((a, b) => b.total - a.total)
    }, [expensesThisMonth, totalSpent])

    const updateBudget = useCallback(
        (amount: number) => {
            setMonthBudget(monthKey, amount)
            refresh()
        },
        [monthKey, refresh]
    )

    const appendExpense = useCallback(
        (input: {
            amount: number
            categoryKey: string
            memo: string
        }) => {
            const row: LedgerExpense = {
                id: String(uuid.v4()),
                amount: Math.max(0, Math.round(input.amount)),
                categoryKey: input.categoryKey,
                memo: input.memo.trim(),
                createdAt: dayjs().toISOString(),
            }
            if (row.amount <= 0) return
            addLedgerExpense(row)
            refresh()
        },
        [refresh]
    )

    const removeExpense = useCallback(
        (id: string) => {
            deleteLedgerExpense(id)
            refresh()
        },
        [refresh]
    )

    const appendCustomCategory = useCallback(
        (label: string, color: string) => {
            const key = addCustomLedgerCategory(label, color)
            refresh()
            return key
        },
        [refresh]
    )

    const removeCustomCategory = useCallback((id: string) => {
        deleteCustomLedgerCategory(id)
        refresh()
    }, [refresh])

    const monthLabel = useMemo(() => dayjs(monthKey + '-01').format('YYYY년 M월'), [monthKey])

    return {
        monthKey,
        monthLabel,
        budget,
        totalSpent,
        spentPercent,
        displayPercent,
        categoryAggregates,
        allCategories,
        customCategories,
        updateBudget,
        appendExpense,
        removeExpense,
        appendCustomCategory,
        removeCustomCategory,
        refresh,
    }
}