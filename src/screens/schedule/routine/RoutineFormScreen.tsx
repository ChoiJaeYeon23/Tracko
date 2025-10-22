import { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Button,
    Alert,
    Modal,
    StyleSheet
} from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import DateTimePicker from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'
import uuid from 'react-native-uuid'
import { addRoutine, updateRoutine } from '../../../database'
import { Routine } from '../../../types'

const daysKor = ['일', '월', '화', '수', '목', '금', '토']

type RoutineFormScreenProps = {
    mode: 'create' | 'edit'
    routine?: Routine
}

const RoutineFormScreen = () => {
    const route = useRoute<RouteProp<Record<string, RoutineFormScreenProps>, string>>()
    const navigation = useNavigation()
    const { mode, routine } = route.params || { mode: 'create' }

    const [title, setTitle] = useState(routine?.title || '')
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>(routine?.daysOfWeek || [])
    const [time, setTime] = useState<string | undefined>(routine?.time)
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [tempTime, setTempTime] = useState<Date | null>(null)

    const toggleDay = (day: number) => {
        setDaysOfWeek(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day].sort()
        )
    }

    const handleTimeChange = (_event: any, selected?: Date) => {
        if (selected) {
            setTempTime(selected)
        }
    }

    const confirmTimeSelection = () => {
        if (tempTime) {
            setTime(dayjs(tempTime).format('HH:mm'))
        }
        setShowTimePicker(false)
        setTempTime(null)
    }

    const cancelTimeSelection = () => {
        setShowTimePicker(false)
        setTempTime(null)
    }

    const handleSubmit = () => {
        if (!title.trim()) {
            Alert.alert('제목을 입력해주세요.')
            return
        }
        else if (daysOfWeek.length === 0) {
            Alert.alert('요일을 선택해주세요.')
            return
        }

        const newRoutine: Routine = {
            id: routine?.id || uuid.v4(),
            title,
            daysOfWeek,
            time,
        }

        try {
            if (mode === 'edit') {
                console.log('수정할 루틴은:', newRoutine)
                updateRoutine(newRoutine)
            } else {
                console.log('추가할 루틴은:', newRoutine)
                addRoutine(newRoutine)
            }

            navigation.goBack()
        } catch (error) {
            console.error('[RoutineFormScreen] 루틴 저장 중 오류 발생:', error)
            Alert.alert('다시 시도해주세요', '루틴 저장에 실패했습니다.',
                [
                    {
                        text: '확인',
                        style: 'default'
                    }
                ]
            )
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>루틴 {mode === 'edit' ? '수정' : '추가'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>루틴 제목</Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="제목 입력"
                    style={styles.input}
                    placeholderTextColor="#999"
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>요일 선택</Text>
                <View style={styles.dayContainer}>
                    {daysKor.map((d, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => toggleDay(i)}
                            style={[
                                styles.dayButton,
                                daysOfWeek.includes(i) ? styles.dayButtonSelected : styles.dayButtonUnselected
                            ]}
                        >
                            <Text style={[
                                styles.dayButtonText,
                                daysOfWeek.includes(i) ? styles.dayButtonTextSelected : styles.dayButtonTextUnselected
                            ]}>
                                {d}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.label}>시간 선택 (선택)</Text>
                <TouchableOpacity
                    onPress={() => setShowTimePicker(true)}
                    style={styles.timeButton}
                >
                    <Text style={styles.timeButtonText}>
                        {time || '시간 선택하기'}
                    </Text>
                    <Text style={styles.timeButtonIcon}>⏰</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={showTimePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={cancelTimeSelection}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>시간 선택</Text>
                            <TouchableOpacity onPress={cancelTimeSelection} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.timePickerContainer}>
                            <DateTimePicker
                                value={tempTime || (time ? dayjs(time, 'HH:mm').toDate() : new Date())}
                                mode="time"
                                is24Hour={true}
                                display="spinner"
                                onChange={handleTimeChange}
                                style={styles.timePicker}
                            />
                        </View>
                        
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                onPress={cancelTimeSelection}
                                style={[styles.modalButton, styles.cancelButton]}
                            >
                                <Text style={styles.cancelButtonText}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={confirmTimeSelection}
                                style={[styles.modalButton, styles.confirmButton]}
                            >
                                <Text style={styles.confirmButtonText}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>
                    {mode === 'edit' ? '수정하기' : '등록하기'}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    // 메인 컨테이너
    container: {
        flex: 1,
        backgroundColor: '#FFFBF0',
        padding: 20,
    },
    header: {
        backgroundColor: '#FFE082',
        padding: 20,
        borderRadius: 15,
        marginBottom: 25,
        shadowColor: '#FFC107',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#E65100',
        textAlign: 'center',
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
    dayContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    dayButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 2,
        minWidth: 45,
        alignItems: 'center',
    },
    dayButtonSelected: {
        backgroundColor: '#FFC107',
        borderColor: '#FF8F00',
    },
    dayButtonUnselected: {
        backgroundColor: '#fff',
        borderColor: '#FFE082',
    },
    dayButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    dayButtonTextSelected: {
        color: '#fff',
    },
    dayButtonTextUnselected: {
        color: '#F57C00',
    },
    timeButton: {
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
    timeButtonText: {
        fontSize: 16,
        color: '#F57C00',
        fontWeight: '500',
    },
    timeButtonIcon: {
        fontSize: 18,
        color: '#FFC107',
    },
    submitButton: {
        backgroundColor: '#FFC107',
        paddingVertical: 16,
        borderRadius: 12,
        marginTop: 20,
        shadowColor: '#FF8F00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
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
        backgroundColor: '#FFFBF0',
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

export default RoutineFormScreen