import { useState } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import { Routine } from '../../../types'
import dayjs from 'dayjs'

// 테스트용 더미 데이터. 추후 실제 데이터가 추가되면 삭제 예정
const dummyRoutines: Routine[] = [
    // 일요일
    {
        id: 'sun1',
        title: '요가 클래스',
        daysOfWeek: [0],
        time: '08:00',
        isCompleted: false
    },
    {
        id: 'sun2',
        title: '가족 전화',
        daysOfWeek: [0],
        time: '21:00',
        isCompleted: false
    },
    // 월요일
    {
        id: 'mon1',
        title: '아침 러닝',
        daysOfWeek: [1],
        time: '07:30',
        isCompleted: false
    },
    {
        id: 'mon2',
        title: '업무 계획 세우기',
        daysOfWeek: [1],
        time: '09:00',
        isCompleted: false
    },
    {
        id: 'mon3',
        title: '독서 30분',
        daysOfWeek: [1],
        time: '22:00',
        isCompleted: false
    },
    // 화요일
    {
        id: 'tue1',
        title: 'PT 수업',
        daysOfWeek: [2],
        time: '18:00',
        isCompleted: false
    },
    {
        id: 'tue2',
        title: '명상',
        daysOfWeek: [2],
        time: '22:30',
        isCompleted: false
    },
    // 수요일
    {
        id: 'wed1',
        title: '영어 회화',
        daysOfWeek: [3],
        time: '20:00',
        isCompleted: false
    },
    {
        id: 'wed2',
        title: '주간 회의 준비',
        daysOfWeek: [3],
        time: '10:00',
        isCompleted: false
    },
    // 목요일
    {
        id: 'thu1',
        title: '블로그 글쓰기',
        daysOfWeek: [4],
        time: '23:00',
        isCompleted: false
    },
    {
        id: 'thu2',
        title: '설거지 몰아서 하기',
        daysOfWeek: [4],
        time: '20:00',
        isCompleted: false
    },
    // 금요일
    {
        id: 'fri1',
        title: '청소하기',
        daysOfWeek: [5],
        time: '19:00',
        isCompleted: false
    },
    {
        id: 'fri2',
        title: '한 주 회고',
        daysOfWeek: [5],
        time: '22:00',
        isCompleted: false
    },
    {
        id: 'fri3',
        title: '맥주 한 잔',
        daysOfWeek: [5],
        time: '23:30',
        isCompleted: false
    },
    // 토요일
    {
        id: 'sat1',
        title: '마트 장보기',
        daysOfWeek: [6],
        time: '15:00',
        isCompleted: false
    },
    {
        id: 'sat2',
        title: '친구 만나기',
        daysOfWeek: [6],
        time: '18:00',
        isCompleted: false
    }
]

const RoutineScreen = () => {
    const [routines, setRoutines] = useState<Routine[]>(dummyRoutines)
    const today = dayjs().day()
    const todaysRoutines = routines.filter(routine =>
        routine.daysOfWeek.includes(today)
    )
    const toggleComplete = (id: string) => {
        setRoutines((prev) =>
            prev.map((routine) =>
                routine.id === id
                    ? { ...routine, isCompleted: !routine.isCompleted }
                    : routine
            )
        )
    }

    const renderItem = ({ item }: { item: Routine }) => (
        <View style={{ marginLeft: 10, flexDirection: 'row', marginTop: 10, alignItems: 'center', height: 30 }}>
            <Text style={{marginRight: 10}}>
                {item.title} ({item.time || '시간 없음'})
            </Text>
            <Text style={{marginRight: 10}}>
                {item.daysOfWeek.map((d) => ['일', '월', '화', '수', '목', '금', '토'][d]).join(', ')}
            </Text>
            <TouchableOpacity
                onPress={() => toggleComplete(item.id)}
            >
                <Text style={{ fontSize: 18 }}>
                    {item.isCompleted ? '☑' : '☐'}
                </Text>
            </TouchableOpacity>
        </View>
    )

    return (
        <View>
            <FlatList
                data={todaysRoutines}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <Text style={{ marginTop: 20, textAlign: 'center' }}>
                        오늘은 루틴이 없습니다.
                    </Text>
                }
            />
        </View>
    )
}

export default RoutineScreen