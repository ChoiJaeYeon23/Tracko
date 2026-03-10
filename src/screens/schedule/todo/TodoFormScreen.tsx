import { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Modal
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'
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
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [tempDate, setTempDate] = useState<Date | null>(null)

    // 날짜 유효성 검사
    const validateDateFormat = (dateString: string) => {
        return /^\d{4}-\d{2}-\d{2}$/.test(dateString)
    }

    // 날짜 선택기 초기값 설정
    const getInitialDate = () => {
        if (tempDate) return tempDate
        if (date) {
            const parsedDate = dayjs(date, 'YYYY-MM-DD').toDate()
            if (isNaN(parsedDate.getTime())) {
                return new Date()
            }
            return parsedDate
        }
        // 오늘 날짜를 기본값으로 설정
        return new Date()
    }

    const handleDateChange = (_event: any, selected?: Date) => {
        if (selected) {
            setTempDate(selected)
        }
    }

    const confirmDateSelection = () => {
        if (tempDate) {
            setDate(dayjs(tempDate).format('YYYY-MM-DD'))
        }
        setShowDatePicker(false)
        setTempDate(null)
    }

    const cancelDateSelection = () => {
        setShowDatePicker(false)
        setTempDate(null)
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
                    <TouchableOpacity
                        onPress={() => {
                            if (!tempDate) {
                                if (date) {
                                    const parsedDate = dayjs(date, 'YYYY-MM-DD').toDate()
                                    setTempDate(isNaN(parsedDate.getTime()) ? new Date() : parsedDate)
                                } else {
                                    setTempDate(new Date())
                                }
                            }
                            setShowDatePicker(true)
                        }}
                        style={styles.dateButton}
                    >
                        <Text style={styles.dateButtonText}>
                            {date || '날짜 선택하기'}
                        </Text>
                        <Text style={styles.dateButtonIcon}>📅</Text>
                    </TouchableOpacity>
                </View>

            <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={cancelDateSelection}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>날짜 선택</Text>
                            <TouchableOpacity onPress={cancelDateSelection} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.datePickerContainer}>
                            <DateTimePicker
                                value={getInitialDate()}
                                mode="date"
                                display="spinner"
                                onChange={handleDateChange}
                                style={styles.datePicker}
                                minimumDate={new Date(2020, 0, 1)}
                                maximumDate={new Date(2030, 11, 31)}
                                locale="ko-KR"
                                textColor="#000000"
                            />
                        </View>
                        
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={cancelDateSelection}
                                style={[styles.modalButton, styles.cancelButton]}
                            >
                                <Text style={styles.cancelButtonText}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={confirmDateSelection}
                                style={[styles.modalButton, styles.confirmButton]}
                            >
                                <Text style={styles.confirmButtonText}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

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
        backgroundColor: '#FFFFFF',
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
    dateButton: {
        borderWidth: 2,
        borderColor: '#FFE082',
        borderRadius: 12,
        padding: 15,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#FFC107',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#F57C00',
        fontWeight: '500',
    },
    dateButtonIcon: {
        fontSize: 18,
        color: '#FFC107',
    },
    // 모달 스타일
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 0,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#F57C00',
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#FFE082',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: '#F57C00',
        fontWeight: '600',
    },
    datePickerContainer: {
        padding: 20,
        alignItems: 'center',
    },
    datePicker: {
        width: 200,
        height: 200,
    },
    modalButtons: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    confirmButton: {
        backgroundColor: '#FFC107',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
})

export default TodoFormScreen