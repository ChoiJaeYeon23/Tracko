import { View, StyleSheet } from 'react-native'
import Typography from './Typography'
import { INK, INK_MUTED } from '../constants/appColors'

type Props = {
    label: string
    value: string
}

const DashboardStatRow = ({ label, value }: Props) => {
    return (
        <View style={styles.row}>
            <Typography variant="bodySm" style={styles.label}>
                {label}
            </Typography>
            <Typography variant="bodySemi" style={styles.value} numberOfLines={1}>
                {value}
            </Typography>
        </View>
    )
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12,
    },
    label: {
        flexShrink: 0,
        color: INK_MUTED,
    },
    value: {
        flex: 1,
        textAlign: 'right',
        color: INK,
    },
})

export default DashboardStatRow
