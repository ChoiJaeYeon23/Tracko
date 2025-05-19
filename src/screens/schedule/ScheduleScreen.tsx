import { useState } from 'react'
import {
    SafeAreaView,
    View,
    Dimensions
} from 'react-native'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view'
import { CalendarScreen, RoutineScreen, TaskListScreen } from '../../screens'
import { FAB } from 'react-native-paper'
import { StackScreenProps } from '@react-navigation/stack'
import { ScheduleStackParamList } from '../../navigation/ScheduleStackNavigator'

const initialLayout = { width: Dimensions.get('window').width }

type Props = StackScreenProps<ScheduleStackParamList, 'ScheduleScreen'>

const ScheduleScreen = ({ navigation }: Props) => {
    const [index, setIndex] = useState(0)
    const [routes] = useState([
        { key: 'routine', title: '루틴' },
        { key: 'taskList', title: '일정/투두' },
        { key: 'calendar', title: '달력' }
    ])

    const renderScene = SceneMap({
        routine: () => <RoutineScreen />,
        taskList: () => <TaskListScreen />,
        calendar: () => <CalendarScreen />
    })

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
            case 'taskList':
                navigation.navigate('TaskListFormScreen')
                break
            default:
                break
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={initialLayout}
                    renderTabBar={renderTabBar}
                />
                <FAB
                    style={{position: 'absolute', right: 16, bottom: 16}}
                    icon='plus'
                    onPress={handleFabPress}
                />
            </View>
        </SafeAreaView>
    )
}

export default ScheduleScreen