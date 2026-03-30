import {
    SafeAreaView,
    View,
    Button,
    Alert,
} from 'react-native'
import { Typography } from '../../components'
import {
    eventStorage, routineStorage, todoStorage,
    getAllEvents, getAllRoutines, getAllTodos, getRoutineCompletionMap
} from '../../database'
import { Header } from '../../components'
import { CREAM } from '../../constants/appColors'

// 저장소 초기화 및 출력용 임시 버튼이 추가돼있습니다. 
const HomeScreen = () => {

    const printAllStorageData = () => {
        const routines = getAllRoutines()
        const map = getRoutineCompletionMap()
        const todos = getAllTodos()
        const events = getAllEvents()
        const doneDays = Object.keys(map).length
        Alert.alert(
            '저장소 요약',
            `루틴 ${routines.length} · 투두 ${todos.length} · 일정 ${events.length} · 완료기록일 ${doneDays}`,
        )
    }

    const deleteAllStorage = () => {
        routineStorage.clearAll()
        todoStorage.clearAll()
        eventStorage.clearAll()
    }

    const deleteRoutineStorage = () => {
        routineStorage.clearAll()
    }

    const deleteTodoStorage = () => {
        todoStorage.clearAll()
    }

    const deleteEventStorage = () => {
        eventStorage.clearAll()
    }

    return (
        <View style={{ flex: 1, backgroundColor: CREAM }}>
            <Header 
                title="홈"
                showBackButton={false}
            />
            <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Typography variant="bodyLg">HomeScreen Hi ~</Typography>
                </View>

                <View style={{ flex: 1, alignItems: 'center' }}>
                    <Typography variant="bodyLg">Schedule 관련 버튼입니다</Typography>
                    <Button
                        title='전체출력'
                        onPress={printAllStorageData}
                    />
                    <Button
                        title='전체삭제'
                        onPress={deleteAllStorage}
                    />
                    <Button
                        title='루틴삭제'
                        onPress={deleteRoutineStorage}
                    />
                    <Button
                        title='투두삭제'
                        onPress={deleteTodoStorage}
                    />
                    <Button
                        title='일정삭제'
                        onPress={deleteEventStorage}
                    />
                </View>
            </SafeAreaView>
        </View>
    )
}

export default HomeScreen