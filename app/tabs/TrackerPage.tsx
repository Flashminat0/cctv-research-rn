import React, {useEffect, useState} from 'react';

import {Text, View} from 'react-native';

import {database} from "../../firebase";
import {getData} from "../asyncStorage";
import {child, get, onValue, ref as databaseRef, set} from 'firebase/database';
import {jobData, UserData} from "./ScannerPage";
import {Avatar, Button, Card, IconButton, MD2Colors, MD3Colors, Modal, Portal, Tooltip} from "react-native-paper";
import {clearLaptop} from "../../features/laptopSlice";
import {useAppDispatch, useAppSelector} from "../../features/redux";
import {clearTracker, setTracker} from "../../features/trackerSlice";
import * as Progress from 'react-native-progress';

interface ICoordinates {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

interface IBindResponse {
    laptop_image_path: string;
    similarity_score: number;
    coordinates: ICoordinates;
    status: string;
}


const TrackerPage = () => {
    const dispatch = useAppDispatch();
    const tracker = useAppSelector(state => state.tracker);
    const laptop = useAppSelector(state => state.laptop);

    const [donePhase, setDonePhase] = useState<boolean>(false);

    const failedImage = 'https://firebasestorage.googleapis.com/v0/b/research-cctv.appspot.com/o/failed.png?alt=media&token=90c50d27-cca4-4a83-891a-d78d5651d413'
    const searchingImage = 'https://firebasestorage.googleapis.com/v0/b/research-cctv.appspot.com/o/searching.png?alt=media&token=e40a434d-76e9-4706-b1d1-b595f46e8b19'
    const [cctvImage, setCctvImage] = useState<string>(searchingImage)

    const [showLoading, setShowLoading] = useState<boolean>(true);

    useEffect(() => {
        if (tracker.found) {
            setShowLoading(false)
        } else if (tracker.tracking) {
            setShowLoading(false)
        } else if (tracker.problem) {
            setShowLoading(false)
            setCctvImage(failedImage)
        } else if (!tracker.found) {
            setShowLoading(true)
            setCctvImage(searchingImage)
        } else {
            setShowLoading(true)
            setCctvImage(searchingImage)
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

                    // console.log(currentJob)
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
        if (currentJobTimestamp > 0 && userEmail.length > 0 && userEmail !== 'ERR@' && !donePhase) {
            checkForStatusChangeOnJob(currentJobTimestamp)
        }
    }, [currentJobTimestamp]);

    const resetJob = () => {
        dispatch(clearLaptop())
        dispatch(clearTracker())
        setCctvImage(searchingImage)
        setShowLoading(true)

        const trackerRef = databaseRef(database)

        get(child(trackerRef, `trackers/`))
            .then(async (snapshot) => {
                const data: string[] = snapshot.val();

                if (data) {
                    const arrayWithoutUser = data.filter((value) => value !== `${userEmail?.split('@')[0]}`)
                    // console.log(arrayWithoutUser)

                    await set(databaseRef(database, `trackers/`), arrayWithoutUser)
                }
            })
            .then(async () => {
                if (userEmail !== 'ERR@') {
                    await set(databaseRef(database, `jobs/${userEmail?.split('@')[0]}`), {
                        // basic details
                        laptopImage: "",
                        timestamp: "",
                        userEmail: "",

                        // tracking details
                        found: false,
                        tracking: false,
                        problem: false,
                        problemMessage: "",
                        cctvImageURL: "",

                        // active status
                        active: false,
                    })
                }
            })
            .then(() => {
                set(databaseRef(database, `cctv/${userEmail?.split('@')[0]}`), null)
            })
            .then(() => {
                setDonePhase(false)
            })


    }

    useEffect(() => {
        if (currentJobStatus && !tracker.found && !tracker.problem && !donePhase) {
            setupJob()
        }
    }, [currentJobStatus, tracker]);

    const setupJob = () => {
        dispatch(setTracker({
            // tracking details
            found: false,
            tracking: false,
            problem: false,
            problemMessage: "",
            cctvImageURL: "",

            // active status
            active: true,
        }))

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

    const setupTrackerInDB = () => {
        const trackerRef = databaseRef(database)

        let trackingUsers: string[] = []
        let isInArray = false;
        get(child(trackerRef, `trackers/`)).then((snapshot) => {
            const data: string[] = snapshot.val();

            if (tracker.active) {
                if (data) {
                    isInArray = data.includes(`${userEmail?.split('@')[0]}`)

                    if (isInArray) {
                        trackingUsers = data

                    } else {
                        trackingUsers = [
                            ...data,
                            `${userEmail?.split('@')[0]}`
                        ]
                    }

                } else {
                    trackingUsers = [`${userEmail?.split('@')[0]}`]
                }

                if (!tracker.problem && !tracker.found && !tracker.tracking && tracker.active) {
                    set(databaseRef(database, `trackers/`), trackingUsers)
                }
            }
        })


    }

    useEffect(() => {
        // console.log(tracker)

        if ((((tracker.active && userEmail !== 'ERR@') && !tracker.found) && showLoading) && !donePhase) {
            // console.log('setting up tracker')
            setupTrackerInDB()
        }
    }, [tracker, laptop, showLoading]);

    const [showHelp, setShowHelp] = useState<boolean>(false);
    const containerStyle = {backgroundColor: 'white', padding: 20, margin: 20};
    //
    // const checkForChangesInTracker = () => {

    // }
    //
    useEffect(() => {
        if (userEmail !== 'ERR@') {
            const jobRef = databaseRef(database, `jobs/${userEmail?.split('@')[0]}/`)

            onValue(jobRef, (snapshot) => {
                const data = snapshot.val();


                dispatch(setTracker(data))

                if (data.found) {

                    setCctvImage(data.cctvImageURL || searchingImage)
                    setShowLoading(false)
                    setDonePhase(true)
                }

                if (data.problem) {

                    setCctvImage(failedImage)
                    setShowLoading(false)
                    setDonePhase(true)
                }

            })
        }
    }, [userEmail]);


    const [trackingMode, setTrackingMode] = useState<boolean>(false);


    const handleStartTracking = () => {
        const userID = `${userEmail?.split('@')[0]}`
        // console.log('tracking started')

        const cctvRef = databaseRef(database)
        get(child(cctvRef, `cctv/${userID}`)).then((snapshot) => {
            const data: IBindResponse = snapshot.val()

            const newDataWIthTracker = {
                ...data,
                status: 'tracking',
            }

            set(databaseRef(database, `cctv/${userID}`), newDataWIthTracker)
                .then(() => {
                    setTrackingMode(true)
                })
        })
    }

    return (
        <View>
            <Portal>
                <Modal
                    theme={{colors: {primary: MD3Colors.error50}}}
                    visible={showHelp} onDismiss={() => {
                    setShowHelp(false)
                }} contentContainerStyle={containerStyle}>
                    <Text>Make sure that your laptop screen is on and the browser page should be on
                        laptop-app-cctv.vercel.app</Text>
                </Modal>
            </Portal>
            <View className={`flex flex-col justify-center items-center h-screen w-screen`}>
                {trackingMode ? <></> : <>
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
                                {/*https://fastly.picsum.photos/id/2/5000/3333.jpg*/}

                                <Card.Cover
                                    source={{uri: currentJobStatus?.image_of_laptop || 'https://picsum.photos/400'}}/>


                            </View>
                            <Text className={`text-white mb-2 mx-5 text-xs`}>
                                CCTV image of laptop
                            </Text>
                            <View className={`mx-5 my-1 mb-4`}>
                                {tracker.found ? <>
                                    <Card.Cover
                                        source={{uri: tracker.cctvImageURL}}/></> : <>
                                    <Card.Cover
                                        source={{uri: cctvImage}}/>
                                </>}
                                {showLoading && <View className={`px-1 pt-1`}>
                                    <Progress.Bar
                                        color={MD2Colors.grey700}
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
                                            onPress={handleStartTracking}>Yes</Button>
                                    </View>
                                </View>
                            </Card.Actions>
                        </View>
                    </Card>
                </>}

            </View>
        </View>
    );
};

export default TrackerPage;
