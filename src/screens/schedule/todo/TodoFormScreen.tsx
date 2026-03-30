import { useState } from 'react'
import {
    View,
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
import { Header, Typography } from '../../../components'
import { typography } from '../../../theme/typography'
import {
    CREAM,
    WHITE,
    INK,
    INK_MUTED,
    BORDER,
    SCRIM,
} from '../../../constants/appColors'

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
            } else {
                await addTodo(newTodo)
                Alert.alert('투두를 성공적으로 저장했습니다.')
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
                    <Typography variant="bodyLgSemi" style={styles.label}>
                        투두 제목
                    </Typography>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="제목 입력"
                        style={styles.input}
                        placeholderTextColor={INK_MUTED}
                    />
                </View>

                <View style={styles.section}>
                    <Typography variant="bodyLgSemi" style={styles.label}>
                        설명
                    </Typography>
                    <TextInput
                        value={description}
                        onChangeText={setDescription}
                        placeholder="설명을 입력하세요"
                        multiline
                        style={[styles.input, styles.textArea]}
                        placeholderTextColor={INK_MUTED}
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.section}>
                    <Typography variant="bodyLgSemi" style={styles.label}>
                        마감일
                    </Typography>
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
                        <Typography variant="bodyLgMedium" style={styles.dateButtonText}>
                            {date || '날짜 선택하기'}
                        </Typography>
                        <Typography variant="title" style={styles.dateButtonIcon}>
                            📅
                        </Typography>
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
                            <Typography variant="titleSemi" style={styles.modalTitle}>
                                날짜 선택
                            </Typography>
                            <TouchableOpacity onPress={cancelDateSelection} style={styles.closeButton}>
                                <Typography variant="bodyLgSemi" style={styles.closeButtonText}>
                                    ✕
                                </Typography>
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
                                <Typography variant="bodyLgSemi" style={styles.cancelButtonText}>
                                    취소
                                </Typography>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={confirmDateSelection}
                                style={[styles.modalButton, styles.confirmButton]}
                            >
                                <Typography variant="bodyLgSemi" style={styles.confirmButtonText}>
                                    확인
                                </Typography>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButton}
            >
                <Typography variant="titleBold" style={styles.submitButtonText}>
                    저장하기
                </Typography>
            </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: CREAM,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    label: {
        color: INK,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 12,
        padding: 15,
        backgroundColor: WHITE,
        ...typography.input,
        color: INK,
        shadowColor: INK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    textArea: {
        height: 100,
    },
    submitButton: {
        backgroundColor: INK,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: INK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    submitButtonText: {
        color: WHITE,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 12,
        padding: 15,
        backgroundColor: WHITE,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: INK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    dateButtonText: {
        color: INK,
    },
    dateButtonIcon: {
        color: INK_MUTED,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: SCRIM,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: WHITE,
        borderRadius: 20,
        padding: 0,
        width: '90%',
        maxWidth: 400,
        shadowColor: INK,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
        backgroundColor: WHITE,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalTitle: {
        color: INK,
    },
    closeButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: CREAM,
        borderWidth: 1,
        borderColor: BORDER,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: INK,
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
        backgroundColor: CREAM,
        borderWidth: 1,
        borderColor: BORDER,
    },
    confirmButton: {
        backgroundColor: INK,
    },
    cancelButtonText: {
        color: INK_MUTED,
    },
    confirmButtonText: {
        color: WHITE,
    },
})

export default TodoFormScreen