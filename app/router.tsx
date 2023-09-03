import React, {useEffect, useRef, useState} from 'react';

import {Platform, Pressable, Text, View} from 'react-native';
import {Link} from "expo-router";
import {ActivityIndicator, BottomNavigation, MD2Colors} from 'react-native-paper';
import ProfilePage from "./tabs/ProfilePage";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {ref as databaseRef, set} from 'firebase/database';
import {getData, storeData} from "./asyncStorage";
import ScannerPage from "./tabs/ScannerPage";
import {useAppDispatch, useAppSelector} from "../features/redux";
import {setLaptop} from "../features/laptopSlice";
import TrackerPage from "./tabs/TrackerPage";
import {setTracker} from "../features/trackerSlice";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
});


const RecentsRoute = () => <Text>Recents</Text>;
const NotificationsRoute = () => <Text>Notifications</Text>;

const Router = () => {
    const dispatch = useAppDispatch();
    const laptop = useAppSelector(state => state.laptop);

    const checkForPresistance = async () => {
        const isLaptop = await getData('isLaptop');
        const imageBase64 = await getData('imageBase64');
        const boundUserEmail = await getData('boundUserEmail');
        const timestamp = await getData('timestamp');

        dispatch(setLaptop({
            isLaptop: !!isLaptop,
            imageBase64: imageBase64,
            boundUserEmail: boundUserEmail,
            timestamp: timestamp
        }))

        dispatch(setTracker({
            active: false,
            found: false,
            tracking: false,
            problem: false,
            problemMessage: ""
        }))

    }


    useEffect(() => {
        checkForPresistance()
    }, []);

    useEffect(() => {
        if (laptop.isLaptop) {
            setTrackerActive(true);
        } else {
            setTrackerActive(false);
        }
    }, [laptop]);

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    useEffect(() => {
        // @ts-ignore
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token.data));

        // @ts-ignore
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            // @ts-ignore
            setNotification(notification);
        });

        // @ts-ignore
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // @ts-ignore
            // console.log(response);
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


    const [index, setIndex] = useState(1);
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
        tracker: TrackerPage
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
        // console.log(token);
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