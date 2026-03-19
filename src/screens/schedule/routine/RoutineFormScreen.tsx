import { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import uuid from 'react-native-uuid'
import { addRoutine, updateRoutine } from '../../../database'
import { Routine } from '../../../types'
import { Header, TimePicker } from '../../../components'

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
    const [tempTime, setTempTime] = useState<string | null>(null)

    const toggleDay = (day: number) => {
        setDaysOfWeek(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day].sort()
        )
    }

    const confirmTimeSelection = () => {
        if (tempTime) setTime(tempTime)
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
            <Header 
                title={`루틴 ${mode === 'edit' ? '수정' : '추가'}`}
                showBackButton={true}
            />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.content}>

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
                    onPress={() => {
                        setTempTime(time || '09:00')
                        setShowTimePicker(true)
                    }}
                    style={styles.timeButton}
                >
                    <Text style={styles.timeButtonText}>
                        {time || '시간 선택하기'}
                    </Text>
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
                            <TimePicker
                                value={tempTime || time || '09:00'}
                                onTimeChange={setTempTime}
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
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#1E293B',
    },
    dayContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    dayButton: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 10,
        minWidth: 44,
        alignItems: 'center',
    },
    dayButtonSelected: {
        backgroundColor: '#FF8F00',
    },
    dayButtonUnselected: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dayButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    dayButtonTextSelected: {
        color: '#fff',
    },
    dayButtonTextUnselected: {
        color: '#64748B',
    },
    timeButton: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: '#fff',
    },
    timeButtonText: {
        fontSize: 16,
        color: '#1E293B',
        fontWeight: '500',
    },
    submitButton: {
        backgroundColor: '#FF8F00',
        paddingVertical: 16,
        borderRadius: 10,
        marginTop: 32,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
        textAlign: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 34,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1E293B',
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 18,
        color: '#64748B',
        fontWeight: '500',
    },
    timePickerContainer: {
        padding: 20,
        alignItems: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        gap: 12,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F1F5F9',
    },
    confirmButton: {
        backgroundColor: '#FF8F00',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748B',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
})

export default RoutineFormScreen