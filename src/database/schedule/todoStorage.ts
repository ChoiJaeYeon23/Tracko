import { MMKV } from 'react-native-mmkv'
import { Todo } from '../../types'

export const todoStorage = new MMKV({ id: 'todoStorage' })
const TODO_KEY = 'schedule:todos'

// 전체 투두 목록 불러오기 (복수)
export const getAllTodos = (): Todo[] => {
    try {
        const stored = todoStorage.getString(TODO_KEY)
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
        todoStorage.set(TODO_KEY, JSON.stringify(updatedList))
    } catch (error) {
        console.error('[TodoStorage] 투두 추가 중 오류 발생:', error)
    }
}

// 투두 삭제 (단일)
export const deleteTodo = (id: string): void => {
    try {
        const currentList = getAllTodos()
        const updatedList = currentList.filter(todo => todo.id !== id)
        todoStorage.set(TODO_KEY, JSON.stringify(updatedList))
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
        todoStorage.set(TODO_KEY, JSON.stringify(updatedList))
    } catch (error) {
        console.error('[TodoStorage] 투두 수정 중 오류 발생:', error)
    }
}