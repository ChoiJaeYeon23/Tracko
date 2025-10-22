import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
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
        console.log('=== 캘린더 useEffect 실행 ===')
        console.log('currentDate:', currentDate.format('YYYY-MM-DD'))
        
        try {
            const routinesData = getAllRoutines()
            const todosData = getAllTodos()
            const eventsData = getAllEvents()
            
            console.log('=== 캘린더 데이터 로딩 ===')
            console.log('루틴 개수:', routinesData.length)
            console.log('투두 개수:', todosData.length)
            console.log('일정 개수:', eventsData.length)
            
            if (routinesData.length > 0) {
                console.log('루틴 상세:', routinesData.map(r => ({ 
                    title: r.title, 
                    daysOfWeek: r.daysOfWeek,
                    time: r.time 
                })))
            }
            
            if (todosData.length > 0) {
                console.log('투두 상세:', todosData.map(t => ({ 
                    title: t.title, 
                    date: t.date
                })))
            }
            
            if (eventsData.length > 0) {
                console.log('일정 상세:', eventsData.map(e => ({ 
                    title: e.title, 
                    date: e.date
                })))
            }
            
            setRoutines(routinesData)
            setTodos(todosData)
            setEvents(eventsData)
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

    // 디버깅용 로그
    console.log('startDay:', startDay)
    console.log('daysInMonth:', daysInMonth)
    console.log('dates length:', dates.length)
    console.log('remainingCells:', remainingCells)
    console.log('dates array:', dates.map(d => d ? d.format('DD') : 'null'))

    const renderDot = (date: dayjs.Dayjs) => {
        const formatted = date.format('YYYY-MM-DD')
        const dots = []
        const dayOfWeek = date.day()

        // 실제 루틴 데이터에서 해당 요일에 루틴이 있는지 확인
        const hasRoutine = routines.some(routine => {
            const hasDay = routine.daysOfWeek.includes(dayOfWeek)
            if (hasDay) {
                console.log(`[Calendar] 루틴 발견: ${routine.title}, 요일: ${dayOfWeek}, 설정된 요일들: ${routine.daysOfWeek}`)
            }
            return hasDay
        })

        // 실제 투두 데이터에서 해당 날짜에 투두가 있는지 확인
        const hasTodo = todos.some(todo => todo.date === formatted)

        // 실제 일정 데이터에서 해당 날짜에 일정이 있는지 확인
        const hasEvent = events.some(event => event.date === formatted)

        if (hasRoutine || hasTodo || hasEvent) {
            console.log(`[Calendar] ${formatted} (요일: ${dayOfWeek}) - 루틴: ${hasRoutine}, 투두: ${hasTodo}, 일정: ${hasEvent}`)
        }

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
            <View style={{ marginBottom: 40 }}>
                {Array.from({ length: Math.ceil(dates.length / 7) }, (_, weekIndex) => (
                    <View key={weekIndex} style={{ flexDirection: 'row', marginBottom: 12 }}>
                        {dates.slice(weekIndex * 7, (weekIndex + 1) * 7).map((date, dayIndex) => {
                            if (!date) {
                                return <View key={dayIndex} style={{ flex: 1, height: 60 }} />
                            }

                            const formatted = date.format('YYYY-MM-DD')
                            const selected = isSelected(date)

                            return (
                                <TouchableOpacity
                                    key={dayIndex}
                                    onPress={() => onDateChange(formatted)}
                                    style={{
                                        flex: 1,
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
                ))}
            </View>
        </View>
    )
}

export default CalendarScreen