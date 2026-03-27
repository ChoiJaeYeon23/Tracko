import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { CREAM, WHITE, INK, BORDER } from '../constants/appColors'

interface HeaderProps {
    title: string
    showBackButton?: boolean
    onBackPress?: () => void
}

const Header: React.FC<HeaderProps> = ({
    title,
    showBackButton = true,
    onBackPress,
}) => {
    const navigation = useNavigation()

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress()
        } else {
            navigation.goBack()
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.leftSection}>
                    {showBackButton && (
                        <TouchableOpacity
                            onPress={handleBackPress}
                            style={styles.backButton}
                        >
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.centerSection}>
                    <Text style={styles.title}>{title}</Text>
                </View>

                <View style={styles.rightSection} />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: CREAM,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: CREAM,
        borderBottomWidth: 1,
        borderBottomColor: BORDER,
        shadowColor: INK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    leftSection: {
        width: 40,
        alignItems: 'flex-start',
    },
    centerSection: {
        flex: 1,
        alignItems: 'center',
    },
    rightSection: {
        width: 40,
    },
    backButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: WHITE,
        borderWidth: 1,
        borderColor: BORDER,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: INK,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: INK,
        textAlign: 'center',
    },
})

export default Header
