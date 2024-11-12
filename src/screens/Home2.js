import React, {useEffect, useState, useContext} from 'react';
import {Text, View, TouchableOpacity, Button, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalContext} from './GlobalContext';

const Home2 = ({navigation}) => {
  const {
    usernameGlobal,
    namaGlobal,
    jabatanGlobal,
    unitGlobal,
    setUsernameGlobal,
  } = useContext(GlobalContext);

  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');

  const logout = async () => {
    await setUsernameGlobal('');
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  useEffect(() => {
    setUsername(usernameGlobal);
  }, [usernameGlobal]);

  return (
    <View>
      <View
        style={{
          backgroundColor: '#18DDE2',
          paddingTop: 5,
          paddingEnd: 5,
          alignItems: 'flex-end',
        }}>
        <TouchableOpacity onPress={logout}>
          <Text style={{fontWeight: 'bold', color: 'red'}}>
            {' '}
            <Icon size={15} name="sign-out-alt" /> Keluar
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 248,
          backgroundColor: '#18DDE2',
          alignItems: 'center',
          paddingTop: 70,
          borderBottomEndRadius: 54,
          borderBottomStartRadius: 54,
        }}>
        <View
          style={{
            width: 120,
            height: 120,
            backgroundColor: '#FFFFFF',
            borderRadius: 60,
            borderColor: '#707070',
            borderWidth: 5,
          }}
        />
        <Text
          style={{
            paddingTop: 10,
            fontWeight: 'bold',
            fontSize: 15,
            color: '#707070',
          }}>
          My Profile: {username}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingTop: 24,
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity>
          <View
            style={{
              backgroundColor: '#277DBF',
              alignItems: 'center',
              justifyContent: 'center',
              height: 64,
              width: 174,
              borderRadius: 15,
            }}>
            <Text style={{marginBottom: -8, color: '#FFFFFF'}}>Target</Text>
            <Text style={{fontSize: 35, fontWeight: 'bold', color: '#FFFFFF'}}>
              -
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View
            style={{
              backgroundColor: '#24BB8E',
              alignItems: 'center',
              justifyContent: 'center',
              height: 64,
              width: 174,
              borderRadius: 15,
            }}>
            <Text style={{marginBottom: -8, color: '#FFFFFF'}}>Realisasi</Text>
            <Text style={{fontSize: 35, fontWeight: 'bold', color: '#FFFFFF'}}>
              -
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{justifyContent: 'space-evenly', flexDirection: 'row'}}>
        <View style={{width: 358}}>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 20,
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('Tag')}>
              <View
                style={{
                  width: 114,
                  height: 84,
                  borderRadius: 25,
                  backgroundColor: '#18DDE2',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 15, color: '#FFFFFF'}}>
                  <Icon size={15} name="map-marker-alt" /> Tag
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <View
                style={{
                  width: 114,
                  height: 84,
                  borderRadius: 25,
                  backgroundColor: '#18DDE2',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 15, color: '#FFFFFF'}}>
                  <Icon size={15} name="history" /> History
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <View
                style={{
                  width: 114,
                  height: 84,
                  borderRadius: 25,
                  backgroundColor: '#18DDE2',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 15, color: '#FFFFFF'}}>
                  <Icon size={15} name="searchengin" /> Search
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 8,
              justifyContent: 'space-evenly',
            }}>
            <TouchableOpacity onPress={() => navigation.navigate('Invoice')}>
              <View
                style={{
                  width: 114,
                  height: 84,
                  borderRadius: 25,
                  backgroundColor: '#18DDE2',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 15, color: '#FFFFFF'}}>
                  <Icon size={15} name="file-invoice" /> Invoice
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Lokasi')}>
              <View
                style={{
                  width: 114,
                  height: 84,
                  borderRadius: 25,
                  backgroundColor: '#18DDE2',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 15, color: '#FFFFFF'}}>
                  <Icon size={15} name="file-download" /> Lokasi
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <View
                style={{
                  width: 114,
                  height: 84,
                  borderRadius: 25,
                  backgroundColor: '#18DDE2',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{fontWeight: 'bold', fontSize: 15, color: '#FFFFFF'}}>
                  <Icon size={15} name="user" /> Profile
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <Text style={{paddingLeft: 5, paddingTop: 20, fontSize: 8}}>
          Support By : Poetra Coding
        </Text>
      </View>
    </View>
  );
};
export default Home2;
