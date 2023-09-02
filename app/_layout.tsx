import {Slot} from "expo-router";

import "../global.css";
import {StatusBar} from "expo-status-bar";
import {MD3DarkTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import store from "../features/store";
import {Provider} from "react-redux";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'white',
        secondary: 'black',
    },
};


export default function () {
    return (
        <Provider store={store}>
            <PaperProvider theme={theme}>
                <StatusBar style="dark"/>
                <Slot/>
            </PaperProvider>
        </Provider>
    );
}