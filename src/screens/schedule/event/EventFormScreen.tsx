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
    Keyboard
} from 'react-native'
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native'
import uuid from 'react-native-uuid'
import dayjs from 'dayjs'
import { Event } from '../../../types'
import { addEvent, updateEvent } from '../../../database'
import { Header } from '../../../components'

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
                    <Text style={styles.label}>날짜</Text>
                    <TextInput
                        value={date}
                        onChangeText={setDate}
                        placeholder="YYYY-MM-DD"
                        keyboardType="number-pad"
                        style={styles.input}
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.timeRow}>
                    <View style={styles.timeSection}>
                        <Text style={styles.label}>시작 시간</Text>
                        <TextInput
                            value={startTime}
                            onChangeText={setStartTime}
                            placeholder="HH:mm"
                            keyboardType="number-pad"
                            style={styles.input}
                            placeholderTextColor="#999"
                        />
                    </View>
                    <View style={styles.timeSection}>
                        <Text style={styles.label}>종료 시간</Text>
                        <TextInput
                            value={endTime}
                            onChangeText={setEndTime}
                            placeholder="HH:mm"
                            keyboardType="number-pad"
                            style={styles.input}
                            placeholderTextColor="#999"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>장소</Text>
                    <TextInput
                        value={location}
                        onChangeText={setLocation}
                        placeholder="장소를 입력하세요"
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
                </ScrollView>
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
    },
    section: {
        marginHorizontal: 20,
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
        backgroundColor: '#FFC107',
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 30,
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

export default EventFormScreen