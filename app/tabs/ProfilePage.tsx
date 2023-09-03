import React from 'react';

import {Text, View} from 'react-native';
import {Button} from "react-native-paper";
import {clearAll, getData} from "../asyncStorage";
import {router} from "expo-router";
import {useAppDispatch} from "../../features/redux";
import {clearLaptop} from "../../features/laptopSlice";
import {clearTracker} from "../../features/trackerSlice";
import {child, get, set} from "firebase/database";
import {ref as databaseRef} from "@firebase/database";
import {database} from "../../firebase";

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const logout = async () => {
        await clearAll();

        getData("email").then((email) => {

            const trackerRef = databaseRef(database)
            get(child(trackerRef, `trackers/`)).then((snapshot) => {
                const data: string[] = snapshot.val();

                if (data) {
                    const arrayWithoutUser = data.filter((value) => value !== `${email?.split('@')[0]}`)
                    set(databaseRef(database, `trackers/`), arrayWithoutUser)
                }
            })
        })

        dispatch(clearLaptop())
        dispatch(clearTracker())

        router.replace('/');

    }

    return (
        <View className={`pt-40 px-10`}>
            <Button icon="logout" mode="contained" onPress={logout}>
                Logout
            </Button>
        </View>
    );
};

export default ProfilePage;
