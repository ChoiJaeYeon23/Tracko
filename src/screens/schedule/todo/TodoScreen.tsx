import { useState, useCallback, useEffect } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert
} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import { Todo } from '../../../types'
import {
    getAllTodos,
    updateTodo,
    deleteTodo
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
        }, [selectedDate])
    )

    // selectedDate가 변경될 때마다 데이터 새로고침
    useEffect(() => {
        fetchTodos()
    }, [selectedDate])

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

    const handleDeleteTodo = (todo: Todo) => {
        Alert.alert(
            '투두 삭제',
            `"${todo.title}" 투두를 삭제하시겠습니까?`,
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '삭제',
                    style: 'destructive',
                    onPress: () => {
                        try {
                            deleteTodo(todo.id)
                            // 투두 목록 새로고침
                            fetchTodos()
                            Alert.alert('삭제 완료', '투두가 삭제되었습니다.')
                        } catch (error) {
                            console.error('[TodoScreen] 투두 삭제 실패:', error)
                            Alert.alert('삭제 실패', '투두 삭제에 실패했습니다.')
                        }
                    }
                }
            ]
        )
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
                justifyContent: 'space-between'
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
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

                <View style={{ flex: 1 }}>
                    <Text style={{ 
                        fontSize: 16, 
                        fontWeight: 'bold',
                        textDecorationLine: item.isCompleted ? 'line-through' : 'none',
                        color: item.isCompleted ? '#999' : '#000'
                    }}>
                        {item.title}
                    </Text>
                </View>
            </View>
            
            <TouchableOpacity
                onPress={() => handleDeleteTodo(item)}
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
                data={filteredTodos}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}

export default TodoScreen