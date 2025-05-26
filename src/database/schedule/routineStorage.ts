import { MMKV } from 'react-native-mmkv'
import { Routine } from '../../types'

export const routineStorage = new MMKV({ id: 'routineStorage' })
const ROUTINE_KEY = 'schedule:routines'
const ROUTINE_COMPLETION_MAP_KEY = 'schedule:routineCompletionMap'

// 전체 루틴 목록 불러오기 (복수)
export const getAllRoutines = (): Routine[] => {
    try {
        const stored = routineStorage.getString(ROUTINE_KEY)
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error('[RoutineStorage] 루틴 목록 불러오기 중 오류 발생:', error)
        throw error
        return []
    }
}

// 새 루틴 생성 (단일)
export const addRoutine = (newRoutine: Routine): void => {
    try {
        const currentList = getAllRoutines()
        const updatedList = [...currentList, newRoutine]
        routineStorage.set(ROUTINE_KEY, JSON.stringify(updatedList))
    } catch (error) {
        console.error('[RoutineStorage] 루틴 추가 중 오류 발생:', error)
        throw error
    }
}

// 루틴 수정 (단일)
export const updateRoutine = (updatedRoutine: Routine): void => {
    try {
        const currentList = getAllRoutines()
        const updatedList = currentList.map(routine =>
            routine.id === updatedRoutine.id ? updatedRoutine : routine
        )
        routineStorage.set(ROUTINE_KEY, JSON.stringify(updatedList))
    } catch (error) {
        console.error('[RoutineStorage] 루틴 수정 중 오류 발생:', error)
        throw error
    }
}

// 루틴 삭제 (단일)
export const deleteRoutine = (id: string): void => {
    try {
        const currentList = getAllRoutines()
        const updatedList = currentList.filter(routine => routine.id !== id)
        routineStorage.set(ROUTINE_KEY, JSON.stringify(updatedList))
    } catch (error) {
        console.error('[RoutineStorage] 루틴 삭제 중 오류 발생:', error)
    }
}

//
export const getRoutineCompletionMap = (): { [date: string]: string[] } => {
    const raw = routineStorage.getString(ROUTINE_COMPLETION_MAP_KEY)
    return raw ? JSON.parse(raw) : {}
}

//
export const updateRoutineCompletionMap = (map: { [date: string]: string[] }) => {
    routineStorage.set(ROUTINE_COMPLETION_MAP_KEY, JSON.stringify(map))
}