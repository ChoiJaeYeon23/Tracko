import { useCallback, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/ko'
import { useFocusEffect } from '@react-navigation/native'
import {
    getAllLedgerExpenses,
    getMonthBudget,
    filterExpensesByMonth,
} from '../database/ledger/ledgerStorage'
import { getAllTodos, getAllEvents, getAllRoutines } from '../database'
import { ledgerEntryKind } from '../utils/ledgerEntryKind'

dayjs.locale('ko')

export type HomeDashboardSnapshot = {
    monthKey: string
    monthLabel: string
    totalSpent: number
    totalIncome: number
    budget: number
    dateLine: string
    weekdayLabel: string
    todosTodayTotal: number
    todosTodayOpen: number
    eventsTodayCount: number
    routinesTodayCount: number
}

function buildSnapshot(): HomeDashboardSnapshot {
    const now = dayjs()
    const monthKey = now.format('YYYY-MM')
    const todayStr = now.format('YYYY-MM-DD')
    const weekday = now.day()

    const entries = filterExpensesByMonth(getAllLedgerExpenses(), monthKey)
    let totalSpent = 0
    let totalIncome = 0
    for (const e of entries) {
        if (ledgerEntryKind(e) === 'income') {
            totalIncome += e.amount
        } else {
            totalSpent += e.amount
        }
    }

    const budget = getMonthBudget(monthKey)
    const todosToday = getAllTodos().filter(t => t.date === todayStr)
    const eventsToday = getAllEvents().filter(e => e.date === todayStr)
    const routinesToday = getAllRoutines().filter(r =>
        r.daysOfWeek.includes(weekday)
    )

    return {
        monthKey,
        monthLabel: now.format('YYYY년 M월'),
        totalSpent,
        totalIncome,
        budget,
        dateLine: now.format('M월 D일'),
        weekdayLabel: now.format('dddd'),
        todosTodayTotal: todosToday.length,
        todosTodayOpen: todosToday.filter(t => !t.isCompleted).length,
        eventsTodayCount: eventsToday.length,
        routinesTodayCount: routinesToday.length,
    }
}

/** 홈 요약: 이번 달 가계부 + 오늘 일정 집계. 탭 진입 시마다 갱신 */
export function useHomeDashboard() {
    const [tick, setTick] = useState(0)
    const refresh = useCallback(() => setTick(t => t + 1), [])

    useFocusEffect(
        useCallback(() => {
            refresh()
        }, [refresh])
    )

    const snapshot = useMemo(() => buildSnapshot(), [tick])

    return { ...snapshot, refresh }
}
