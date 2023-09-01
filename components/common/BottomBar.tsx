import React from 'react';

import {Text, View, Pressable} from 'react-native';

const BottomBar = () => {
    return (
        <View className={`isolate inline-flex rounded-md shadow-sm`}>
            <Pressable
                className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
                <Text>Years</Text>
            </Pressable>
            <Pressable
                className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
                <Text>Months</Text>
            </Pressable>
            <Pressable
                className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10">
                <Text>
                    Days
                </Text>
            </Pressable>
        </View>
    );
};

export default BottomBar;
