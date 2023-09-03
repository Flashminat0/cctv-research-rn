import {Text, View, Keyboard} from 'react-native';
import {Link} from 'expo-router';

import {ActivityIndicator, MD2Colors, TextInput, Button, Snackbar} from "react-native-paper";
import React, {useEffect, useState} from "react";
import {storeData, getData, removeData} from "./asyncStorage";
import {router} from 'expo-router';
import {
    auth
} from "../firebase";
import {getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";

export default function Page() {
    const [loading, setLoading] = useState<boolean>(true);
    const [loggedInEmail, setLoggedInEmail] = useState<string | null>(null);

    useEffect(() => {
        getData('email').then((value) => {
            setLoggedInEmail(value);
            setLoading(false);
        })
    }, []);

    useEffect(() => {
        // console.log(loggedInEmail);

        if (loggedInEmail) {
            router.replace('/router');
        }

    }, [loading, loggedInEmail]);


    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);

    const [loginLoading, setLoginLoading] = useState<boolean>(false);
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);

    const [errorShow, setErrorShow] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>('');

    const loginWithFirebase = async () => {
        setLoginLoading(true);
        setLoginSuccess(false);
        setSecureTextEntry(true);
        Keyboard.dismiss();


        if (email.split('@')[1] !== 'my.sliit.lk') {
            setLoginLoading(false);
            setLoginSuccess(false);

            setErrorShow(true);

            setErrorText('Please use your SLIIT email address');

            setTimeout(() => {
                setErrorShow(false);
                setErrorText('');
            }, 7000);
            return;
        }


        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                // ...
                setLoginSuccess(true);
                // console.log(user);

                storeData('email', email).then(() => {
                    setLoginSuccess(true);

                    setTimeout(() => {
                        router.replace('/router');
                    }, 2000);
                });

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(errorCode);


                if (errorCode !== 'auth/user-not-found') {

                    setLoginLoading(false);
                    setLoginSuccess(false);

                    setErrorShow(true);

                    const formattedMessage = errorCode.replace('auth/', '').replace('-', ' ')[0].toUpperCase() + errorCode.replace('auth/', '').replace('-', ' ').slice(1);


                    setErrorText(formattedMessage);

                    setTimeout(() => {
                        setErrorShow(false);
                        setErrorText('');
                    }, 7000);
                } else {
                    setLoginLoading(true);
                    setErrorShow(true);
                    setErrorText('Account not found. Creating new account . . .');


                    createUserWithEmailAndPassword(auth, email, password)
                        .then((userCredential) => {
                            // Signed in
                            const user = userCredential.user;

                            setErrorShow(false);
                            setErrorText('');

                            setLoginSuccess(true);
                            // console.log(user);

                            // ...

                            storeData('email', email).then(() => {
                                setLoginSuccess(true);

                                setTimeout(() => {
                                    router.replace('/router');
                                }, 2000);
                            });
                        })
                        .catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            // ..

                            const formattedMessage = errorCode.replace('auth/', '').replace('-', ' ')[0].toUpperCase() + errorCode.replace('auth/', '').replace('-', ' ').slice(1);

                            setLoginLoading(false);
                            setErrorShow(true);
                            setErrorText(formattedMessage);

                            setTimeout(() => {
                                setErrorShow(false);
                                setErrorText('');
                            }, 7000);
                        });
                }
            });

    }


    return <View className={`h-screen flex ${loading && 'items-center justify-center'}`}>
        <Snackbar
            className={`mx-5`}
            visible={errorShow}
            onDismiss={() => setErrorShow(false)}
            action={{
                label: 'Dismiss',
                onPress: () => {
                    // Do something

                },
            }}>
            {errorText}
        </Snackbar>

        <ActivityIndicator
            size={100}
            animating={loading} color={MD2Colors.red800}/>

        {!loading && (
            <View className={`p-5 flex justify-between h-[90vh]`}>
                <View className={`space-y-3`}>
                    <Text className={`text-3xl`}>Login</Text>
                    <View className={`flex flex-col space-y-1`}>
                        <TextInput
                            textContentType={`emailAddress`}
                            placeholder={`it2XXXXXXX@my.sliit.lk`}
                            mode={`flat`}
                            label="Email"
                            value={email}
                            onChangeText={text => setEmail(text)}
                        />
                        <TextInput
                            secureTextEntry={secureTextEntry}
                            label="Password"
                            value={password}
                            onChangeText={text => setPassword(text)}
                            right={<TextInput.Icon
                                onPress={() => setSecureTextEntry(!secureTextEntry)}
                                icon="eye"/>}
                        />
                    </View>
                    <Button
                        buttonColor={MD2Colors.grey700}
                        textColor={MD2Colors.white}
                        icon={loginLoading ? loginSuccess ? 'lock-open-variant' : "lock-open" : "lock"}
                        mode="contained"
                        onPress={loginWithFirebase}>
                        {loginLoading ? loginSuccess ? `Welcome ${email.split('@')[0]}` : 'Loading . . .' : 'Login / Register'}
                    </Button>
                </View>
                {!errorShow && <View className={`flex flex-col space-y-1 justify-center items-center`}>
                    <Text>
                        Help
                    </Text>
                </View>}
            </View>
        )}

    </View>;
}