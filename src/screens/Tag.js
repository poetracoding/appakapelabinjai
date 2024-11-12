import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  PermissionsAndroid,
  Image,
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {launchCamera} from 'react-native-image-picker';
import axios from 'axios';
import ImageResizer from 'react-native-image-resizer';
import qs from 'qs';

import {GlobalContext} from './GlobalContext';
import HeaderBackHome from './HeaderBackHome';
import SelectDropdown from 'react-native-select-dropdown';

const Tag = ({navigation}) => {
  const [latitude, setLatitude] = useState(2.957723);
  const [longitude, setLongitude] = useState(99.05872);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 2.957723,
    longitude: 99.05872,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [markers, setMarkers] = useState([]);

  const [searchText, setSearchText] = useState('');
  const [dataServer, setDataServer] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [idserver, setIdserver] = useState('');
  const [nik, setNIK] = useState('');
  const [nohp, setNoHP] = useState('');
  const [npwp, setNPWP] = useState('');
  const [foto, setFoto] = useState(null);
  const [foto2, setFoto2] = useState(null);

  const {usernameGlobal} = useContext(GlobalContext);

  useEffect(() => {
    requestPermissions();
    startLocationUpdates();
  }, []);

  const startLocationUpdates = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setInitialRegion({
          latitude,
          longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      },
      error => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000,
      },
    );
  };

  const requestPermissions = async () => {
    try {
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );
      const locationGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This app needs access to your location.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        },
      );

      if (
        cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
        locationGranted === PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Location permission granted');
      } else {
        console.log('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const [statusLunas, setStatusLunas] = useState(null);
  const data1 = ['Lunas', 'Belum Lunas'];

  const handleOnSelect1 = item => {
    setStatusLunas(item);
  };

  const kirimPOST = () => {
    const data = {
      idserver: idserver,
      nik: nik,
      npwp: npwp,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      foto: foto,
      foto2: foto2,
      petugas: usernameGlobal,
      nohp: nohp,
      statuslunas: statusLunas,
    };
    console.log(data);

    const formData = qs.stringify(data);

    axios
      .put('https://api.akapelasiantar.com/newapi/tag/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then(response => {
        setSearchText('');
        setSelectedImage(null);
        setNIK('');
        setNoHP('');
        setNPWP('');
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log(response.errorMessage);
      } else {
        ImageResizer.createResizedImage(
          response.assets[0].uri,
          800,
          800,
          'JPEG',
          80,
          0,
        )
          .then(resizedImage => {
            const formData = new FormData();
            formData.append('image', {
              uri: resizedImage.uri,
              type: response.assets[0].type,
              name: response.assets[0].fileName || 'image.jpg',
            });
            setFoto(response.assets[0].fileName || 'image.jpg');

            axios
              .post('https://akapelasiantar.com/apiakapela/', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then(res => {
                console.log('Upload successful:', res.data);
              })
              .catch(error => {
                console.error('Upload failed:', error);
              });

            setSelectedImage(resizedImage.uri);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };
  const openCamera2 = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log(response.errorMessage);
      } else {
        ImageResizer.createResizedImage(
          response.assets[0].uri,
          800, // New width
          800, // New height
          'JPEG', // Compress format, defaults to JPEG
          80, // Compression quality
          0, // Rotation degree, default to 0
        )
          .then(resizedImage => {
            const formData = new FormData();
            formData.append('image', {
              uri: resizedImage.uri,
              type: response.assets[0].type,
              name: response.assets[0].fileName || 'image.jpg',
            });
            setFoto2(response.assets[0].fileName || 'image.jpg');

            axios
              .post('https://akapelasiantar.com/apiakapela/', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then(res => {
                console.log('Upload successful:', res.data);
              })
              .catch(error => {
                console.error('Upload failed:', error);
              });

            setSelectedImage2(resizedImage.uri);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  const searchPelanggan = () => {
    fetch(
      'https://api.akapelasiantar.com/newapi/pelangganinv/?idp=' +
        searchText +
        '&user=' +
        usernameGlobal,
    )
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json.status === false) {
          setDataServer(null);
          Alert.alert('Informasi', `Data ${searchText} tidak ditemukan.`);
        } else {
          startLocationUpdates();
          setDataServer(json);
          setIdserver(json.id);
        }
      })
      .catch(error => {
        Alert.alert('Informasi', `Data ${searchText} tidak ditemukan !`);
      });
  };

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <HeaderBackHome />
      </TouchableOpacity>
      <ScrollView
        style={{marginTop: 10, marginHorizontal: 20, marginBottom: 50}}>
        <View style={{marginBottom: 10, flexDirection: 'row'}}>
          <TextInput
            keyboardType="numeric"
            onChangeText={text => setSearchText(text)}
            value={searchText}
            placeholder="ID Pelanggan"
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              height: 30,
              width: '70%',
              paddingVertical: 0,
              paddingHorizontal: 10,
              borderRadius: 5,
              color: 'black',
            }}
          />
          <TouchableOpacity onPress={searchPelanggan}>
            <View
              style={{
                height: 30,
                width: 60,
                marginStart: 5,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#24BB8E',
                borderRadius: 5,
                color: 'black',
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {' '}
                <Icon size={15} name="search" /> Cari
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 10}}>
          <MapView
            style={{flex: 1, height: 100, borderRadius: 5}}
            region={initialRegion}>
            <Marker
              pinColor="green"
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              title="Lokasi Anda"
              description="Anda berada di sini"
            />
          </MapView>
        </View>
        <View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 120}}>ID Pelanggan </Text>
            {dataServer && dataServer.idpelanggan !== null ? (
              <Text>: {dataServer.idpelanggan}</Text>
            ) : (
              <Text>: </Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 120}}>Nama Pelanggan </Text>
            {dataServer && dataServer.namapelanggan !== null ? (
              <Text>: {dataServer.namapelanggan}</Text>
            ) : (
              <Text>: </Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 120}}>Alamat </Text>
            {dataServer && dataServer.alamat !== null ? (
              <Text>: {dataServer.alamat}</Text>
            ) : (
              <Text>: </Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 120}}>ULP </Text>
            {dataServer && dataServer.kodeulp !== null ? (
              <Text>: {dataServer.kodeulp}</Text>
            ) : (
              <Text>: </Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 120}}>Tarif/Daya </Text>
            {dataServer && dataServer.rptag !== null ? (
              <Text>
                : {dataServer.tarif}/{dataServer.daya}
              </Text>
            ) : (
              <Text>:</Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 120}}>Bulan </Text>
            {dataServer && dataServer.blth !== null ? (
              <Text>: {dataServer.blth}</Text>
            ) : (
              <Text>: </Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 120}}>Rp Tagihan </Text>
            {dataServer && dataServer.rptag !== null ? (
              <Text>: Rp. {dataServer.rptag},-</Text>
            ) : (
              <Text>: </Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 120}}>Manager ULP </Text>
            {dataServer && dataServer.alamat !== null ? (
              <Text>: {dataServer.mulp}</Text>
            ) : (
              <Text>: </Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 120}}>Petugas </Text>
            {dataServer && dataServer.petugas !== null ? (
              <Text>: {dataServer.petugas}</Text>
            ) : (
              <Text>: </Text>
            )}
          </View>
        </View>

        <View>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Entry</Text>
        </View>
        <View
          style={{
            borderColor: 'gray',
            borderWidth: 1,
            height: 80,
            width: '100%',
            paddingVertical: 0,
            paddingHorizontal: 10,
            borderRadius: 5,
            color: 'black',
            marginBottom: 5,
          }}>
          <Text>Lunas/Belum Lunas: {statusLunas}</Text>
          <SelectDropdown
            dropdownStyle={{width: 330}}
            data={data1}
            onSelect={handleOnSelect1}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          />
        </View>
        <View style={{marginBottom: 5}}>
          <TextInput
            keyboardType="numeric"
            placeholder="NIK (Optional)"
            onChangeText={text => setNIK(text)}
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              height: 30,
              width: '100%',
              paddingVertical: 0,
              paddingHorizontal: 10,
              borderRadius: 5,
              color: 'black',
            }}
          />
        </View>
        <View style={{marginBottom: 5}}>
          <TextInput
            keyboardType="numeric"
            placeholder="No HP Pelanggan  (Optional)"
            onChangeText={text => setNoHP(text)}
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              height: 30,
              width: '100%',
              paddingVertical: 0,
              paddingHorizontal: 10,
              borderRadius: 5,
              color: 'black',
            }}
          />
        </View>
        <View style={{marginBottom: 5}}>
          <TextInput
            placeholder="NPWP  (Optional)"
            onChangeText={text => setNPWP(text)}
            keyboardType="numeric"
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              height: 30,
              width: '100%',
              paddingVertical: 0,
              paddingHorizontal: 10,
              borderRadius: 5,
              color: 'black',
            }}
          />
        </View>

        <View style={{marginBottom: 5, flexDirection: 'row'}}>
          <TextInput
            placeholder="Latitude"
            value={latitude.toString()}
            onChangeText={text => setLatitude(text)}
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              height: 30,
              paddingVertical: 0,
              paddingHorizontal: 10,
              borderRadius: 5,
              width: '50%',
              color: 'black',
            }}
          />
          <TextInput
            placeholder="Longitude"
            value={longitude.toString()}
            onChangeText={text => setLongitude(text)}
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              height: 30,
              paddingVertical: 0,
              paddingHorizontal: 10,
              borderRadius: 5,
              width: '50%',
              color: 'black',
            }}
          />
        </View>

        <TouchableOpacity onPress={openCamera}>
          <View
            style={{
              marginBottom: 5,
              backgroundColor: '#277DBF',
              paddingVertical: 10,
              alignItems: 'center',
              borderRadius: 5,
              width: '100%',
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              <Icon size={15} name="camera" /> Foto Pelanggan
            </Text>
          </View>
        </TouchableOpacity>

        {selectedImage && (
          <View>
            <Image
              source={{uri: selectedImage}}
              style={{
                height: 200,
                backgroundColor: '#D5D2D2',
                marginBottom: 5,
                padding: 5,
                width: '100%',
                borderRadius: 5,
              }}
            />

            <TouchableOpacity onPress={openCamera2}>
              <View
                style={{
                  marginBottom: 5,
                  backgroundColor: '#277DBF',
                  paddingVertical: 10,
                  alignItems: 'center',
                  borderRadius: 5,
                  width: '100%',
                }}>
                <Text style={{color: 'white', fontWeight: 'bold'}}>
                  <Icon size={15} name="camera" /> Foto Rumah
                </Text>
              </View>
            </TouchableOpacity>
            {selectedImage2 && (
              <View>
                <Image
                  source={{uri: selectedImage2}}
                  style={{
                    height: 200,
                    backgroundColor: '#D5D2D2',
                    marginBottom: 5,
                    padding: 5,
                    width: '100%',
                    borderRadius: 5,
                  }}
                />

                <TouchableOpacity onPress={kirimPOST}>
                  <View
                    style={{
                      marginBottom: 5,
                      backgroundColor: '#24BB8E',
                      paddingVertical: 10,
                      width: '100%',
                      borderRadius: 5,
                      alignItems: 'center',
                    }}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Simpan
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Tag;
