import type { Dayjs } from 'dayjs'

/** 한 달 달력 격자(앞뒤 빈 칸 포함). `anyDayInMonth`는 해당 월 아무 날. */
export function getMonthGridCells(anyDayInMonth: Dayjs): (Dayjs | null)[] {
    const startOfMonth = anyDayInMonth.startOf('month')
    const endOfMonth = anyDayInMonth.endOf('month')
    const startDay = startOfMonth.day()
    const daysInMonth = endOfMonth.date()
    const cells: (Dayjs | null)[] = []

    for (let i = 0; i < startDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(startOfMonth.clone().add(d - 1, 'day'))
    }
    const tail = cells.length % 7
    if (tail !== 0) {
        for (let i = 0; i < 7 - tail; i++) cells.push(null)
    }
    return cells
}
