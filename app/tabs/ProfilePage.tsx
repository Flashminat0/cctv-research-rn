import React from 'react';

import {Text, View} from 'react-native';
import {Button} from "react-native-paper";
import {clearAll} from "../asyncStorage";
import {router} from "expo-router";
import {useAppDispatch} from "../../features/redux";
import {clearLaptop} from "../../features/laptopSlice";

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const logout = async () => {
        await clearAll();

        router.replace('/');
        dispatch(clearLaptop())
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
