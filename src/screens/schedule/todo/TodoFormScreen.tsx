import { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native'
import { Todo } from '../../../types'

// TODO: 저장 시 유효성 검사 로직 추가
// TODO: 마감일 Picker로 받을지 키보드 입력으로 받을지 고민
const TodoFormScreen = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')

    const handleSubmit = () => {
        const newTodo: Todo = {
            id: Date.now().toString(),
            title,
            description,
            deadline,
            isCompleted: false
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
                value={deadline}
                onChangeText={setDeadline}
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