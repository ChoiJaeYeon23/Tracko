import { View, StyleSheet, Switch } from 'react-native'
import Typography from './Typography'
import { BORDER, INK, INK_MUTED, WHITE } from '../constants/appColors'

type Props = {
    label: string
    description?: string
    value: boolean
    onValueChange: (next: boolean) => void
    disabled?: boolean
}

const SettingsSwitchRow = ({
    label,
    description,
    value,
    onValueChange,
    disabled,
}: Props) => {
    return (
        <View style={[styles.wrap, disabled && styles.wrapDisabled]}>
            <View style={styles.textCol}>
                <Typography variant="bodyLgSemi" style={styles.label}>
                    {label}
                </Typography>
                {description ? (
                    <Typography variant="caption" style={styles.desc}>
                        {description}
                    </Typography>
                ) : null}
            </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
                trackColor={{ false: BORDER, true: INK_MUTED }}
                thumbColor={WHITE}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    wrapDisabled: {
        opacity: 0.55,
    },
    textCol: {
        flex: 1,
    },
    label: {
        color: INK,
    },
    desc: {
        color: INK_MUTED,
        marginTop: 4,
        lineHeight: 18,
    },
})

export default SettingsSwitchRow
