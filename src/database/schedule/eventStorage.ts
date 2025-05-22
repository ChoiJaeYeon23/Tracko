import { MMKV } from 'react-native-mmkv'
import { Event } from '../../types'

const storage = new MMKV()
const EVENT_KEY = 'schedule:events'

// 전체 이벤트 목록 불러오기 (복수)
export const getAllEvents = (): Event[] => {
    try {
        const stored = storage.getString(EVENT_KEY)
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error('[EventStorage] 이벤트 목록 불러오기 중 오류 발생:', error)
        return []
    }
}

// 새 이벤트 생성 (단일)
export const addEvent = (newEvent: Event): void => {
    try {
        const currentList = getAllEvents()
        const updatedList = [...currentList, newEvent]
        storage.set(EVENT_KEY, JSON.stringify(updatedList))
    } catch (error) {
        console.error('[EventStorage] 이벤트 추가 중 오류 발생:', error)
    }
}

// 이벤트 삭제 (단일)
export const deleteEvent = (id: string): void => {
    try {
        const currentList = getAllEvents()
        const updatedList = currentList.filter(event => event.id !== id)
        storage.set(EVENT_KEY, JSON.stringify(updatedList))
    } catch (error) {
        console.error('[EventStorage] 이벤트 삭제 중 오류 발생:', error)
    }
}

// 이벤트 수정 (단일)
export const updateEvent = (updatedEvent: Event): void => {
    try {
        const currentList = getAllEvents()
        const updatedList = currentList.map(event =>
            event.id === updatedEvent.id ? updatedEvent : event
        )
        storage.set(EVENT_KEY, JSON.stringify(updatedList))
    } catch (error) {
        console.error('[EventStorage] 이벤트 수정 중 오류 발생:', error)
    }
}
