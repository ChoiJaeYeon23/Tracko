import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import dayjs from 'dayjs'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllRoutines, getAllTodos, getAllEvents } from '../../../database'

const CalendarScreen = (
    { selectedDate, onDateChange }: {
        selectedDate: string
        onDateChange: (date: string) => void
    }
) => {
    const [currentDate, setCurrentDate] = useState(dayjs())

    // selectedDate가 변경될 때 currentDate 동기화
    useEffect(() => {
        setCurrentDate(dayjs(selectedDate))
    }, [selectedDate])

    // 실제 데이터베이스에서 데이터 가져오기
    const [routines, setRoutines] = useState<any[]>([])
    const [todos, setTodos] = useState<any[]>([])
    const [events, setEvents] = useState<any[]>([])

    useEffect(() => {
        try {
            setRoutines(getAllRoutines())
            setTodos(getAllTodos())
            setEvents(getAllEvents())
        } catch (error) {
            console.error('캘린더 데이터 로딩 실패:', error)
        }
    }, [currentDate])

    const startOfMonth = currentDate.startOf('month')
    const endOfMonth = currentDate.endOf('month')
    const startDay = startOfMonth.day() // 0=일요일, 1=월요일, ..., 6=토요일
    const daysInMonth = endOfMonth.date()

    const dates: (dayjs.Dayjs | null)[] = []

    // 월의 첫 번째 날이 시작되는 요일까지 빈 칸 추가
    for (let i = 0; i < startDay; i++) {
        dates.push(null)
    }

// 해당 월의 모든 날짜 추가
for (let i = 1; i <= daysInMonth; i++) {
    const currentDate = startOfMonth.clone().add(i - 1, 'day')
    dates.push(currentDate)
}

    // 7의 배수로 맞추기 위해 마지막 주에 빈 칸 추가
    const remainingCells = 7 - (dates.length % 7)
    if (remainingCells < 7 && remainingCells > 0) {
        for (let i = 0; i < remainingCells; i++) {
            dates.push(null)
        }
    }

    const todoDateSet = useMemo(() => new Set(todos.map(t => t.date)), [todos])
    const eventDateSet = useMemo(() => new Set(events.map(e => e.date)), [events])

    const hasRoutineOnDay = useCallback((dayOfWeek: number) => 
        routines.some(r => r.daysOfWeek.includes(dayOfWeek)), [routines])

    const renderDot = (date: dayjs.Dayjs) => {
        const formatted = date.format('YYYY-MM-DD')
        const dayOfWeek = date.day()
        const hasRoutine = hasRoutineOnDay(dayOfWeek)
        const hasTodo = todoDateSet.has(formatted)
        const hasEvent = eventDateSet.has(formatted)

        const dots = []
        if (hasRoutine) {
            dots.push(
                <View
                    key="routine"
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#ff8fab',
                        marginRight: 2,
                    }}
                />
            )
        }

        if (hasTodo) {
            dots.push(
                <View
                    key="todo"
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#ffd966',
                        marginRight: 2,
                    }}
                />
            )
        }

        if (hasEvent) {
            dots.push(
                <View
                    key="event"
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#7ecfff',
                    }}
                />
            )
        }

        return (
            <View style={{ flexDirection: 'row', marginTop: 2 }}>
                {dots}
            </View>
        )
    }

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentDate((prev) =>
            direction === 'prev' ? prev.subtract(1, 'month') : prev.add(1, 'month')
        )
    }

    const isSelected = (date: dayjs.Dayjs) => {
        return date.format('YYYY-MM-DD') === selectedDate
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            {/* 월 이동 헤더 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <TouchableOpacity 
                    onPress={() => handleMonthChange('prev')}
                    style={{ padding: 12, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={{ fontSize: 18 }}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{currentDate.format('YYYY년 MM월')}</Text>
                <TouchableOpacity 
                    onPress={() => handleMonthChange('next')}
                    style={{ padding: 12, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text style={{ fontSize: 18 }}>{'>'}</Text>
                </TouchableOpacity>
            </View>

            {/* 요일 헤더 */}
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                    <View key={d} style={{ flex: 1, alignItems: 'center' }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#444' }}>
                            {d}
                        </Text>
                    </View>
                ))}
            </View>

            {/* 날짜 셀 */}
            <View style={{ flex: 1, maxHeight: 300 }}>
                {Array.from({ length: Math.ceil(dates.length / 7) }, (_, weekIndex) => (
                    <View key={weekIndex} style={{ flexDirection: 'row' }}>
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
                                        paddingVertical: 4,
                                    }}
                                >
                                    <View style={{
                                        width: 32, height: 32,
                                        borderRadius: 16,
                                        backgroundColor: selected ? '#4b9eff' : 'transparent',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Text style={{ fontSize: 14, color: selected ? '#fff' : '#000' }}>
                                            {date.date()}
                                        </Text>
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