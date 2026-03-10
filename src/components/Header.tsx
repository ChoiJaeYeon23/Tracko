import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const HEADER_BAR_HEIGHT = 48

interface HeaderProps {
    title: string
    showBackButton?: boolean
    onBackPress?: () => void
}

const Header: React.FC<HeaderProps> = ({ 
    title, 
    showBackButton = true, 
    onBackPress 
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
        <View style={styles.wrapper}>
            <View style={[styles.container, { height: HEADER_BAR_HEIGHT }]}>
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
                
                <View style={styles.rightSection}>
                    {/* 오른쪽에 추가 버튼이 필요한 경우 여기에 추가 */}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#FFF8E1',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: '#FFF8E1',
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
        alignItems: 'flex-end',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    backButtonText: {
        fontSize: 24,
        fontWeight: '400',
        color: '#374151',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2E2E2E',
        textAlign: 'center',
    },
})

export default Header
