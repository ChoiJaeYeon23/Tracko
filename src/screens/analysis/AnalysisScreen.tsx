import { View, Text, SafeAreaView } from 'react-native'
import { Header } from '../../components'
import { CREAM, INK } from '../../constants/appColors'

const AnalysisScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            <Header 
                title="분석"
                showBackButton={false}
            />
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: INK }}>분석 화면</Text>
            </SafeAreaView>
        </View>
    )
}

export default AnalysisScreen