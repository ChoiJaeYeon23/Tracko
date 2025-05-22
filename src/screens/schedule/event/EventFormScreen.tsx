import { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native'
import { Event } from '../../../types'
import dayjs from 'dayjs'

const EventFormScreen = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('') // YYYY-MM-DD 형식 권장
    const [startTime, setStartTime] = useState('') // HH:mm 형식 권장
    const [endTime, setEndTime] = useState('') // HH:mm 형식 권장
    const [location, setLocation] = useState('')

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
            id: Date.now().toString(),
            title: title.trim(),
            description: description.trim() || undefined,
            date: date.trim(),
            startTime: startTime.trim() || undefined,
            endTime: endTime.trim() || undefined,
            location: location.trim() || undefined,
        }

        console.log('저장할 이벤트:', newEvent)
        // 실제 저장 로직 추가 예정
    }

    return (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
            <Text style={{ fontSize: 16, marginBottom: 8 }}>제목 *</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="일정 제목을 입력하세요"
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

            <Text style={{ fontSize: 16, marginBottom: 8 }}>날짜 (YYYY-MM-DD) *</Text>
            <TextInput
                value={date}
                onChangeText={setDate}
                placeholder="2025-05-22"
                keyboardType="number-pad"
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 4,
                    padding: 10,
                    marginBottom: 16,
                }}
            />

            <Text style={{ fontSize: 16, marginBottom: 8 }}>시작 시간 (HH:mm)</Text>
            <TextInput
                value={startTime}
                onChangeText={setStartTime}
                placeholder="14:00"
                keyboardType="number-pad"
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 4,
                    padding: 10,
                    marginBottom: 16,
                }}
            />

            <Text style={{ fontSize: 16, marginBottom: 8 }}>종료 시간 (HH:mm)</Text>
            <TextInput
                value={endTime}
                onChangeText={setEndTime}
                placeholder="15:00"
                keyboardType="number-pad"
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 4,
                    padding: 10,
                    marginBottom: 16,
                }}
            />

            <Text style={{ fontSize: 16, marginBottom: 8 }}>장소</Text>
            <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="장소를 입력하세요"
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 4,
                    padding: 10,
                    marginBottom: 24,
                }}
            />

            <TouchableOpacity
                onPress={handleSubmit}
                style={{
                    backgroundColor: '#007bff',
                    paddingVertical: 12,
                    borderRadius: 6,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: '#fff', fontSize: 16 }}>저장하기</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default EventFormScreen