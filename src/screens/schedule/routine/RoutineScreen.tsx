import { useCallback, useEffect, useState } from 'react'
import {
    View,
    FlatList,
    TouchableOpacity,
    Alert,
} from 'react-native'
import { Typography } from '../../../components'
import { useFocusEffect } from '@react-navigation/native'
import dayjs from 'dayjs'
import {
    getAllRoutines,
    getRoutineCompletionMap,
    updateRoutineCompletionMap,
    deleteRoutine
} from '../../../database'
import { Routine } from '../../../types'
import { WHITE, INK, INK_MUTED } from '../../../constants/appColors'

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
                <Typography variant="bodyLg" style={{ marginRight: 10, flex: 1 }}>
                    {item.title} {item.time && item.time}
                </Typography>
                <Typography variant="captionSemi" style={{ marginRight: 10, color: INK_MUTED }}>
                    {item.daysOfWeek.map((d) => ['일', '월', '화', '수', '목', '금', '토'][d]).join(', ')}
                </Typography>
                <TouchableOpacity
                    onPress={() => toggleComplete(item.id)}
                >
                    <Typography variant="title">{isRoutineCompleted(item.id) ? '☑' : '☐'}</Typography>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => handleDeleteRoutine(item)}
                style={{
                    backgroundColor: INK,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    marginLeft: 10
                }}
            >
                <Typography variant="captionSemi" style={{ color: WHITE }}>
                    삭제
                </Typography>
            </TouchableOpacity>
        </View>
    )

    return (
        <View style={{ backgroundColor: WHITE, flex: 1 }}>
            <FlatList
                data={selectedRoutines}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListEmptyComponent={
                    <Typography variant="bodyLg" style={{ marginTop: 20, textAlign: 'center' }}>
                        오늘은 루틴이 없습니다.
                    </Typography>
                }
            />
        </View>
    )
}

export default RoutineScreen