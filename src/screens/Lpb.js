import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  ScrollView,
  PermissionsAndroid,
  SafeAreaView,
  StyleSheet,
  BackHandler,
  Image,
  Alert,
} from 'react-native';
import HeaderBackHome from './HeaderBackHome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Geolocation from 'react-native-geolocation-service';
import MapView, {Marker} from 'react-native-maps';

import {launchCamera, MediaTypeOptions} from 'react-native-image-picker';
import axios from 'axios';
import ImageResizer from 'react-native-image-resizer';
// import NetInfo from '@react-native-community/netinfo';

import {GlobalContext} from './GlobalContext';

// import query
import qs from 'qs';

const Lpb = ({navigation}) => {
  //Koordinat
  // const [updateLocation, setUpdateLocation] = useState(true);
  // const [watchId, setWatchId] = useState(null); // Menyimpan watch ID

  const [latitude, setLatitude] = useState(3.6144284);
  const [longitude, setLongitude] = useState(98.4957911);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 3.6144284,
    longitude: 98.4957911,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [markers, setMarkers] = useState([]);

  const [isConnected, setIsConnected] = useState(true);
  const [text, onChangeText] = useState('Useless Text');
  const [number, onChangeNumber] = useState('');
  const [searchText, setSearchText] = useState('');
  const [dataServer, setDataServer] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);

  const [idpelanggan, setIdpel] = useState('');
  const [nik, setNIK] = useState('');
  const [keteranganlpb, setKetlpb] = useState('');
  const [nama, setNama] = useState('');
  const [nohp, setNoHP] = useState('');
  const [npwp, setNPWP] = useState('');
  const [foto, setFoto] = useState(null);
  const [foto2, setFoto2] = useState(null);
  const [idserver, setIdserver] = useState('');

  const {
    usernameGlobal,
    namaGlobal,
    jabatanGlobal,
    unitGlobal,
    setUsernameGlobal,
  } = useContext(GlobalContext);

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
        console.log('Di Ijinkan akses Lokasi');
        // startLocationUpdates();
      } else {
        console.log('Akses Lokasi Di tolak');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const kirimPOST = () => {
    // Objek data yang ingin dikirimkan
    const data = {
      id: searchText,
      nik: nik,
      keteranganlpb: keteranganlpb,
      nama: nama,
      npwp: npwp,
      latitude: latitude,
      longitude: longitude,
      foto: foto,
      foto2: foto2,
      petugas: usernameGlobal,
      nohp: nohp,
      idserver: idserver,
    };
    console.log(data);

    // Mengonversi objek data menjadi string dalam format x-www-form-urlencoded
    const formData = qs.stringify(data);

    axios
      .put('https://api.binjaiexcellent.com/newapi/tag/', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // Tambahkan header lain yang diperlukan
        },
      })
      .then(response => {
        // Tanggapan berhasil diterima

        setSearchText('');
        setSelectedImage(null);
        setSelectedImage2(null);
        setNIK('');
        setNama('');
        setNoHP('');
        setNPWP('');
        // dataServer(null);
        console.log(response.data);
      })
      .catch(error => {
        // Terjadi kesalahan dalam melakukan permintaan atau memperbarui data
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

  // Pencarian ID Pelanggan
  const searchPelanggan = () => {
    fetch(
      'https://api.binjaiexcellent.com/newapi/pelangganlpb/?idp=' +
        searchText +
        '&user=' +
        usernameGlobal,
    )
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json.status === false) {
          setDataServer(null);
          // console.log(json);
          Alert.alert('Informasi', `Data ${searchText} tidak ditemukan.`);
        } else {
          startLocationUpdates();
          setDataServer(json);
          // setIdserver(dataServer.id);
          setIdserver(json.id);
        }
      })
      .catch(error => {
        Alert.alert('Informasi', `Data ${searchText} tidak ditemukan !`);
      });
  };

  if (!isConnected) {
    Alert.alert(
      'Tidak Ada Koneksi Internet',
      'Pastikan Anda terhubung ke internet untuk menggunakan aplikasi ini.',
      [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      {cancelable: false},
    );
  }
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
        </View>

        <View>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Entry</Text>
        </View>
        <View style={{marginBottom: 5}}>
          <TextInput
            placeholder="Keterangan/ Justifikasi"
            onChangeText={text => setKetlpb(text)}
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              height: 60,
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

export default Lpb;
