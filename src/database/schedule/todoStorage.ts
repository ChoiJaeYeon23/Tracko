import { MMKV } from 'react-native-mmkv'
import { Todo } from '../../types'

const storage = new MMKV()
const TODO_KEY = 'schedule:todos'

// 전체 투두 목록 불러오기 (복수)
export const getAllTodos = (): Todo[] => {
    try {
        const stored = storage.getString(TODO_KEY)
        return stored ? JSON.parse(stored) : []
    } catch (error) {
        console.error('[TodoStorage] 투두 목록 불러오기 중 오류 발생:', error)
        return []
    }
}

// 새 투두 생성 (단일)
export const addTodo = (newTodo: Todo): void => {
    try {
        const currentList = getAllTodos()
        const updatedList = [...currentList, newTodo]
        storage.set(TODO_KEY, JSON.stringify(updatedList))
    } catch (error) {
        console.error('[TodoStorage] 투두 추가 중 오류 발생:', error)
    }
}

// 투두 삭제 (단일)
export const deleteTodo = (id: string): void => {
    try {
        const currentList = getAllTodos()
        const updatedList = currentList.filter(todo => todo.id !== id)
        storage.set(TODO_KEY, JSON.stringify(updatedList))
    } catch (error) {
        console.error('[TodoStorage] 투두 삭제 중 오류 발생:', error)
    }
}

// 투두 수정 (단일)
export const updateTodo = (updatedTodo: Todo): void => {
    try {
        const currentList = getAllTodos()
        const updatedList = currentList.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo
        )
        storage.set(TODO_KEY, JSON.stringify(updatedList))
    } catch (error) {
        console.error('[TodoStorage] 투두 수정 중 오류 발생:', error)
    }
}