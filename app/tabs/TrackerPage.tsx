import React, {useEffect, useState} from 'react';

import {Text, View} from 'react-native';

import {database} from "../../firebase";
import {getData} from "../asyncStorage";
import {ref as databaseRef, set, onValue, get, child} from 'firebase/database';
import {jobData, UserData} from "./ScannerPage";
import {Avatar, Button, Card, IconButton, MD3Colors, Tooltip, Modal, Portal} from "react-native-paper";
import {clearLaptop, setLaptop} from "../../features/laptopSlice";
import {useAppDispatch, useAppSelector} from "../../features/redux";
import {clearTracker} from "../../features/trackerSlice";
import * as Progress from 'react-native-progress';

const TrackerPage = () => {
    const dispatch = useAppDispatch();
    const tracker = useAppSelector(state => state.tracker);

    const failedImage = 'https://firebasestorage.googleapis.com/v0/b/research-cctv.appspot.com/o/failed.png?alt=media&token=90c50d27-cca4-4a83-891a-d78d5651d413'
    const searchingImage = 'https://firebasestorage.googleapis.com/v0/b/research-cctv.appspot.com/o/searching.png?alt=media&token=e40a434d-76e9-4706-b1d1-b595f46e8b19'
    const [cctvImage, setCctvImage] = useState<string>(searchingImage)

    const [showLoading, setShowLoading] = useState<boolean>(true);

    useEffect(() => {
        if (tracker.found) {
            setShowLoading(false)
        }

        if (tracker.tracking) {
            setShowLoading(false)
        }

        if (tracker.problem) {
            setShowLoading(false)
            setCctvImage(failedImage)
        }
    }, [tracker]);


    const [userEmail, setUserEmail] = useState<string>('ERR@');
    const [currentJobTimestamp, setCurrentJobTimestamp] = useState<number>(0);
    const [currentJobStatus, setCurrentJobStatus] = useState<jobData | undefined>();

    const checkForStatusChangeOnJob = (timeStamp: number) => {
        const userRef = databaseRef(database, `users/${userEmail?.split('@')[0]}/`)

        onValue(userRef, (snapshot) => {
            const data: UserData = snapshot.val();

            if (data) {
                const currentJob = data.jobs.find(job => job.timestamp === timeStamp)

                if (currentJob) {
                    setCurrentJobStatus(currentJob)

                    console.log(currentJob)
                }
            }
        })
    }

    useEffect(() => {
        getData("timestamp")
            .then((timestamp) => {
                getData("email").then((email) => {

                    setUserEmail(email || "")
                    setCurrentJobTimestamp(parseInt(timestamp || "0"))
                })
            })
    }, []);


    useEffect(() => {
        if (currentJobTimestamp > 0 && userEmail.length > 0 && userEmail !== 'ERR@') {
            checkForStatusChangeOnJob(currentJobTimestamp)

        }
    }, [currentJobTimestamp]);

    const resetJob = () => {
        dispatch(clearLaptop())
        dispatch(clearTracker())
    }

    useEffect(() => {
        if (currentJobStatus) {
            setupJob()
        }
    }, [currentJobStatus]);

    const setupJob = () => {
        set(databaseRef(database, `jobs/${userEmail?.split('@')[0]}/`), {
            // basic details
            laptopImage: currentJobStatus?.image_of_laptop || "",
            timestamp: currentJobTimestamp,
            userEmail: userEmail,

            // tracking details
            found: false,
            tracking: false,
            problem: false,
            problemMessage: "",
            cctvImageURL: "",

            // active status
            active: true,
        })
    }

    const [showHelp, setShowHelp] = useState<boolean>(false);
    const containerStyle = {backgroundColor: 'white', padding: 20 , margin: 20};

    return (
        <View>
            <Portal>
                <Modal visible={showHelp} onDismiss={() => {
                    setShowHelp(false)
                }} contentContainerStyle={containerStyle}>
                    <Text>Add Help here //Todo.</Text>
                </Modal>
            </Portal>
            <View className={`flex flex-col justify-center items-center h-screen w-screen`}>
                <Card className={`w-[90vw] py-1`}>
                    <Card.Title
                        title="Confirm Laptop"
                        left={(props) => <Avatar.Icon {...props} icon="laptop"/>}
                    />
                    <Card.Content>
                        <Text className={`text-white mb-2`}>
                            Please confirm that this is your laptop
                        </Text>
                    </Card.Content>

                    <View className={`border-0 border-t-2 border-gray-400 pt-12`}>

                        <Text className={`text-white mb-2 mx-5 text-xs`}>
                            Mobile image of laptop
                        </Text>
                        <View className={`mx-5 my-1 mb-4`}>
                            <Card.Cover
                                source={{uri: currentJobStatus?.image_of_laptop || 'https://picsum.photos/700'}}/>
                        </View>
                        <Text className={`text-white mb-2 mx-5 text-xs`}>
                            CCTV image of laptop
                        </Text>
                        <View className={`mx-5 my-1 mb-4`}>
                            <Card.Cover
                                source={{uri: cctvImage}}/>
                            {showLoading && <View className={`px-1 pt-1`}>
                                <Progress.Bar
                                    width={320}
                                    useNativeDriver={true}
                                    animationConfig={{bounciness: 1}}
                                    className={' bg-gray-300 px-2'}
                                    indeterminate={true}
                                    animationType={'timing'}
                                />
                            </View>}

                        </View>
                    </View>
                    <View className={`px-3`}>
                        <Card.Actions className={`flex flex-row w-full justify-between`}>
                            <Tooltip title="Help">
                                <IconButton
                                    icon="help"
                                    iconColor={MD3Colors.error50}
                                    size={20}
                                    onPress={() => setShowHelp(true)}
                                />
                            </Tooltip>
                            <View className={'grow flex flex-row justify-end'}>
                                <View className={`flex flex-row space-x-2 items-center`}>
                                    <Button
                                        mode={'outlined'}
                                        onPress={resetJob}>No Try Again</Button>
                                    <Button
                                        mode={'contained'}
                                        loading={false}
                                        onPress={() => {
                                        }}>Yes</Button>
                                </View>
                            </View>
                        </Card.Actions>
                    </View>
                </Card>
            </View>
            <Text className={`pt-10 text-white`}>
                {JSON.stringify(currentJobStatus)}
            </Text>
        </View>
    );
};

export default TrackerPage;
