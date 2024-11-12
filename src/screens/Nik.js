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
// import NetInfo from '@react-native-community/netinfo';

import {launchCamera, MediaTypeOptions} from 'react-native-image-picker';
import axios from 'axios';
import ImageResizer from 'react-native-image-resizer';

import {GlobalContext} from './GlobalContext';

import SelectDropdown from 'react-native-select-dropdown';

// import query
import qs from 'qs';

const Nik = ({navigation}) => {
  const [text, onChangeText] = useState('Useless Text');
  const [number, onChangeNumber] = useState('');

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

  // const [updateLocation, setUpdateLocation] = useState(true);
  // const [watchId, setWatchId] = useState(null); // Menyimpan watch ID
  const [isConnected, setIsConnected] = useState(true);

  const [idpelanggan, setIdpel] = useState('');
  const [nik, setNIK] = useState('');
  const [nama, setNama] = useState('');
  const [nohp, setNoHP] = useState('');
  const [npwp, setNPWP] = useState('');
  const [foto, setFoto] = useState(null);

  const [idserver, setIdserver] = useState('');

  const [statusnik, setStatusNIK] = useState(null);
  const [keterangannik, setKeteranganNIK] = useState(null);

  const data1 = ['Tidak Bisa didata', 'Bisa didata'];
  const data2 = {
    'Tidak Bisa didata': [
      'Rumah kosong',
      'Rumah tutup',
      'Anjing galak',
      'Pagar terkunci',
      'Penghuni tidak bersedia didata',
      'Lainnya',
    ],
    'Bisa didata': [
      'Beli dari pemilik lama',
      'Keluarga dari pemilik (Istri/Anak/dll.)',
      'Pengontrak/Penyewa',
      'Penjaga/Pembantu',
      'Penghuni rumah dinas',
      'Perbaikan data sesuai KTP',
      'Pemilik sudah meninggal',
      'Lainnya',
    ],
  };

  const handleOnSelect1 = item => {
    setStatusNIK(item);
    setKeteranganNIK(null);
    // Berdasarkan pilihan select pertama, kita dapat mengubah pilihan select kedua:
    if (data2[item]) {
      setKeteranganNIK(null); // Reset pilihan select kedua
    }
  };

  const handleOnSelect2 = item => {
    setKeteranganNIK(item);
  };

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
      nama: nama,
      npwp: npwp,
      latitude: latitude,
      longitude: longitude,
      foto: foto,
      statusnik: statusnik,
      keterangannik: keterangannik,
      petugas: usernameGlobal,
      statusnik: statusnik,
      keterangannik: keterangannik,
      nohp: nohp,
      idserver: idserver,
    };
    console.log(data);

    // Mengonversi objek data menjadi string dalam format x-www-form-urlencoded
    const formData = qs.stringify(data);

    axios
      .put('https://api.akapelasiantar.com/newapi/tagnik/', formData, {
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
      Geolocation.clearWatch(watchId);
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
            setFoto(response.assets[0].fileName || 'image.jpg');
            // console.log(response.assets[0].fileName || 'image.jpg');

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
      startLocationUpdates();
    });
  };

  // Pencarian ID Pelanggan
  const searchPelanggan = () => {
    fetch(
      'https://api.akapelasiantar.com/newapi/pelanggannik/?idp=' +
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
          setIdserver(json.id);
          // idpelanggan = searchText;
          // setSearchText('');
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
            <Text style={{width: 130}}>ID Pelanggan </Text>
            {dataServer && dataServer.idpelanggan !== null ? (
              <Text>: {dataServer.idpelanggan}</Text>
            ) : (
              <Text>: </Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 130}}>Nama Pelanggan </Text>
            {dataServer && dataServer.namapelanggan !== null ? (
              <Text>: {dataServer.namapelanggan}</Text>
            ) : (
              <Text>: </Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 130}}>Alamat </Text>
            {dataServer && dataServer.alamat !== null ? (
              <Text>: {dataServer.alamat}</Text>
            ) : (
              <Text>: </Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 130}}>ULP </Text>
            {dataServer && dataServer.kodeulp !== null ? (
              <Text>: {dataServer.kodeulp}</Text>
            ) : (
              <Text>: </Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 130}}>Tarif/Daya </Text>
            {dataServer && dataServer.rptag !== null ? (
              <Text>
                : {dataServer.tarif}/{dataServer.daya}
              </Text>
            ) : (
              <Text>:</Text>
            )}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 130}}>Petugas </Text>
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
        <View style={{marginBottom: 5}}>
          <TextInput
            value={nik}
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
            value={nama}
            placeholder="Nama  (Optional)"
            onChangeText={text => setNama(text)}
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
            value={nohp}
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
          <Text>Status: {statusnik}</Text>
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
        {statusnik && (
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
            <Text>Keterangan: {keterangannik}</Text>
            <SelectDropdown
              data={data2[statusnik]}
              onSelect={handleOnSelect2}
              dropdownStyle={{width: 330}}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
          </View>
        )}

        <View style={{marginBottom: 5}}>
          <TextInput
            value={npwp}
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
                <Text style={{color: 'white', fontWeight: 'bold'}}>Simpan</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Nik;
