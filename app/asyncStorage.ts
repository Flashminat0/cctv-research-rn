import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key: string, value: string) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error("Error saving data:", e);
    }
};

export const getData = async (key: string) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        const parsedValue = jsonValue != null ? JSON.parse(jsonValue) : null;
        return typeof parsedValue === 'string' ? parsedValue : null;
    } catch (e) {
        console.error("Error reading data:", e);
        return null;
    }
};

export const removeData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
        console.log(`Removed data for key: ${key}`);
    } catch (e) {
        console.error("Error removing data:", e);
    }
};

export const clearAll = async () => {
    try {
        await AsyncStorage.clear();
        console.log("Cleared all data");
    } catch (e) {
        console.error("Error clearing data:", e);
    }
}
