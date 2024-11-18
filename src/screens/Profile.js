import React, {useEffect, useState, useContext} from 'react';
import {Text, View, TouchableOpacity, TextInput} from 'react-native';
import HeaderBackHome from './HeaderBackHome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalContext} from './GlobalContext';

const Profile = ({navigation}) => {
  const {
    usernameGlobal,
    namaGlobal,
    jabatanGlobal,
    unitGlobal,
    setUsernameGlobal,
  } = useContext(GlobalContext);

  const [username, setUsername] = useState(usernameGlobal);
  useEffect(() => {
    setUsername(usernameGlobal);
  }, [usernameGlobal]);

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <HeaderBackHome />
      </TouchableOpacity>

      <View style={{padding: 10}}>
        <View
          style={{
            height: 100,
            width: 100,
            backgroundColor: '#125B9A',
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: '#FFBE98',
            borderWidth: 1,
          }}>
          <Text style={{color: '#FFBE98'}}>
            <Icon size={60} name="user" />
          </Text>
        </View>
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            marginTop: 10,
            backgroundColor: '#125B9A',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: '38%'}}>Username</Text>
            <Text>: {usernameGlobal}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: '38%'}}>Nama</Text>
            <Text>: {namaGlobal}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: '38%'}}>Jabatan</Text>
            <Text>: {jabatanGlobal}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: '38%'}}>Unit</Text>
            <Text>: {unitGlobal}</Text>
          </View>
        </View>
        {/* <Text style={{marginTop: 40}}>Update Password </Text>

        <View
          style={{
            padding: 10,
            borderRadius: 10,
            marginTop: 5,
            backgroundColor: '#125B9A',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: '38%'}}>Password Lama</Text>
            <TextInput
              style={{
                // borderWidth: 1,
                height: 30,
                paddingHorizontal: 5,
                paddingVertical: 0,
                width: '60%',
                backgroundColor: 'white',
                borderRadius: 5,
              }}
              secureTextEntry
              //   onChangeText={value => setPassword(value)}
            />
          </View>
          <View style={{flexDirection: 'row', paddingTop: 5}}>
            <Text style={{width: '38%'}}>Password Baru</Text>
            <TextInput
              style={{
                // borderWidth: 1,
                height: 30,
                paddingHorizontal: 5,
                paddingVertical: 0,
                width: '60%',
                backgroundColor: 'white',
                borderRadius: 5,
              }}
              secureTextEntry
              //   onChangeText={value => setPassword(value)}
            />
          </View>
          <View style={{flexDirection: 'row', paddingTop: 5}}>
            <Text style={{width: '38%'}}>Ulangi Password</Text>
            <TextInput
              style={{
                // borderWidth: 1,
                height: 30,
                paddingHorizontal: 5,
                paddingVertical: 0,
                width: '60%',
                backgroundColor: 'white',
                borderRadius: 5,
              }}
              secureTextEntry
              //   onChangeText={value => setPassword(value)}
            />
          </View>
        </View>

        <TouchableOpacity style={{paddingTop: 10}}>
          <View
            style={{
              backgroundColor: '#24BB8E',
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 15}}>
              <Icon size={15} name="user-edit" /> Update Password
            </Text>
          </View>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};
export default Profile;
