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
            indicatorStyle={{ backgroundColor: '#4b9eff' }}
            style={{ backgroundColor: '#fff' }}
            activeColor="#4B9EFF"
            inactiveColor="#999"
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
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 0.7 }}>
                <CalendarScreen
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                />
            </View>
            <View style={{ flex: 0.3 }}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={initialLayout}
                    renderTabBar={renderTabBar}
                />
                <FAB
                    style={{ position: 'absolute', right: 16, bottom: 16 }}
                    icon='plus'
                    onPress={handleFabPress}
                />
            </View>
        </SafeAreaView>
    )
}

export default ScheduleScreen