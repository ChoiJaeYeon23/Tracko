import { useMemo, useState, useCallback } from 'react'
import {
    View,
    Text,
    SectionList,
    TouchableOpacity,
    Alert
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import dayjs from 'dayjs'
import { Event } from '../../../types'
import { getAllEvents, deleteEvent } from '../../../database'

// 선택한 날짜 기준 이번 주 월요일, 일요일 구하는 함수
const getWeekRange = (date: dayjs.Dayjs) => {
    const day = date.day() // 0(일) ~ 6(토)
    const monday = date.subtract(day === 0 ? 6 : day - 1, 'day') // 일요일이면 -6일, 그 외는 (요일-1)일 뺌
    const sunday = monday.add(6, 'day')
    console.log('[getWeekRange] monday:', monday.format('YYYY-MM-DD'), ', sunday:', sunday.format('YYYY-MM-DD'))
    return { monday, sunday }
}

const EventScreen = (
    { selectedDate }: { selectedDate: string }
) => {
    const selectedDay = dayjs(selectedDate).startOf('day')
    const { monday, sunday } = getWeekRange(selectedDay)

    const [selectedDayEvents, setSelectedDayEvents] = useState<Event[]>([])
    const [weekEvents, setWeekEvents] = useState<Event[]>([])

    const fetchEvents = useCallback(() => {
        console.log('[fetchEvents] 시작')
        const allEvents = getAllEvents()

        const filteredSelectedDay = allEvents.filter(event => {
            const isSame = dayjs(event.date).startOf('day').isSame(selectedDay, 'day')
            return isSame
        })

        const filteredWeek = allEvents.filter(event => {
            const d = dayjs(event.date).startOf('day')
            const start = monday.startOf('day')
            const end = sunday.startOf('day')

            const isInRange =
                (d.isAfter(start) || d.isSame(start, 'day')) &&
                (d.isBefore(end) || d.isSame(end, 'day'))

            const isNotSelectedDay = !d.isSame(selectedDay, 'day')

            return isInRange && isNotSelectedDay
        })

        setSelectedDayEvents(filteredSelectedDay)
        setWeekEvents(filteredWeek)
    }, [selectedDate])

    useFocusEffect(
        useCallback(() => {
            fetchEvents()
        }, [selectedDate])
    )

    const handleDeleteEvent = (event: Event) => {
        Alert.alert(
            '일정 삭제',
            `"${event.title}" 일정을 삭제하시겠습니까?`,
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: () => {
                        try {
                            deleteEvent(event.id)
                            // 일정 목록 새로고침
                            fetchEvents()
                            Alert.alert('삭제 완료', '일정이 삭제되었습니다.')
                        } catch (error) {
                            console.error('[EventScreen] 일정 삭제 실패:', error)
                            Alert.alert('삭제 실패', '일정 삭제에 실패했습니다.')
                        }
                    }
                }
            ]
        )
    }

    const sections = [
        {
            title: selectedDay.format('YYYY년 M월 D일 일정'),
            data: selectedDayEvents.length > 0 ? selectedDayEvents : [{ id: 'none1', title: '일정이 없습니다', date: '', location: '' }],
            isEmpty: selectedDayEvents.length === 0,
        },
        {
            title: `${monday.format('M.D')} - ${sunday.format('M.D')} 주간 일정`,
            data: weekEvents.length > 0 ? weekEvents : [{ id: 'none2', title: '주간 일정이 없습니다', date: '', location: '' }],
            isEmpty: weekEvents.length === 0,
        },
    ].filter(section => section.data.length > 0)

    console.log('[render] sections:', sections)

    return (
        <View style={{ padding: 10, flex: 1 }}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, backgroundColor: 'powderblue' }}>
                        {title}
                    </Text>
                )}
                renderItem={({ item, section }) => {
                    if (section.isEmpty) {
                        return (
                            <Text style={{ padding: 12, color: '#999' }}>{item.title}</Text>
                        )
                    }

                    return (
                        <View style={{ 
                            padding: 12, 
                            backgroundColor: '#f9f9f9', 
                            borderRadius: 8, 
                            marginBottom: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
                                <Text style={{ color: '#555' }}>날짜: {dayjs(item.date).format('YYYY-MM-DD')}</Text>
                                {item.location && <Text style={{ color: '#555' }}>장소: {item.location}</Text>}
                            </View>
                            
                            <TouchableOpacity
                                onPress={() => handleDeleteEvent(item)}
                                style={{
                                    backgroundColor: '#ff4444',
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    borderRadius: 4,
                                    marginLeft: 10
                                }}
                            >
                                <Text style={{ color: 'white', fontSize: 12 }}>삭제</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }}
            />
        </View>
    )
}

export default EventScreen
