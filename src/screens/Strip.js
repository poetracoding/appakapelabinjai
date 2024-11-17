import React, {useState, useContext, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  Button,
  Linking,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import HeaderBackHome from './HeaderBackHome';
import {GlobalContext} from './GlobalContext';

const Strip = ({navigation}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const {usernameGlobal} = useContext(GlobalContext);
  const [dataServer, setDataServer] = useState([]);
  const [dataLink, setDataLink] = useState([]);
  const [errorFromAPI1, setErrorFromAPI1] = useState(null);

  useEffect(() => {
    ambilDataServer();
  }, []);

  function ambilDataServer() {
    fetch('https://api.binjaiexcellent.com/newapi/linkstrip')
      .then(response => response.json())
      .then(json => {
        setDataLink(json);
        // console.log(json)
      })
      .catch(error => {
        console.error(error);
      });
  }

  const fetchDataFromAPI = async (apiEndpoint, setData, setError) => {
    try {
      const response = await fetch(
        `${apiEndpoint}?idp=${searchTerm}&user=${usernameGlobal}`,
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError(`Data dari ${apiEndpoint} tidak ditemukan`);
        } else {
          console.error(`Error dari ${apiEndpoint}:`, response.status);
        }
      } else {
        const data = await response.json();
        // console.log(`Data hasil pencarian dari ${apiEndpoint}:`, data);
        setData(data);
        setDataServer(data);
        console.log(dataServer);
        setError(null);
      }
    } catch (error) {
      console.error(`Error dari ${apiEndpoint}:`, error.message);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      setErrorFromAPI1(null);
      setDataServer([]);
      fetchDataFromAPI(
        'https://api.binjaiexcellent.com/newapi/strip',
        setDataServer,
        setErrorFromAPI1,
      );
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <HeaderBackHome />
      </TouchableOpacity>

      <View style={{marginHorizontal: 5, marginTop: 10, marginBottom: 5}}>
        <Button
          title="Buka Aplikasi"
          onPress={() => {
            Linking.openURL(dataLink.link);
          }}
        />
      </View>

      <View
        style={{
          marginTop: 10,
          marginHorizontal: 20,
        }}>
        <View style={{marginBottom: 10, flexDirection: 'row'}}>
          <TextInput
            keyboardType="numeric"
            value={searchTerm}
            onChangeText={text => setSearchTerm(text)}
            placeholder="ID Pelanggan"
            style={{
              borderColor: 'gray',
              borderWidth: 1,
              height: 30,
              width: 280,
              paddingVertical: 0,
              paddingHorizontal: 10,
              borderRadius: 5,
              color: 'black',
            }}
          />
          <TouchableOpacity onPress={handleSearch}>
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
      </View>

      <View
        style={{
          marginHorizontal: 5,
          marginTop: 10,
          marginBottom: 50,
          height: '100%',
        }}>
        {dataServer.length > 0 && (
          <FlatList
            style={{flex: 1}}
            data={dataServer}
            renderItem={({item}) => (
              <View
                style={{
                  backgroundColor: '#D5D5D5',
                  padding: 5,
                  marginHorizontal: 5,
                  marginVertical: 5,
                  borderRadius: 5,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: 120}}>ID Pelanggan</Text>
                  <Text>: {item.idpelanggan}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: 120}}>Nama Pelanggan</Text>
                  <Text>: {item.namapelanggan}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: 120}}>Alamat</Text>
                  <Text>: {item.alamat}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: 120}}>Lokasi</Text>
                  <Text>:</Text>
                  <Button
                    title="Lokasi"
                    onPress={() => {
                      // Linking.openURL(
                      //   `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`,
                      // );
                      Linking.openURL(
                        `https://www.google.com/maps/search/?api=1&query=${item.lat},${item.lng}`,
                      );
                    }}
                  />
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default Strip;
