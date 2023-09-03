import React, {useState} from 'react';
import {Camera, CameraType} from 'expo-camera';
import {StyleSheet, Text, View} from 'react-native';
import {Avatar, Button, Card, IconButton, MD2Colors} from "react-native-paper";
import {useAppDispatch, useAppSelector} from "../../features/redux";
import {setLaptop} from "../../features/laptopSlice";
import {getData, storeData} from "../asyncStorage";
import {database, storage} from "../../firebase";
import {getDownloadURL, ref as storageRef, uploadBytes,} from 'firebase/storage';
import {ref as databaseRef, set, onValue, get, child} from 'firebase/database';
import {decode} from 'base-64';
import {setTracker} from "../../features/trackerSlice";


if (typeof atob === 'undefined') {
    global.atob = decode;
}

export interface jobData {
    id: string,
    image_of_laptop: string,
    timestamp: number,
}

export interface UserData {
    expoToken: string,
    email: string,
    jobs: jobData[]
    notifications: []
    currentJobTimestamp: number
}

const ScannerPage = () => {
    const dispatch = useAppDispatch();
    const laptop = useAppSelector(state => state.laptop);

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
            camera.takePictureAsync({
                base64: true,
                quality: 0.7,
            }).then((data) => {
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

    const onPictureConfirm = async () => {
        setFindingLaptop(true)

        const blob: Blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', pictureURI, true);
            xhr.send(null);
        });

        const userEmail = await getData("email") || "ERR@"
        const timestamp = new Date().getTime();

        const FStorageRef = storageRef(storage, 'jobs/' + userEmail.split('@')[0] + '/' + timestamp + '/' + 'source.jpg');

        uploadBytes(FStorageRef, blob,).then((snapshot) => {
            getDownloadURL(FStorageRef)
                .then((url) => {
                    uploadDataToFirebase(url, timestamp, userEmail);
                });
        });
    }

    const uploadDataToFirebase = (url: string, timestamp: number, userEmail: string | null) => {
        let userData: UserData
        const userRef = databaseRef(database)

        get(child(userRef, `users/${userEmail?.split('@')[0]}/`)).then(async (snapshot) => {
            const data: UserData = snapshot.val();

            if (data) {
                userData = {
                    expoToken: await getData("expoPushToken") || "",
                    email: await getData("email") || "",
                    jobs: [
                        ...data.jobs,
                        {
                            id: data.jobs.length.toString(),
                            image_of_laptop: url,
                            timestamp: timestamp
                        }
                    ],
                    notifications: data.notifications || [],
                    currentJobTimestamp: timestamp
                }
            } else {
                userData = {
                    expoToken: await getData("expoPushToken") || "",
                    email: await getData("email") || "",
                    jobs: [
                        {
                            id: "0",
                            image_of_laptop: url,
                            timestamp: timestamp
                        }
                    ],
                    notifications: [],
                    currentJobTimestamp: timestamp
                }
            }


            set(databaseRef(database, `users/${userEmail?.split('@')[0]}/`), userData).then(r => {
                getData("email").then(async (email) => {
                    await storeData('isLaptop', 'true')
                    await storeData('imageBase64', pictureURI)
                    await storeData('boundUserEmail', email || "")
                    await storeData('timestamp', timestamp.toString())

                    dispatch(setLaptop({
                        isLaptop: true,
                        imageBase64: pictureURI,
                        boundUserEmail: email || "",
                        timestamp: timestamp
                    }))

                    dispatch(setTracker({
                        active: false,
                        found: false,
                        tracking: false,
                        problem: false,
                        problemMessage: ""
                    }))
                })

            });
        });


    };

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