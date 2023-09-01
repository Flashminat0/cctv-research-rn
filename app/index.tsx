import {Text, View} from 'react-native';
import { Link } from 'expo-router';
import {StatusBar} from "expo-status-bar";
import {ActivityIndicator, MD2Colors} from "react-native-paper";
import React from "react";

export default function Page() {
    return <View className={``}>
        <Link
            className={`p-4 text-6xl`}
            href="/router">About</Link>

        <ActivityIndicator animating={true} color={MD2Colors.red800} />

    </View>;
}