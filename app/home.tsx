import React from 'react';

import {Text, View} from 'react-native';
import {Link} from "expo-router";

const MyComponent = () => {
    return (
        <Text className={`text-5xl`}>
            aasdadasds
            <Link href="/">home</Link>

        </Text>
    );
};

export default MyComponent;
