import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {GlobalProvider} from './src/screens/GlobalContext';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';
import SplashScreen from './src/screens/SplashScreen';
import Tag from './src/screens/Tag';
import History from './src/screens/History';
import Invoce from './src/screens/Invoice';
import Report from './src/screens/Report';
import Search from './src/screens/Search';
import Login from './src/screens/Login';
import Lpb from './src/screens/Lpb';
import Nik from './src/screens/Nik';
import Lapangan from './src/screens/Lapangan';
import Strip from './src/screens/Strip';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <GlobalProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="Tag" component={Tag} />
          <Stack.Screen name="History" component={History} />
          <Stack.Screen name="Invoice" component={Invoce} />
          <Stack.Screen name="Report" component={Report} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Lpb" component={Lpb} />
          <Stack.Screen name="Nik" component={Nik} />
          <Stack.Screen name="Lapangan" component={Lapangan} />
          <Stack.Screen name="Strip" component={Strip} />
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProvider>
  );
};

export default App;
