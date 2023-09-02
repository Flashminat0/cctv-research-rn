import React, {useEffect, useRef, useState} from 'react';

import {Platform, Pressable, Text, View} from 'react-native';
import {Link} from "expo-router";
import {ActivityIndicator, BottomNavigation, MD2Colors} from 'react-native-paper';
import ScannerPage from "./tabs/ScannerPage";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import firebase from "firebase/compat";
import User = firebase.User;
import {getData, storeData} from "./asyncStorage";
import ProfilePage from "./tabs/profile";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});


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

const Router = () => {
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    useEffect(() => {
        // @ts-ignore
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

        // @ts-ignore
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            // @ts-ignore
            setNotification(notification);
        });

        // @ts-ignore
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // @ts-ignore
            console.log(response);
        });

        return () => {
            // @ts-ignore
            Notifications.removeNotificationSubscription(notificationListener.current);
            // @ts-ignore
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);


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
        account: ProfilePage,
        scan: ScannerPage,
        recents: RecentsRoute,
        notifications: NotificationsRoute,
        tracker: TrackerRoute
    });

    useEffect(() => {
        if (expoPushToken) {
            storeData('expoPushToken', expoPushToken).then(() => {

            });
        }
    }, [expoPushToken]);

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

export default Router;


async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
        const {status: existingStatus} = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const {status} = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = await Notifications.getExpoPushTokenAsync({
            // @ts-ignore
            projectId: 'ede988a4-b1c6-4871-ada0-f2644d41604b',
        });
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}