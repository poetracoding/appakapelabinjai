import React, {useEffect} from 'react';
import {View, Text, StatusBar, Image} from 'react-native';
import {StackActions} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
const SplashScreen = ({navigation}) => {
  // const tokenlogin = async () => {
  //   const value = await AsyncStorage.getItem('token');
  //   if (value !== null) {
  //     navigation.navigate('Home');
  //     console.log('Sudah Login');
  //   } else {
  //     console.log('BelumLogin');
  //   }
  // };

  useEffect(() => {
    setTimeout(() => {
      const tokenlogin = async () => {
        const value = await AsyncStorage.getItem('token');
        if (value !== null) {
          navigation.dispatch(StackActions.replace('Home'));
          console.log('Sudah Login');
        } else {
          navigation.dispatch(StackActions.replace('Login'));
          console.log('BelumLogin');
        }
      };

      tokenlogin();
      // navigation.navigate('Home');
    }, 2000);
  }, []);
  return (
    <LinearGradient
      colors={['#8bd2cb', '#95e2de']}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* <Icon
        style={{color: 'white', fontSize: 50, fontWeight: 'bold'}}
        name="map-marker-alt"
      /> */}
      <View>
        <Image
          source={{uri: 'https://akapelasiantar.com/logobaru.png'}}
          style={{
            height: 150,
            width: 150,
            // borderRadius: 5,
            padding: 10,
          }}
        />
      </View>
      <Text style={{color: 'white', fontSize: 38, fontWeight: 'bold'}}>
        AKAPELA
      </Text>
      <Text style={{color: 'white'}}>UP3 PEMATANG SIANTAR</Text>
      <Text style={{color: 'white', fontSize: 10}}>Versi. 2.0</Text>
    </LinearGradient>
  );
};
export default SplashScreen;
