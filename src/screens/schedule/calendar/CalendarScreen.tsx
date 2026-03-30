import { View, TouchableOpacity } from 'react-native'
import { Typography } from '../../../components'
import dayjs from 'dayjs'
import { useState, useEffect, useMemo, type ReactNode } from 'react'
import { CREAM, WHITE, INK, INK_MUTED } from '../../../constants/appColors'
import { WEEKDAY_LABELS_KO } from '../../../constants/weekdays'
import { getMonthGridCells } from '../../../utils/monthCalendarGrid'
import { getAllRoutines, getAllTodos, getAllEvents } from '../../../database'
import type { Event, Routine, Todo } from '../../../types'

const CalendarScreen = ({
    selectedDate,
    onDateChange,
    calendarJumpKey = 0,
}: {
    selectedDate: string
    onDateChange: (date: string) => void
    calendarJumpKey?: number
}) => {
    const [currentDate, setCurrentDate] = useState(dayjs())
    const [routines, setRoutines] = useState<Routine[]>([])
    const [todos, setTodos] = useState<Todo[]>([])
    const [events, setEvents] = useState<Event[]>([])

    useEffect(() => {
        setCurrentDate(dayjs(selectedDate))
    }, [selectedDate, calendarJumpKey])

    useEffect(() => {
        try {
            setRoutines(getAllRoutines())
            setTodos(getAllTodos())
            setEvents(getAllEvents())
        } catch (e) {
            console.error('[CalendarScreen] 데이터 로딩 실패', e)
        }
    }, [currentDate])

    const dates = useMemo(() => getMonthGridCells(currentDate), [currentDate])
    const weekCount = Math.ceil(dates.length / 7)

    const renderDot = (cellDate: dayjs.Dayjs) => {
        const formatted = cellDate.format('YYYY-MM-DD')
        const dots: ReactNode[] = []
        const dayOfWeek = cellDate.day()

        const hasRoutine = routines.some(r =>
            r.daysOfWeek.includes(dayOfWeek)
        )
        const hasTodo = todos.some(t => t.date === formatted)
        const hasEvent = events.some(e => e.date === formatted)

        if (hasRoutine) {
            dots.push(
                <View
                    key="r"
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: INK,
                        marginRight: 2,
                    }}
                />
            )
        }
        if (hasTodo) {
            dots.push(
                <View
                    key="t"
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        borderWidth: 1.5,
                        borderColor: INK,
                        backgroundColor: 'transparent',
                        marginRight: 2,
                    }}
                />
            )
        }
        if (hasEvent) {
            dots.push(
                <View
                    key="e"
                    style={{
                        width: 5,
                        height: 5,
                        borderRadius: 1,
                        backgroundColor: INK,
                    }}
                />
            )
        }

        return (
            <View style={{ flexDirection: 'row', marginTop: 2 }}>{dots}</View>
        )
    }

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentDate(prev =>
            direction === 'prev' ? prev.subtract(1, 'month') : prev.add(1, 'month')
        )
    }

    const isSelected = (cellDate: dayjs.Dayjs) =>
        cellDate.format('YYYY-MM-DD') === selectedDate

    return (
        <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, backgroundColor: CREAM }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <TouchableOpacity
                    onPress={() => handleMonthChange('prev')}
                    style={{ padding: 12, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Typography variant="title" style={{ color: INK }}>{'<'}</Typography>
                </TouchableOpacity>
                <Typography variant="titleBold" style={{ color: INK }}>
                    {currentDate.format('YYYY년 MM월')}
                </Typography>
                <TouchableOpacity
                    onPress={() => handleMonthChange('next')}
                    style={{ padding: 12, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Typography variant="title" style={{ color: INK }}>{'>'}</Typography>
                </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
                {WEEKDAY_LABELS_KO.map(d => (
                    <View key={d} style={{ flex: 1, alignItems: 'center' }}>
                        <Typography variant="bodySmSemi" style={{ color: INK_MUTED }}>
                            {d}
                        </Typography>
                    </View>
                ))}
            </View>

            <View style={{ flex: 1, minHeight: 0 }}>
                {Array.from({ length: weekCount }, (_, weekIndex) => (
                    <View
                        key={weekIndex}
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            minHeight: 0,
                        }}
                    >
                        {dates.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date, dayIndex) => {
                            if (!date) {
                                return <View key={dayIndex} style={{ flex: 1 }} />
                            }

                            const formatted = date.format('YYYY-MM-DD')
                            const selected = isSelected(date)

                            return (
                                <TouchableOpacity
                                    key={dayIndex}
                                    onPress={() => onDateChange(formatted)}
                                    style={{
                                        flex: 1,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minWidth: 0,
                                    }}
                                >
                                    <View style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        backgroundColor: selected ? WHITE : 'transparent',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Typography
                                            variant={selected ? 'bodySmBold' : 'bodySmSemi'}
                                            style={{ color: selected ? INK : INK_MUTED }}
                                        >
                                            {date.date()}
                                        </Typography>
                                    </View>
                                    {renderDot(date)}
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                ))}
            </View>
        </View>
    )
}

export default CalendarScreen
