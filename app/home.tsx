import React from 'react';

import {Pressable, Text, View} from 'react-native';
import {Link} from "expo-router";
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

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
                <ActivityIndicator animating={true} color={MD2Colors.red800} />
            </View>
        </View>
    );
};

export default MyComponent;
