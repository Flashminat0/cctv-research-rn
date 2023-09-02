import React from 'react';
import {Camera, CameraType} from 'expo-camera';
import {useState} from 'react';
import {StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewProps, ViewStyle} from 'react-native';
import {Button, IconButton, MD2Colors, MD3Colors} from "react-native-paper";
import {Avatar, Card,} from 'react-native-paper';

const ScannerPage = () => {
    const [capturing, setCapturing] = useState(false);
    const [pictureTaken, setPictureTaken] = useState(false)
    const [pictureURI, setPictureURI] = useState("")

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    const [findingLaptop, setFindingLaptop] = useState(false)

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    if (!permission) {
        // Camera permissions are still loading
        return <View/>;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <View className={`px-10 flex space-y-6  justify-center`}>
                    <Button
                        buttonColor={MD2Colors.grey700}
                        textColor={MD2Colors.white}
                        icon={"camera"}
                        mode="contained"
                        onPress={requestPermission}>
                        Grant Permission
                    </Button>
                    <View className={`flex items-center`}>
                        <Text style={styles.text}>No access to camera</Text>
                        <Text className={'text-center font-light text-white text-lg'}>SecureVision needs access to your
                            camera so that you can scan for laptops.
                        </Text>
                    </View>
                </View>
            </View>
        );
    }

    let camera: Camera
    const TakePicture = async () => {
        setCapturing(true)
        if (camera) {
            camera.takePictureAsync({base64: true}).then((data) => {
                // data.base64 = data.base64?.replace("data:image/jpeg;base64,", "")

                setPictureURI(data.uri)
                setPictureTaken(true)
                setCapturing(false)

            })
        }
    }

    const onPictureRetake = () => {
        setPictureTaken(false)
        setPictureURI("")
    }

    const onPictureConfirm = () => {
        setFindingLaptop(true)
    }

    if (pictureTaken) {
        return (
            <View className={`flex flex-col justify-center items-center h-screen w-screen`}>
                <Card className={`w-[90vw] py-1`}>
                    <Card.Title
                        title="Laptop"
                        left={(props) => <Avatar.Icon {...props} icon="laptop"/>}

                    />
                    <Card.Content>
                        <Text className={`text-white mb-2`}>
                            Make sure the laptop is in the center of the picture.
                        </Text>
                    </Card.Content>
                    <View className={`mx-5 my-1 mb-4`}>
                        <Card.Cover source={{uri: pictureURI || 'https://picsum.photos/700'}}/>
                    </View>
                    <View className={`px-3`}>
                        <Card.Actions>
                            <Button onPress={onPictureRetake}>Cancel</Button>
                            <Button
                                loading={findingLaptop}
                                onPress={onPictureConfirm}>Ok</Button>
                        </Card.Actions>
                    </View>
                </Card>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <Camera
                    ref={(r) => {
                        if (r) camera = r as Camera;
                    }}
                    style={styles.camera} type={type}>
                    <View
                        className={`flex self-end flex-row justify-between items-center px-10 py-10 mt-[80vh] space-x-6`}>
                        <Button
                            loading={capturing}
                            className={`flex flex-row justify-between items-center px-4`}
                            buttonColor={MD2Colors.grey700}
                            textColor={MD2Colors.white}
                            icon={"laptop"}
                            mode="contained"
                            onPress={TakePicture}>
                            Scan for Laptop
                        </Button>

                        <IconButton
                            mode="contained"
                            style={styles.button}
                            icon="camera"
                            iconColor={MD2Colors.white}
                            containerColor={MD2Colors.grey700}
                            size={25}
                            onPress={toggleCameraType}
                        />
                    </View>
                </Camera>
            </View>
        );

    }


};

export default ScannerPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
        alignItems: 'center',
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    switch: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',

    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});