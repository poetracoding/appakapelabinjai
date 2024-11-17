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
      colors={['#125B9A', '#0B8494']}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* <Icon
        style={{color: 'white', fontSize: 50, fontWeight: 'bold'}}
        name="map-marker-alt"
      /> */}
      <View>
        <Image
          source={{uri: 'https://binjaiexcellent.com/img/logo_text_white.png'}}
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
      <Text style={{color: 'white'}}>UP3 BINJAI</Text>
      <Text style={{color: 'white', fontSize: 10}}>Versi. 4.0</Text>
    </LinearGradient>
  );
};
export default SplashScreen;
