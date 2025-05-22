import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import dayjs from 'dayjs'
import { useState } from 'react'

// 테스트용 더미데이터, 루틴은 요일 기반 저장
const routineDays = [1, 3, 5]
const todos = ['2025-05-03', '2025-05-15', '2025-05-21']
const events = ['2025-05-01', '2025-05-20', '2025-05-25']

const CalendarScreen = (
    { selectedDate, onDateChange }: {
        selectedDate: string
        onDateChange: (date: string) => void
    }
) => {
    const [currentDate, setCurrentDate] = useState(dayjs())

    const startOfMonth = currentDate.startOf('month')
    const endOfMonth = currentDate.endOf('month')
    const startDay = startOfMonth.day()
    const daysInMonth = endOfMonth.date()

    const dates: (dayjs.Dayjs | null)[] = []

    for (let i = 0; i < startDay; i++) {
        dates.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
        dates.push(startOfMonth.date(i))
    }

    const renderDot = (date: dayjs.Dayjs) => {
        const formatted = date.format('YYYY-MM-DD')
        const dots = []

        // 요일 기반 루틴 (0=일 ~ 6=토)
        if (routineDays.includes(date.day())) {
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

        if (todos.includes(formatted)) {
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

        if (events.includes(formatted)) {
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
        <View style={{ padding: 20 }}>
            {/* 월 이동 헤더 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <TouchableOpacity onPress={() => handleMonthChange('prev')}>
                    <Text style={{ fontSize: 18 }}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{currentDate.format('YYYY년 MM월')}</Text>
                <TouchableOpacity onPress={() => handleMonthChange('next')}>
                    <Text style={{ fontSize: 18 }}>{'>'}</Text>
                </TouchableOpacity>
            </View>

            {/* 요일 헤더 */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                    <Text
                        key={d}
                        style={{
                            width: `${100 / 7}%`,
                            textAlign: 'center',
                            fontWeight: '600',
                            color: '#444',
                        }}>
                        {d}
                    </Text>
                ))}
            </View>

            {/* 날짜 셀 */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {dates.map((date, index) => {
                    if (!date) {
                        return <View key={index} style={{ width: `${100 / 7}%`, height: 60 }} />
                    }

                    const formatted = date.format('YYYY-MM-DD')
                    const selected = isSelected(date)

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => onDateChange(formatted)}
                            style={{
                                width: `${100 / 7}%`,
                                height: 60,
                                alignItems: 'center',
                                justifyContent: 'center',
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
        </View>
    )
}

export default CalendarScreen