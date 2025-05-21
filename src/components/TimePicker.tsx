import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import WheelPicker from '@quidone/react-native-wheel-picker'

type TimePickerProps = {
  onTimeChange?: (time: { hour: number; minute: number; ampm: 'AM' | 'PM' }) => void
}

const TimePicker = ({ onTimeChange }: TimePickerProps) => {
  const hours = [...Array(12)].map((_, i) => i + 1) // 1~12
  const minutes = [0, 10, 20, 30, 40, 50]
  const ampmOptions = ['AM', 'PM'] as const

  const [hour, setHour] = useState(12)
  const [minute, setMinute] = useState(0)
  const [ampm, setAmPm] = useState<typeof ampmOptions[number]>('AM')

  const onHourChanged = ({ item: { value } }: { item: { value: number } }) => {
    setHour(value)
    onTimeChange?.({ hour: value, minute, ampm })
  }

  const onMinuteChanged = ({ item: { value } }: { item: { value: number } }) => {
    setMinute(value)
    onTimeChange?.({ hour, minute: value, ampm })
  }

  const onAmPmChanged = ({ item: { value } }: { item: { value: typeof ampmOptions[number] } }) => {
    setAmPm(value)
    onTimeChange?.({ hour, minute, ampm: value })
  }

  return (
    <View style={styles.container}>
      {/* 시간 */}
      <WheelPicker
        style={styles.picker}
        data={hours.map((h) => ({ label: h.toString(), value: h }))}
        value={hour}
        onValueChanged={onHourChanged}
      />
      <Text style={styles.separator}>시</Text>

      {/* 분 */}
      <WheelPicker
        style={styles.picker}
        data={minutes.map((m) => ({ label: m.toString().padStart(2, '0'), value: m }))}
        value={minute}
        onValueChanged={onMinuteChanged}
      />
      <Text style={styles.separator}>분</Text>

      {/* AM/PM */}
      <WheelPicker
        style={styles.picker}
        data={ampmOptions.map((v) => ({ label: v, value: v }))}
        value={ampm}
        onValueChanged={onAmPmChanged}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    width: 60,
    height: 150,
  },
  separator: {
    fontSize: 18,
    paddingHorizontal: 6,
    color: '#333',
  },
})

export default TimePicker
