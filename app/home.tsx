import React, {useEffect, useState} from 'react';

import {Pressable, Text, View} from 'react-native';
import {Link} from "expo-router";
import {ActivityIndicator, BottomNavigation, MD2Colors} from 'react-native-paper';
import Scanner from "./Scanner";

const MusicRoute = () => <View>
    <Text className={`text-5xl`}>
        aasdadasds
    </Text>
    <View className={`bg-green-700`}>
        <Link href="/">home</Link>
        <Text className={``}>
            Click
        </Text>
    </View>
</View>;

const AlbumsRoute = () => <Text>Albums</Text>;

const RecentsRoute = () => <Text>Recents</Text>;

const NotificationsRoute = () => <Text>Notifications</Text>;
const TrackerRoute = () => <Text>Notifications</Text>;

const MyComponent = () => {
    const [haveNotifications, setHaveNotifications] = useState(false);
    const [trackerActive, setTrackerActive] = useState(false);


    const [index, setIndex] = useState(0);
    const [routes, setRoutes] = useState([
        {key: 'account', title: 'Account', focusedIcon: 'account-settings', unfocusedIcon: 'account'},
        {key: 'scan', title: 'Scan', focusedIcon: 'camera', unfocusedIcon: 'cctv'},
        {key: 'recents', title: 'Recents', focusedIcon: 'history'},
        {
            key: 'notifications',
            title: 'Notifications',
            focusedIcon: 'bell',
            unfocusedIcon: haveNotifications ? 'bell-badge-outline' : 'bell-outline'
        },
    ]);

    useEffect(() => {
        let routesWithoutTracker = [
            {key: 'account', title: 'Account', focusedIcon: 'account-settings', unfocusedIcon: 'account'},
            {key: 'scan', title: 'Scan', focusedIcon: 'camera', unfocusedIcon: 'camera'},
            {key: 'recents', title: 'Recents', focusedIcon: 'history'},
            {
                key: 'notifications',
                title: 'Notifications',
                focusedIcon: 'bell',
                unfocusedIcon: haveNotifications ? 'bell-badge-outline' : 'bell-outline'
            },
        ]

        let routesWithTracker = [
            {key: 'account', title: 'Account', focusedIcon: 'account-settings', unfocusedIcon: 'account'},
            {key: 'tracker', title: 'Tracker', focusedIcon: 'cctv', unfocusedIcon: 'cctv'},
            {
                key: 'notifications',
                title: 'Notifications',
                focusedIcon: 'bell',
                unfocusedIcon: haveNotifications ? 'bell-badge-outline' : 'bell-outline'
            },
        ]

        if (trackerActive) {
            setRoutes(routesWithTracker)
        } else {
            setRoutes(routesWithoutTracker)
        }

    }, [trackerActive]);

    const renderScene = BottomNavigation.SceneMap({
        account: MusicRoute,
        scan: Scanner,
        recents: RecentsRoute,
        notifications: NotificationsRoute,
        tracker: TrackerRoute
    });

    return (
        <View className={'h-[104vh]'}>
            <BottomNavigation
                navigationState={{index, routes}}
                onIndexChange={setIndex}
                renderScene={renderScene}
                shifting={true}
            />
        </View>
    );
};

export default MyComponent;
