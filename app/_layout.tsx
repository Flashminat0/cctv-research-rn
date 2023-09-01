import { Slot } from "expo-router";

import "../global.css";
import {View} from "react-native";
import {StatusBar} from "expo-status-bar";

export default function () {
    return <View className={`pt-10 bg-blue-200`}>
        <StatusBar style="auto" />
        <Slot />
    </View>;
}