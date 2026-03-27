import { useEffect, useState } from 'react'
import {
    SafeAreaView,
    View,
    Dimensions
} from 'react-native'
import { StackScreenProps } from '@react-navigation/stack'
import { TabView, TabBar } from 'react-native-tab-view'
import { FAB } from 'react-native-paper'
import dayjs from 'dayjs'
import {
    CalendarScreen,
    RoutineScreen,
    TodoScreen,
    EventScreen
} from '../../screens'
import { ScheduleStackParamList } from '../../navigation/ScheduleStackNavigator'
import { Header } from '../../components'
import { CREAM, WHITE, INK, INK_MUTED, BORDER } from '../../constants/appColors'

const initialLayout = { width: Dimensions.get('window').width }

type Props = StackScreenProps<ScheduleStackParamList, 'ScheduleScreen'>

const ScheduleScreen = ({ navigation }: Props) => {
    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'routine', title: '루틴' },
        { key: 'todo', title: '투두' },
        { key: 'event', title: '일정' }
    ])
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'))

    const renderScene = ({ route }: { route: { key: string } }) => {
        switch (route.key) {
            case 'routine':
                return <RoutineScreen selectedDate={selectedDate} />
            case 'todo':
                return <TodoScreen selectedDate={selectedDate} />
            case 'event':
                return <EventScreen selectedDate={selectedDate} />
            default:
                return null
        }
    }

    

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: INK, height: 3 }}
            style={{
                backgroundColor: WHITE,
                borderTopWidth: 1,
                borderTopColor: BORDER,
            }}
            activeColor={INK}
            inactiveColor={INK_MUTED}
            labelStyle={{ fontWeight: '600' }}
        />
    )

    const handleFabPress = () => {
        switch (routes[index].key) {
            case 'routine':
                navigation.navigate('RoutineFormScreen')
                break
            case 'todo':
                navigation.navigate('TodoFormScreen')
                break
            case 'event':
                navigation.navigate('EventFormScreen')
                break
            default:
                break
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            <Header 
                title="일정"
                showBackButton={false}
            />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 0.7, backgroundColor: CREAM }}>
                    <CalendarScreen
                        selectedDate={selectedDate}
                        onDateChange={setSelectedDate}
                    />
                </View>
                <View style={{ flex: 0.4, backgroundColor: WHITE }}>
                    <TabView
                        key={selectedDate}
                        navigationState={{ index, routes }}
                        renderScene={renderScene}
                        onIndexChange={setIndex}
                        initialLayout={initialLayout}
                        renderTabBar={renderTabBar}
                    />
                    <FAB
                        style={{
                            position: 'absolute',
                            right: 16,
                            bottom: 16,
                            backgroundColor: INK,
                        }}
                        color={WHITE}
                        icon="plus"
                        onPress={handleFabPress}
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}

export default ScheduleScreen