import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Main from './pages/main';
import Login from './pages/login';
import User from './pages/user';
import Register from './pages/register';

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
          <Stack.Screen
            name="login"
            component={Login}
            options={{
              title: 'Login',
              headerTitleAlign: 'center',
              headerStyle: {
                backgroundColor: '#3498db',
              },
              headerTitleStyle: {
                fontWeight: 'bold',
                color: '#fff',
              },
              headerTintColor: '#fff',
            }}
          />
        <Stack.Screen
          name="main"
          component={Main}
          options={{
            title: 'The Rick and Morty Viewer',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#3498db',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#fff',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="user"
          component={User}
          options={{
            title: 'Character Profile',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#3498db',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#fff',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="register"
          component={Register}
          options={{
            title: 'Register User',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#3498db',
            },
            headerTitleStyle: {
              fontWeight: 'bold',
              color: '#fff',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
