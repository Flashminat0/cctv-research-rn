import React from 'react';

import {Pressable, Text, View} from 'react-native';
import {Link} from "expo-router";
import BottomBar from "../components/common/BottomBar";

const MyComponent = () => {
    return (
        <View>
            <Text className={`text-5xl`}>
                aasdadasds
            </Text>
            <View className={`bg-green-700`}>
                <Link href="/">home</Link>
                <Text className={``}>
                    Click
                </Text>
            </View>
        </View>
    );
};

export default MyComponent;
