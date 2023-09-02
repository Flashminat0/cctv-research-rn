import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (value: { email: string }) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('data', jsonValue);
    } catch (e) {
        // saving error
    }
};
export const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('data');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        // error reading value
        return null;
    }
};

export const removeData = async () => {
    try {
        await AsyncStorage.removeItem('data')
    } catch (e) {
        // remove error
    }

    console.log('Done.')
}