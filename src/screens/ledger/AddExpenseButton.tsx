import React from 'react'
import { StyleSheet } from 'react-native'
import { FAB } from 'react-native-paper'
import { INK, WHITE } from '../../constants/appColors'

type Props = {
    onPress: () => void
}

const AddExpenseButton = ({ onPress }: Props) => (
    <FAB
        icon="plus"
        color={WHITE}
        style={styles.fab}
        onPress={onPress}
    />
)

export default AddExpenseButton

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 24,
        backgroundColor: INK,
    },
})