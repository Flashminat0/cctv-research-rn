import {Text, View} from 'react-native';
import { Link } from 'expo-router';
import {StatusBar} from "expo-status-bar";

export default function Page() {
    return <View>
        <StatusBar style="auto" />
        <Link href="/home">About</Link>
    </View>;
}