import { useState, useEffect } from 'react'
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Button,
    Alert
} from 'react-native'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import { Routine } from '../../../types'
import DateTimePicker from '@react-native-community/datetimepicker'
import dayjs from 'dayjs'

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

    const toggleDay = (day: number) => {
        setDaysOfWeek(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day].sort()
        )
    }

    const handleTimeChange = (_event: any, selected?: Date) => {
        setShowTimePicker(false)
        if (selected) {
            setTime(dayjs(selected).format('HH:mm'))
        }
    }

    const handleSubmit = () => {
        if (!title.trim() || daysOfWeek.length === 0) {
            Alert.alert('제목과 요일을 선택해주세요')
            return
        }

        const newRoutine: Routine = {
            id: routine?.id || Date.now().toString(),
            title,
            daysOfWeek,
            time,
            isCompleted: false,
        }

        if (mode === 'edit') {
            // 수정 시 처리 로직 (예: setRoutines(prev => 수정)
        } else {
            // 등록 시 처리 로직 (예: setRoutines(prev => [...prev, newRoutine])
        }

        navigation.goBack()
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 16, marginBottom: 6 }}>루틴 제목</Text>
            <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="제목 입력"
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 6,
                    padding: 10,
                    marginBottom: 20
                }}
            />

            <Text style={{ fontSize: 16, marginBottom: 6 }}>요일 선택</Text>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                {daysKor.map((d, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => toggleDay(i)}
                        style={{
                            padding: 8,
                            marginRight: 6,
                            borderWidth: 1,
                            borderRadius: 4,
                            backgroundColor: daysOfWeek.includes(i) ? '#007AFF' : '#fff',
                            borderColor: daysOfWeek.includes(i) ? '#007AFF' : '#ccc',
                        }}
                    >
                        <Text style={{ color: daysOfWeek.includes(i) ? '#fff' : '#000' }}>{d}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={{ fontSize: 16, marginBottom: 6 }}>시간 선택 (선택)</Text>
            <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 6,
                    padding: 10,
                    marginBottom: 20
                }}
            >
                <Text>{time || '시간 없음 (선택)'}</Text>
            </TouchableOpacity>

            {
                showTimePicker && (
                    <DateTimePicker
                        value={time ? dayjs(time, 'HH:mm').toDate() : new Date()}
                        mode="time"
                        is24Hour
                        onChange={handleTimeChange}
                    />
                )
            }

            <Button title={mode === 'edit' ? '수정하기' : '등록하기'} onPress={handleSubmit} />
        </View>
    )
}

export default RoutineFormScreen