import React, {useEffect, useState} from 'react';
import {Text, View, TextInput, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const Location = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Izin Akses Lokasi',
            message: 'Aplikasi ini membutuhkan akses lokasi Anda.',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log('Izin akses lokasi ditolak');
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getCurrentLocation = () => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          setLatitude(latitude.toString());
          setLongitude(longitude.toString());
        },
        error => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 10,
        },
      );
    };

    requestLocationPermission();
  }, []);

  return (
    <View>
      <Text>Latitude:</Text>
      <TextInput
        value={latitude}
        onChangeText={text => setLatitude(text)}
        placeholder="Masukkan latitude"
      />

      <Text>Longitude:</Text>
      <TextInput
        value={longitude}
        onChangeText={text => setLongitude(text)}
        placeholder="Masukkan longitude"
      />
    </View>
  );
};

export default Location;
