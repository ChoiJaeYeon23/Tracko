import { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import uuid from 'react-native-uuid'
import { Todo } from '../../../types'
import {
    addTodo,
    updateTodo
} from '../../../database'

type TodoFormScreenParams = {
    mode: 'create' | 'edit'
    todo?: Todo
}

// TODO: 저장 시 유효성 검사 로직 추가(picker의 경우 없어도 됨, picker 안쓸거면 코드 분리하기)
// TODO: 마감일 Picker로 받을지 키보드 입력으로 받을지 고민
const TodoFormScreen = () => {
    const route = useRoute<RouteProp<Record<string, TodoFormScreenParams>, string>>()
    const navigation = useNavigation()
    const { mode, todo } = route.params || { mode: 'create' }

    const [title, setTitle] = useState(todo?.title || '')
    const [description, setDescription] = useState(todo?.description || '')
    const [date, setDate] = useState(todo?.date || '')

    // 날짜 유효성 검사
    const validateDateFormat = (dateString: string) => {
        return /^\d{4}-\d{2}-\d{2}$/.test(dateString)
    }

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('제목을 입력해주세요.')
            return
        }
        if (!validateDateFormat(date)) {
            Alert.alert('날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.')
            return
        }

        const newTodo: Todo = {
            id: todo?.id || uuid.v4(),
            title: title.trim(),
            description: description.trim(),
            date,
            isCompleted: todo?.isCompleted ?? false,
        }

        try {
            if (mode === 'edit') {
                await updateTodo(newTodo)
                Alert.alert('투두를 성공적으로 저장했습니다.')
                console.log('[TodoFormScreen][Success] 투두 저장 성공')
            } else {
                await addTodo(newTodo)
                Alert.alert('투두를 성공적으로 저장했습니다.')
                console.log('[TodoFormScreen][Success] 투두 저장 성공')
            }

            navigation.goBack()
        } catch (error) {
            console.error('[TodoFormScreen][Failed] 투두 저장 실패:', error)
            Alert.alert('저장 실패')
        }
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>제목</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="제목을 입력하세요"
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 4,
                    padding: 10,
                    marginBottom: 16,
                }}
            />

            <Text style={{ fontSize: 16, marginBottom: 8 }}>설명</Text>
            <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="설명을 입력하세요"
                multiline
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 4,
                    padding: 10,
                    marginBottom: 16,
                    height: 80,
                    textAlignVertical: 'top',
                }}
            />

            <Text style={{ fontSize: 16, marginBottom: 8 }}>마감일 (예: 2025-05-22)</Text>
            <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                keyboardType='number-pad'
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 4,
                    padding: 10,
                    marginBottom: 16,
                }}
            />

            <TouchableOpacity
                onPress={handleSubmit}
            >
                <Text>저장하기</Text>
            </TouchableOpacity>
        </View>
    )
}

export default TodoFormScreen