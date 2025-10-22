import { useCallback, useEffect, useState } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import dayjs from 'dayjs'
import {
    getAllRoutines,
    getRoutineCompletionMap,
    updateRoutineCompletionMap,
    deleteRoutine
} from '../../../database'
import { Routine } from '../../../types'

const RoutineScreen = (
    { selectedDate }: { selectedDate: string }
) => {
    const [routines, setRoutines] = useState<Routine[]>([])
    const [completionMap, setCompletionMap] = useState<{ [date: string]: string[] }>({})

    const selectedDay = dayjs(selectedDate).day()
    const dateKey = dayjs(selectedDate).format('YYYY-MM-DD')

    const fetchRoutines = async () => {
        try {
            const routinesStorage = getAllRoutines()
            const completionStorage = await getRoutineCompletionMap()
            setRoutines(routinesStorage)
            setCompletionMap(completionStorage)

            console.log('[RoutineScreen][Success] 루틴 불러오기 성공')
            console.log('[RoutineScreen] selectedDate:', selectedDate)
            console.log('[RoutineScreen] selectedDay:', selectedDay)
            console.log('[RoutineScreen] routinesStorage:', routinesStorage)
        } catch (error) {
            console.error('[RoutineScreen][Failed] 루틴 불러오기 실패')
            Alert.alert('루틴을 불러오지 못했습니다')
        }
    }

    useFocusEffect(
        useCallback(() => {
            fetchRoutines()
        }, [selectedDate])
    )

    // selectedDate가 변경될 때마다 데이터 새로고침
    useEffect(() => {
        fetchRoutines()
    }, [selectedDate])

    const selectedRoutines = routines.filter(routine =>
        routine.daysOfWeek.includes(selectedDay)
    )

    console.log('[RoutineScreen] selectedRoutines:', selectedRoutines)
    console.log('[RoutineScreen] routines.length:', routines.length)
    console.log('[RoutineScreen] selectedRoutines.length:', selectedRoutines.length)

    const isRoutineCompleted = (id: string): boolean => {
        return completionMap[dateKey]?.includes(id) ?? false
    }

    const toggleComplete = async (id: string) => {
        const prevList = completionMap[dateKey] ?? []

        const updatedList = prevList.includes(id)
            ? prevList.filter(routineId => routineId !== id)
            : [...prevList, id]
        
        const updatedMap = {
            ...completionMap,
            [dateKey]: updatedList
        }

        try {
            await updateRoutineCompletionMap(updatedMap)
            setCompletionMap(updatedMap)
            console.log('[RoutineScreen][Success] 완료 상태 업데이트 성공')
        } catch (error) {
            console.error('[RoutineScreen][Failed] 완료 상태 업데이트 실패:', error)
            Alert.alert('루틴 완료 상태 저장에 실패했습니다.')
        }
    }

    const handleDeleteRoutine = (routine: Routine) => {
        Alert.alert(
            '루틴 삭제',
            `"${routine.title}" 루틴을 삭제하시겠습니까?`,
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: () => {
                        try {
                            deleteRoutine(routine.id)
                            // 완료 맵에서도 제거
                            const updatedMap = { ...completionMap }
                            Object.keys(updatedMap).forEach(date => {
                                updatedMap[date] = updatedMap[date].filter(id => id !== routine.id)
                            })
                            setCompletionMap(updatedMap)
                            // 루틴 목록 새로고침
                            fetchRoutines()
                            Alert.alert('삭제 완료', '루틴이 삭제되었습니다.')
                        } catch (error) {
                            console.error('[RoutineScreen] 루틴 삭제 실패:', error)
                            Alert.alert('삭제 실패', '루틴 삭제에 실패했습니다.')
                        }
                    }
                }
            ]
        )
    }

    const renderItem = ({ item }: { item: Routine }) => (
        <View style={{ 
            marginLeft: 10, 
            flexDirection: 'row', 
            marginTop: 10, 
            alignItems: 'center', 
            height: 40,
            paddingRight: 10,
            justifyContent: 'space-between'
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Text style={{ marginRight: 10, flex: 1 }}>
                    {item.title} {item.time && item.time}
                </Text>
                <Text style={{ marginRight: 10, fontSize: 12, color: '#666' }}>
                    {item.daysOfWeek.map((d) => ['일', '월', '화', '수', '목', '금', '토'][d]).join(', ')}
                </Text>
                <TouchableOpacity
                    onPress={() => toggleComplete(item.id)}
                >
                    <Text style={{ fontSize: 18 }}>
                        {isRoutineCompleted(item.id) ? '☑' : '☐'}
                    </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => handleDeleteRoutine(item)}
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

    return (
        <View>
            <FlatList
                data={selectedRoutines}
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