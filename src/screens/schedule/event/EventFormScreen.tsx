import { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Modal
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import uuid from 'react-native-uuid'
import dayjs from 'dayjs'
import { Event } from '../../../types'
import { addEvent, updateEvent } from '../../../database'
import { Header } from '../../../components'
import {
    CREAM,
    WHITE,
    INK,
    INK_MUTED,
    BORDER,
    SCRIM,
} from '../../../constants/appColors'

type EventFormScreenParams = {
    mode: 'create' | 'edit'
    event?: Event
}

const EventFormScreen = () => {
    const route = useRoute<RouteProp<Record<string, EventFormScreenParams>, string>>()
    const navigation = useNavigation()
    const { mode, event } = route.params || { mode: 'create' }

    const [title, setTitle] = useState(event?.title || '')
    const [description, setDescription] = useState(event?.description || '')
    const [date, setDate] = useState(event?.date || '')
    const [startTime, setStartTime] = useState(event?.startTime || '')
    const [endTime, setEndTime] = useState(event?.endTime || '')
    const [location, setLocation] = useState(event?.location || '')
    
    // 날짜 선택기 상태
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [tempDate, setTempDate] = useState<Date | null>(null)
    
    // 시간 선택기 상태
    const [showStartTimePicker, setShowStartTimePicker] = useState(false)
    const [showEndTimePicker, setShowEndTimePicker] = useState(false)
    const [tempStartTime, setTempStartTime] = useState<Date | null>(null)
    const [tempEndTime, setTempEndTime] = useState<Date | null>(null)

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

    // 시작 시간 선택기 초기값 설정
    const getInitialStartTime = () => {
        if (tempStartTime) return tempStartTime
        if (startTime) return dayjs(startTime, 'HH:mm').toDate()
        return dayjs().hour(9).minute(0).second(0).millisecond(0).toDate()
    }

    // 종료 시간 선택기 초기값 설정
    const getInitialEndTime = () => {
        if (tempEndTime) return tempEndTime
        if (endTime) return dayjs(endTime, 'HH:mm').toDate()
        return dayjs().hour(10).minute(0).second(0).millisecond(0).toDate()
    }

    // 날짜 변경 핸들러
    const handleDateChange = (_event: any, selected?: Date) => {
        if (selected) {
            setTempDate(selected)
        }
    }

    // 시작 시간 변경 핸들러
    const handleStartTimeChange = (_event: any, selected?: Date) => {
        if (selected) {
            setTempStartTime(selected)
        }
    }

    // 종료 시간 변경 핸들러
    const handleEndTimeChange = (_event: any, selected?: Date) => {
        if (selected) {
            setTempEndTime(selected)
        }
    }

    // 날짜 선택 확인
    const confirmDateSelection = () => {
        if (tempDate) {
            setDate(dayjs(tempDate).format('YYYY-MM-DD'))
        }
        setShowDatePicker(false)
        setTempDate(null)
    }

    // 시작 시간 선택 확인
    const confirmStartTimeSelection = () => {
        if (tempStartTime) {
            setStartTime(dayjs(tempStartTime).format('HH:mm'))
        }
        setShowStartTimePicker(false)
        setTempStartTime(null)
    }

    // 종료 시간 선택 확인
    const confirmEndTimeSelection = () => {
        if (tempEndTime) {
            setEndTime(dayjs(tempEndTime).format('HH:mm'))
        }
        setShowEndTimePicker(false)
        setTempEndTime(null)
    }

    // 날짜 선택 취소
    const cancelDateSelection = () => {
        setShowDatePicker(false)
        setTempDate(null)
    }

    // 시작 시간 선택 취소
    const cancelStartTimeSelection = () => {
        setShowStartTimePicker(false)
        setTempStartTime(null)
    }

    // 종료 시간 선택 취소
    const cancelEndTimeSelection = () => {
        setShowEndTimePicker(false)
        setTempEndTime(null)
    }

    const handleSubmit = () => {
        if (!title.trim()) {
            Alert.alert('제목은 필수입니다.')
            return
        }
        if (!date.trim() || !dayjs(date, 'YYYY-MM-DD', true).isValid()) {
            Alert.alert('유효한 날짜를 입력해주세요 (YYYY-MM-DD)')
            return
        }
        if (startTime && !dayjs(startTime, 'HH:mm', true).isValid()) {
            Alert.alert('유효한 시작 시간을 입력해주세요 (HH:mm)')
            return
        }
        if (endTime && !dayjs(endTime, 'HH:mm', true).isValid()) {
            Alert.alert('유효한 종료 시간을 입력해주세요 (HH:mm)')
            return
        }

        const newEvent: Event = {
            id: event?.id || uuid.v4(),
            title: title.trim(),
            description: description.trim() || undefined,
            date: date.trim(),
            startTime: startTime.trim() || undefined,
            endTime: endTime.trim() || undefined,
            location: location.trim() || undefined,
        }

        try {
            if (mode === 'edit') {
                console.log('수정할 이벤트:', newEvent)
                updateEvent(newEvent)
            } else {
                console.log('추가할 이벤트:', newEvent)
                addEvent(newEvent)
            }

            navigation.goBack()
        } catch (error) {
            console.error('[EventFormScreen][Failed] 이벤트 저장 오류:', error)
            Alert.alert('저장 실패', '이벤트 저장 중 오류가 발생했습니다. 다시 시도해주세요.')
        }
    }

    return (
        <View style={styles.container}>
            <Header 
                title={`일정 ${mode === 'edit' ? '수정' : '추가'}`}
                showBackButton={true}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView style={styles.content}>

                <View style={styles.section}>
                    <Text style={styles.label}>일정 제목</Text>
                    <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder="제목 입력"
                        style={styles.input}
                        placeholderTextColor={INK_MUTED}
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
                        placeholderTextColor={INK_MUTED}
                        textAlignVertical="top"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>날짜</Text>
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

                <View style={styles.timeRow}>
                    <View style={styles.timeSection}>
                        <Text style={styles.label}>시작 시간</Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (!tempStartTime) {
                                    if (startTime) {
                                        setTempStartTime(dayjs(startTime, 'HH:mm').toDate())
                                    } else {
                                        setTempStartTime(dayjs().hour(9).minute(0).second(0).millisecond(0).toDate())
                                    }
                                }
                                setShowStartTimePicker(true)
                            }}
                            style={styles.timeButton}
                        >
                            <Text style={styles.timeButtonText}>
                                {startTime || '시간 선택하기'}
                            </Text>
                            <Text style={styles.timeButtonIcon}>⏰</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.timeSection}>
                        <Text style={styles.label}>종료 시간</Text>
                        <TouchableOpacity
                            onPress={() => {
                                if (!tempEndTime) {
                                    if (endTime) {
                                        setTempEndTime(dayjs(endTime, 'HH:mm').toDate())
                                    } else {
                                        setTempEndTime(dayjs().hour(10).minute(0).second(0).millisecond(0).toDate())
                                    }
                                }
                                setShowEndTimePicker(true)
                            }}
                            style={styles.timeButton}
                        >
                            <Text style={styles.timeButtonText}>
                                {endTime || '시간 선택하기'}
                            </Text>
                            <Text style={styles.timeButtonIcon}>⏰</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>장소</Text>
                    <TextInput
                        value={location}
                        onChangeText={setLocation}
                        placeholder="장소를 입력하세요"
                        style={styles.input}
                        placeholderTextColor={INK_MUTED}
                    />
                </View>

                {/* 날짜 선택기 모달 */}
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

                {/* 시작 시간 선택기 모달 */}
                <Modal
                    visible={showStartTimePicker}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={cancelStartTimeSelection}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>시작 시간 선택</Text>
                                <TouchableOpacity onPress={cancelStartTimeSelection} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.timePickerContainer}>
                                <DateTimePicker
                                    value={getInitialStartTime()}
                                    mode="time"
                                    is24Hour={true}
                                    display="spinner"
                                    onChange={handleStartTimeChange}
                                    style={styles.timePicker}
                                    locale="ko-KR"
                                    textColor="#000000"
                                />
                            </View>
                            
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    onPress={cancelStartTimeSelection}
                                    style={[styles.modalButton, styles.cancelButton]}
                                >
                                    <Text style={styles.cancelButtonText}>취소</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={confirmStartTimeSelection}
                                    style={[styles.modalButton, styles.confirmButton]}
                                >
                                    <Text style={styles.confirmButtonText}>확인</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* 종료 시간 선택기 모달 */}
                <Modal
                    visible={showEndTimePicker}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={cancelEndTimeSelection}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>종료 시간 선택</Text>
                                <TouchableOpacity onPress={cancelEndTimeSelection} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.timePickerContainer}>
                                <DateTimePicker
                                    value={getInitialEndTime()}
                                    mode="time"
                                    is24Hour={true}
                                    display="spinner"
                                    onChange={handleEndTimeChange}
                                    style={styles.timePicker}
                                    locale="ko-KR"
                                    textColor="#000000"
                                />
                            </View>
                            
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    onPress={cancelEndTimeSelection}
                                    style={[styles.modalButton, styles.cancelButton]}
                                >
                                    <Text style={styles.cancelButtonText}>취소</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={confirmEndTimeSelection}
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
                </ScrollView>
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
    },
    section: {
        marginHorizontal: 20,
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: INK,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: BORDER,
        borderRadius: 12,
        padding: 15,
        backgroundColor: WHITE,
        fontSize: 16,
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
    timeRow: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 25,
        gap: 15,
    },
    timeSection: {
        flex: 1,
    },
    submitButton: {
        backgroundColor: INK,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 30,
        shadowColor: INK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    submitButtonText: {
        fontSize: 18,
        fontWeight: '700',
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
        fontSize: 16,
        color: INK,
        fontWeight: '500',
    },
    dateButtonIcon: {
        fontSize: 18,
        color: INK_MUTED,
    },
    timeButton: {
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
    timeButtonText: {
        fontSize: 16,
        color: INK,
        fontWeight: '500',
    },
    timeButtonIcon: {
        fontSize: 18,
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
        fontSize: 18,
        fontWeight: '600',
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
        fontSize: 16,
        color: INK,
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
    timePickerContainer: {
        padding: 20,
        alignItems: 'center',
    },
    timePicker: {
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
        fontSize: 16,
        fontWeight: '600',
        color: INK_MUTED,
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: WHITE,
    },
})

export default EventFormScreen