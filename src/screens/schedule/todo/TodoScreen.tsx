import { useState } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity
} from 'react-native'
import { Todo } from '../../../types'

// 테스트용 더미 데이터
const dummyTodos: Todo[] = [
    {
        id: '1',
        title: '리액트 네이티브 공부하기',
        description: 'TypeScript로 컴포넌트 작성 연습',
        tags: ['공부', '개발'],
        date: '2025-05-22',
        isCompleted: false,
    },
    {
        id: '2',
        title: '운동 가기',
        tags: ['건강'],
        date: '2025-05-13',
        isCompleted: true,
    },
]

const TodoScreen = (
    { selectedDate }: { selectedDate: string }
) => {
    const [todos, setTodos] = useState<Todo[]>(dummyTodos)

    const toggleComplete = (id: string) => {
        const updated = todos.map(todo =>
            todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        )
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