import React, {useEffect, useState, useContext} from 'react';
import {View, TouchableOpacity, PermissionsAndroid} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {GlobalContext} from './GlobalContext';
import HeaderBackHome from './HeaderBackHome';

const Lapangan = ({navigation}) => {
  const {
    usernameGlobal,
    namaGlobal,
    jabatanGlobal,
    unitGlobal,
    setUsernameGlobal,
  } = useContext(GlobalContext);
  const [dataServer, setDataServer] = useState([]);
  const [lat, setLat] = useState(2.957723);
  const [lng, setLng] = useState(99.05872);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 2.957723,
    longitude: 99.05872,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [markers, setMarkers] = useState([]);

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        console.warn('Location permission denied');
        // Tambahkan logika atau notifikasi untuk pengguna jika perlu
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        console.log(latitude + ',' + longitude);
        setLat(latitude);
        setLng(longitude);
        ambilDataServer(latitude, longitude);
        setInitialRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      },
      error => console.error(error),
      {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000},
    );
  };

  const ambilDataServer = async (latitude, longitude) => {
    try {
      const requestData = {
        latitude,
        longitude,
        // radius: 1,
        // tambahkan field lain jika diperlukan
      };

      const response = await fetch(
        'https://api.akapelasiantar.com/newapi/terdekat',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        },
      );

      const json = await response.json();
      setDataServer(json);

      const convertedMarkers = Object.keys(json).map(key => {
        const data = json[key];
        return {
          id: data.id,
          latitude: parseFloat(data.lat),
          longitude: parseFloat(data.lng),
          title: data.title,
          description: data.description,
        };
      });

      setMarkers(convertedMarkers);
      console.log('Markers:', convertedMarkers);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    let watchID;

    const cleanup = () => {
      if (watchID) {
        Geolocation.clearWatch(watchID);
      }
    };

    const startLocationTracking = async () => {
      await requestLocationPermission();
      watchID = Geolocation.watchPosition(
        position => {
          const {latitude, longitude} = position.coords;
          console.log(latitude + ',' + longitude);
          setLat(latitude);
          setLng(longitude);
          ambilDataServer(latitude, longitude);
          setInitialRegion({
            latitude,
            longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        },
        error => console.error(error),
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000},
      );
    };

    startLocationTracking();

    return cleanup;
  }, []);

  useEffect(() => {
    console.log('Markers Updated:', markers);
  }, [markers]);

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <HeaderBackHome />
      </TouchableOpacity>
      <View style={{height: '80%', margin: 10, borderWidth: 1}}>
        <MapView
          style={{height: '100%', borderRadius: 5}}
          region={initialRegion}>
          <Marker
            pinColor="green"
            coordinate={initialRegion}
            title="Lokasi Anda"
            description="Anda berada di sini"
          />
          {markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude,
              }}
              title={marker.title}
              description={marker.description}
            />
          ))}
        </MapView>
      </View>
    </View>
  );
};

export default Lapangan;
