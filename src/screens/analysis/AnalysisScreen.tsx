import { View, Text, SafeAreaView } from 'react-native'
import { Header } from '../../components'

const AnalysisScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: '#FFFBF0' }}>
            <Header 
                title="분석"
                showBackButton={false}
            />
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>분석 화면</Text>
            </SafeAreaView>
        </View>
    )
}

export default AnalysisScreen