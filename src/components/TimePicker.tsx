import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import WheelPicker from '@quidone/react-native-wheel-picker'

type TimePickerProps = {
  value?: string
  onTimeChange?: (time: string) => void
}

const HOURS = [...Array(24)].map((_, i) => ({ label: i.toString().padStart(2, '0'), value: i }))
const MINUTES = [...Array(12)].map((_, i) => i * 5).map((m) => ({ label: m.toString().padStart(2, '0'), value: m }))

const parseTime = (timeStr: string): { hour: number; minute: number } => {
  const [h, m] = timeStr.split(':').map(Number)
  return { hour: h ?? 9, minute: m ?? 0 }
}

const formatTime = (hour: number, minute: number) =>
  `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`

const TimePicker = ({ value, onTimeChange }: TimePickerProps) => {
  const parsed = value ? parseTime(value) : { hour: 9, minute: 0 }

  const [hour, setHour] = useState(parsed.hour)
  const [minute, setMinute] = useState(Math.min(55, Math.floor(parsed.minute / 5) * 5))

  useEffect(() => {
    if (value) {
      const { hour: h, minute: m } = parseTime(value)
      setHour(h)
      setMinute(Math.min(55, Math.floor(m / 5) * 5))
    }
  }, [value])

  const onHourChanged = ({ item: { value: v } }: { item: { value: number } }) => {
    setHour(v)
    onTimeChange?.(formatTime(v, minute))
  }

  const onMinuteChanged = ({ item: { value: v } }: { item: { value: number } }) => {
    setMinute(v)
    onTimeChange?.(formatTime(hour, v))
  }

  return (
    <View style={styles.container}>
      <WheelPicker
        style={styles.picker}
        data={HOURS}
        value={hour}
        onValueChanged={onHourChanged}
      />
      <Text style={styles.separator}>시</Text>

      <WheelPicker
        style={styles.picker}
        data={MINUTES}
        value={minute}
        onValueChanged={onMinuteChanged}
      />
      <Text style={styles.separator}>분</Text>
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
    width: 64,
    height: 160,
  },
  separator: {
    fontSize: 18,
    paddingHorizontal: 6,
    color: '#333',
  },
})

export default TimePicker
