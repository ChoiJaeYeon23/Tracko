import { useCallback, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { useFocusEffect } from '@react-navigation/native'
import {
    getAllLedgerExpenses,
    filterExpensesByMonth,
} from '../database/ledger/ledgerStorage'
import { getAllTodos, getAllEvents, getAllRoutines } from '../database'
import { ledgerEntryKind } from '../utils/ledgerEntryKind'
import { getLedgerCategory } from '../constants/ledgerCategories'

dayjs.locale('ko')

export type AnalysisCategoryRow = {
    label: string
    total: number
    color: string
}

function monthSpentIncome(monthKey: string) {
    const entries = filterExpensesByMonth(getAllLedgerExpenses(), monthKey)
    let spent = 0
    let income = 0
    for (const e of entries) {
        if (ledgerEntryKind(e) === 'income') {
            income += e.amount
        } else {
            spent += e.amount
        }
    }
    return { spent, income }
}

function topExpenseCategories(
    monthKey: string,
    limit: number
): AnalysisCategoryRow[] {
    const entries = filterExpensesByMonth(
        getAllLedgerExpenses(),
        monthKey
    ).filter(e => ledgerEntryKind(e) === 'expense')
    const map = new Map<string, number>()
    for (const e of entries) {
        map.set(e.categoryKey, (map.get(e.categoryKey) ?? 0) + e.amount)
    }
    return [...map.entries()]
        .map(([key, total]) => {
            const c = getLedgerCategory(key)
            return { label: c.label, color: c.color, total }
        })
        .sort((a, b) => b.total - a.total)
        .slice(0, limit)
}

function buildAnalysis() {
    const now = dayjs()
    const thisMonthKey = now.format('YYYY-MM')
    const prevMonth = dayjs(`${thisMonthKey}-01`).subtract(1, 'month')
    const prevMonthKey = prevMonth.format('YYYY-MM')

    const cur = monthSpentIncome(thisMonthKey)
    const prev = monthSpentIncome(prevMonthKey)

    let spentVsPrevPercent: number | null = null
    if (prev.spent > 0) {
        spentVsPrevPercent = ((cur.spent - prev.spent) / prev.spent) * 100
    } else if (cur.spent > 0) {
        spentVsPrevPercent = null
    } else {
        spentVsPrevPercent = 0
    }

    const todos = getAllTodos()
    const topCategories = topExpenseCategories(thisMonthKey, 3)

    return {
        thisMonthKey,
        thisMonthLabel: now.format('YYYY년 M월'),
        prevMonthLabel: prevMonth.format('YYYY년 M월'),
        thisSpent: cur.spent,
        thisIncome: cur.income,
        prevSpent: prev.spent,
        prevIncome: prev.income,
        spentVsPrevPercent,
        topCategories,
        todosTotal: todos.length,
        todosDone: todos.filter(t => t.isCompleted).length,
        eventsTotal: getAllEvents().length,
        routinesTotal: getAllRoutines().length,
    }
}

/** 분석 탭: 월간 비교·카테고리 상위·일정 데이터 규모 */
export function useAnalysisSnapshot() {
    const [tick, setTick] = useState(0)
    const refresh = useCallback(() => setTick(t => t + 1), [])

    useFocusEffect(
        useCallback(() => {
            refresh()
        }, [refresh])
    )

    const snapshot = useMemo(() => buildAnalysis(), [tick])

    return { ...snapshot, refresh }
}
