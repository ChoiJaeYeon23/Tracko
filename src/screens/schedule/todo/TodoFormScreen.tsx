import { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import uuid from 'react-native-uuid'
import { Todo } from '../../../types'
import {
    addTodo,
    updateTodo
} from '../../../database'
import { Header } from '../../../components'

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
        <View style={styles.container}>
            <Header 
                title={`투두 ${mode === 'edit' ? '수정' : '추가'}`}
                showBackButton={true}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>

                <View style={styles.section}>
                    <Text style={styles.label}>투두 제목</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="제목 입력"
                        style={styles.input}
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>설명</Text>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="설명을 입력하세요"
                        multiline
                        style={[styles.input, styles.textArea]}
                        placeholderTextColor="#999"
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>마감일</Text>
                    <TextInput
                        value={date}
                        onChangeText={setDate}
                        placeholder="YYYY-MM-DD"
                        keyboardType="number-pad"
                        style={styles.input}
                        placeholderTextColor="#999"
                    />
                </View>

            <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
            >
                <Text style={styles.submitButtonText}>저장하기</Text>
            </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    // 메인 컨테이너
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F57C00',
        marginBottom: 10,
    },
    input: {
        borderWidth: 2,
        borderColor: '#FFE082',
        borderRadius: 12,
        padding: 15,
        backgroundColor: '#fff',
        fontSize: 16,
        shadowColor: '#FFC107',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    textArea: {
        height: 100,
    },
    submitButton: {
        backgroundColor: '#FFC107',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#FF8F00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
})

export default TodoFormScreen