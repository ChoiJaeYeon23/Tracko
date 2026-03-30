import type { ReactNode } from 'react'
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native'
import Typography from './Typography'
import { BORDER, INK, WHITE } from '../constants/appColors'

type Props = {
    title: string
    children: ReactNode
    footer?: ReactNode
    style?: StyleProp<ViewStyle>
}

/** 가계부·요약 카드와 동일한 톤의 화이트 서피스 */
const DashboardCard = ({ title, children, footer, style }: Props) => {
    return (
        <View style={[styles.card, style]}>
            <Typography variant="bodyLgSemi" style={styles.title}>
                {title}
            </Typography>
            <View style={styles.body}>{children}</View>
            {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: WHITE,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: BORDER,
        padding: 16,
        marginBottom: 14,
    },
    title: {
        color: INK,
        marginBottom: 12,
    },
    body: {
        gap: 10,
    },
    footer: {
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: BORDER,
    },
})

export default DashboardCard
