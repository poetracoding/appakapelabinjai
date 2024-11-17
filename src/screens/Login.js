import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GlobalContext} from './GlobalContext';
import LinearGradient from 'react-native-linear-gradient';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {setProfileData} = useContext(GlobalContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true); // state untuk kontrol visibility password

  const onSubmit = async () => {
    try {
      const response = await fetch(
        `https://api.binjaiexcellent.com/newapi/usercek?username=${username}&password=${password}`,
      );
      const json = await response.json();

      if (json.status === false) {
        Alert.alert('Warning', json.message);
      } else {
        setProfileData(username, json.nama, json.jabatan, json.kodeunit);
        await AsyncStorage.setItem('token', username); // Simpan token atau username di AsyncStorage

        // Reset navigasi dan arahkan ke halaman Home
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
      }
    } catch (error) {
      Alert.alert('Warning', 'Silahkan coba lagi!');
      console.log(error);
    }
  };

  const tokenLogin = async () => {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      // Jika sudah login, langsung reset navigasi ke halaman Home
      navigation.reset({
        index: 0,
        routes: [{name: 'Home'}],
      });
    }
  };

  useEffect(() => {
    tokenLogin(); // Cek status login saat pertama kali komponen dimuat
  }, []);

  const handlePress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Fungsi untuk toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordSecure(!isPasswordSecure);
  };

  return (
    <LinearGradient
      colors={['#125B9A', '#0B8494']}
      style={{flex: 1, justifyContent: 'flex-start'}}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeModal}>
        <View>
          <TouchableOpacity onPress={closeModal}>
            <View
              style={{
                backgroundColor: 'red',
                padding: 5,
                marginTop: 10,
                marginHorizontal: 20,
                alignItems: 'center',
                borderRadius: 5,
              }}>
              <Text style={{color: 'white'}}>
                <Icon size={15} name="times-circle" /> Close
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{marginHorizontal: 20, marginVertical: 10}}>
            <Text>Silahkan hubungi Admin UP3 Pematang Siantar!</Text>
          </View>
        </View>
      </Modal>

      <View style={{padding: 20}}>
        <View style={{alignItems: 'center', paddingTop: 40}}>
          <Image
            source={{
              uri: 'https://binjaiexcellent.com/img/logo_text_white.png',
            }}
            style={{
              height: 120,
              width: 120,
              padding: 10,
            }}
          />
        </View>
        <Text style={{fontSize: 30, fontWeight: 'bold'}}>Login</Text>
        <Text>Silahkan login aplikasi Akapela</Text>

        <TextInput
          style={{
            backgroundColor: 'white',
            borderWidth: 1,
            marginTop: 5,
            marginBottom: 10,
            paddingLeft: 10,
            paddingVertical: 5,
            borderRadius: 5,
            alignItems: 'center',
          }}
          placeholder="Username"
          onChangeText={value => setUsername(value)}
        />

        <View style={{position: 'relative'}}>
          <TextInput
            style={{
              backgroundColor: 'white',
              borderWidth: 1,
              marginTop: 5,
              marginBottom: 10,
              paddingLeft: 10,
              paddingVertical: 5,
              borderRadius: 5,
              alignItems: 'center',
            }}
            placeholder="Password"
            secureTextEntry={isPasswordSecure} // kontrol visibilitas password
            onChangeText={value => setPassword(value)}
          />
          {/* Ikon untuk toggle password visibility */}
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              padding: 5,
            }}>
            <Icon
              name={isPasswordSecure ? 'eye-slash' : 'eye'}
              size={20}
              color="#000"
            />
          </TouchableOpacity>
        </View>

        <Button onPress={onSubmit} title="Login" />
        {/* <TouchableOpacity onPress={handlePress}>
          <Text style={{ paddingTop: 10, color: 'red' }}>Lupa Password?</Text>
        </TouchableOpacity> */}
      </View>
    </LinearGradient>
  );
};

export default Login;
