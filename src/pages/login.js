import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const navigation = useNavigation()

    const handleLogin = () => {
        if (email === '' && password === ''){
            navigation.navigate('main')
        } else {
            alert('Invalid email or password!')
        }
    }

    const handleRegister = () => {
        navigation.navigate('register')
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={ styles.input }
                placeholder="Email"
                value={email}    
                onChangeText={setEmail}
            />
            <TextInput
                style={ styles.input }
                placeholder="Password"
                secureTextEntry={true}
                value={password}    
                onChangeText={setPassword}
            />
            <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={handleLogin} >
                <Text style={ styles.buttonText }>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={handleRegister} >
                <Text style={ styles.buttonText }>Register User</Text>
            </TouchableOpacity>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '80%',
    },
    button: {
        backgroundColor: "#3498db",
        borderRadius: 5,
        padding: 10,
        width: '80%',
        alignItems: 'center'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    }
})

export default Login;