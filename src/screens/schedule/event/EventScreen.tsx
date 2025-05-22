import { useMemo } from 'react'
import {
    View,
    Text,
    FlatList,
    SectionList
} from 'react-native'
import { Event } from '../../../types'
import dayjs from 'dayjs'

// 선택한 날짜 기준 이번 주 월요일, 일요일 구하는 함수
const getWeekRange = (date: dayjs.Dayjs) => {
    const day = date.day() // 0(일) ~ 6(토)
    const monday = date.subtract(day === 0 ? 6 : day - 1, 'day') // 일요일이면 -6일, 그 외는 (요일-1)일 뺌
    const sunday = monday.add(6, 'day')
    return { monday, sunday }
}

// 테스트용 더미 데이터
const dummyEvents: Event[] = [
    { id: '1', title: '스터디 모임', date: '2025-05-19', location: '카페' },
    { id: '2', title: '헬스', date: '2025-05-21', location: '헬스장' },
    { id: '3', title: '면접', date: '2025-05-23', location: '강남' },
    { id: '4', title: '가족 식사', date: '2025-05-25', location: '식당' },
    { id: '5', title: '치과 예약', date: '2025-05-30', location: '치과' },
    { id: '6', title: '책 읽기', date: '2025-05-21', location: '도서관' },
    { id: '7', title: '친구 만나기', date: '2025-05-19', location: '카페' },
    { id: '8', title: '영화 관람', date: '2025-05-23', location: '영화관' },
    { id: '9', title: '운동하기', date: '2025-05-24', location: '헬스장' },
    { id: '10', title: '회의', date: '2025-05-25', location: '사무실' },
    { id: '11', title: '마트 장보기', date: '2025-05-26', location: '마트' },
    { id: '12', title: '카페에서 작업', date: '2025-05-21', location: '카페' },
    { id: '13', title: '요가 수업', date: '2025-05-27', location: '요가센터' },
    { id: '14', title: '개발 공부', date: '2025-05-19', location: '집' },
    { id: '15', title: '가족 전화', date: '2025-05-30', location: '집' },
]

const EventScreen = (
    { selectedDate }: { selectedDate: string }
) => {
    const selectedDay = dayjs(selectedDate).startOf('day')
    const { monday, sunday } = getWeekRange(selectedDay)

    const { selectedDayEvents, weekEvents } = useMemo(() => {
        // 선택한 날짜 일정 필터
        const selectedDayEvents = dummyEvents.filter(event =>
            dayjs(event.date).startOf('day').isSame(selectedDay, 'day')
        )

        // 선택한 날짜에 해당하는 주 일정 필터 (선택한 날짜 제외)
        const weekEvents = dummyEvents.filter(event => {
            const d = dayjs(event.date).startOf('day')
            const start = monday.startOf('day')
            const end = sunday.startOf('day')

            const isInRange =
                (d.isAfter(start) || d.isSame(start, 'day')) &&
                (d.isBefore(end) || d.isSame(end, 'day'))

            const isNotSelectedDay = !d.isSame(selectedDay, 'day')

            return isInRange && isNotSelectedDay
        })

        return { selectedDayEvents, weekEvents }
    }, [selectedDate])

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
                        <View style={{ padding: 12, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
                            <Text style={{ color: '#555' }}>날짜: {dayjs(item.date).format('YYYY-MM-DD')}</Text>
                            {item.location && <Text style={{ color: '#555' }}>장소: {item.location}</Text>}
                        </View>
                    )
                }}
            />
        </View>
    )
}

export default EventScreen