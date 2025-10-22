import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

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
                
                <View style={styles.rightSection}>
                    {/* 오른쪽에 추가 버튼이 필요한 경우 여기에 추가 */}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#FFE082',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFE082',
        shadowColor: '#FFC107',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
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
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF8F00',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    backButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F57C00',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#E65100',
        textAlign: 'center',
    },
})

export default Header
