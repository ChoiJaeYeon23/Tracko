import { useState, useCallback } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Todo } from '../../../types'
import {
    getAllTodos,
    updateTodo
} from '../../../database'

const TodoScreen = (
    { selectedDate }: { selectedDate: string }
) => {
    const [todos, setTodos] = useState<Todo[]>([])

    const fetchTodos = () => {
        const todosStorage = getAllTodos()
        setTodos(todosStorage)
    }

    useFocusEffect(
        useCallback(() => {
            fetchTodos()
        }, [])
    )

    const toggleComplete = (id: string) => {
        const updated = todos.map(todo => {
            if (todo.id === id) {
                const toggledTodo = { ...todo, isCompleted: !todo.isCompleted }
                updateTodo(toggledTodo)
                return toggledTodo
            }
            return todo
        })
        setTodos(updated)
    }

    const filteredTodos = todos.filter(todo => todo.date === selectedDate)

    const renderItem = ({ item }: { item: Todo }) => (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderBottomWidth: 1,
                borderColor: '#ddd',
            }}
        >
            <TouchableOpacity
                onPress={() => toggleComplete(item.id)}
                style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: '#555',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                }}
            >
                {item.isCompleted && (
                    <Text style={{ fontSize: 16 }}>✓</Text>
                )}
            </TouchableOpacity>

            <View>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.title}</Text>
            </View>
        </View>
    )

    return (
        <View>
            <FlatList
                data={filteredTodos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}

export default TodoScreen