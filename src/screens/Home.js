import React, {useEffect, useState, useContext} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalContext} from './GlobalContext';
// import messaging from '@react-native-firebase/messaging';

// import DeviceInfo from 'react-native-device-info';

const Home = ({navigation}) => {
  const {
    usernameGlobal,
    namaGlobal,
    jabatanGlobal,
    unitGlobal,
    setUsernameGlobal,
  } = useContext(GlobalContext);

  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  // const uniqueId = DeviceInfo.getUniqueId();
  // console.log('Unique ID:', uniqueId);

  const logout = async () => {
    await setUsernameGlobal('');
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  // Mendapatkan token perangkat
  // const getDeviceToken = async () => {
  //   try {
  //     const token = await messaging().getToken();
  //     console.log('Device Token:', token);
  //   } catch (error) {
  //     console.error('Error getting device token:', error);
  //   }
  // };

  useEffect(() => {
    setUsername(usernameGlobal);
    // getDeviceToken();
  }, [usernameGlobal]);
  //onPress={logout}
  return (
    <View style={[styles.containerUtama]}>
      <View style={[styles.header]}>
        <Text style={[styles.fontJudul]}>AKAPELA</Text>
        <Text style={[styles.fontsubJudul]}>UP3 PEMATANG SIANTAR</Text>
      </View>
      <View style={[styles.IsiAtas]}></View>
      <View style={[styles.Isi]}>
        <Text>Selamat datang, {usernameGlobal}</Text>
        <ScrollView contentContainerStyle={styles.containerIsi}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.col}
              onPress={() => navigation.navigate('Tag')}>
              <View style={[styles.btnMenu]}>
                <Icon
                  style={{color: '#8bd2cb', fontSize: 40, fontWeight: 'bold'}}
                  name="map-marker-alt"
                />
              </View>
              <Text>Tag Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.col}
              onPress={() => navigation.navigate('Lpb')}>
              <View style={[styles.btnMenu]}>
                <Icon
                  style={{color: '#8bd2cb', fontSize: 40, fontWeight: 'bold'}}
                  name="map-marked-alt"
                />
              </View>
              <Text>Tag LPB</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.col}
              onPress={() => navigation.navigate('Nik')}>
              <View style={[styles.btnMenu]}>
                <Icon
                  style={{color: '#8bd2cb', fontSize: 40, fontWeight: 'bold'}}
                  name="map-marker"
                />
              </View>
              <Text>Tag NIK</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.col}
              onPress={() => navigation.navigate('Invoice')}>
              <View style={[styles.btnMenu]}>
                <Icon
                  style={{color: '#8bd2cb', fontSize: 40, fontWeight: 'bold'}}
                  name="print"
                />
              </View>
              <Text>Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.col}
              onPress={() => navigation.navigate('History')}>
              <View style={[styles.btnMenu]}>
                <Icon
                  style={{color: '#8bd2cb', fontSize: 40, fontWeight: 'bold'}}
                  name="history"
                />
              </View>
              <Text>History</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.col}
              onPress={() => navigation.navigate('Search')}>
              <View style={[styles.btnMenu]}>
                <Icon
                  style={{color: '#8bd2cb', fontSize: 40, fontWeight: 'bold'}}
                  name="search"
                />
              </View>
              <Text>Cari</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.col}
              onPress={() => navigation.navigate('Lapangan')}>
              <View style={[styles.btnMenu]}>
                <Icon
                  style={{color: '#8bd2cb', fontSize: 40, fontWeight: 'bold'}}
                  name="street-view"
                />
              </View>
              <Text>Lapangan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.col}
              onPress={() => navigation.navigate('Profile')}>
              <View style={[styles.btnMenu]}>
                <Icon
                  style={{color: '#8bd2cb', fontSize: 40, fontWeight: 'bold'}}
                  name="user-alt"
                />
              </View>
              <Text>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.col}
              onPress={() => navigation.navigate('Strip')}>
              <View style={[styles.btnMenu]}>
                <Text>
                  <Icon
                    style={{color: '#8bd2cb', fontSize: 40, fontWeight: 'bold'}}
                    name="bolt"
                  />
                </Text>
              </View>
              <Text>Shunt Trip</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity style={styles.col} onPress={logout}>
              <View style={[styles.btnMenu]}>
                <Text>
                  <Icon
                    style={{color: '#8bd2cb', fontSize: 40, fontWeight: 'bold'}}
                    name="sign-out-alt"
                  />
                </Text>
              </View>
              <Text>Keluar</Text>
            </TouchableOpacity>
            <View style={styles.col}></View>
            <View style={styles.col}></View>
          </View>
        </ScrollView>
        <View style={{alignItems: 'center', paddingBottom: 15}}>
          <Text>
            <Icon name="copyright" /> poetra coding
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerUtama: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#8bd2cb',
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#8bd2cb',
    paddingVertical: 10,
  },
  fontJudul: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  fontsubJudul: {
    fontSize: 10,
    color: 'white',
  },
  IsiAtas: {
    backgroundColor: 'white',
    borderTopEndRadius: 50,
    borderTopStartRadius: 50,
    height: 30,
  },
  Isi: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    height: '90%',
  },

  containerIsi: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 8,
  },
  col: {
    flex: 1,
    padding: 8,
    // marginRight: 8,
    alignItems: 'center',
    // borderWidth: 1,
  },
  btnMenu: {
    backgroundColor: '#e0e0e0',
    padding: 25,
    width: '100%',
    alignItems: 'center',
    // margin: 5,
    borderRadius: 10,
    shadowColor: '#e0e0e1',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
export default Home;
