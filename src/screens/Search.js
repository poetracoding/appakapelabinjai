import React, {useState, useContext} from 'react';
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

const Search = ({navigation}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const {usernameGlobal} = useContext(GlobalContext);
  const [dataServer, setDataServer] = useState([]);
  const [dataServer2, setDataServer2] = useState([]);
  const [errorFromAPI1, setErrorFromAPI1] = useState(null);
  const [errorFromAPI2, setErrorFromAPI2] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState('');

  const handlePress = data => {
    const newImageUrl = `https://akapelasiantar.com/apiakapela/upload/${data}`;
    setModalData(newImageUrl);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

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
        console.log(`Data hasil pencarian dari ${apiEndpoint}:`, data);
        setData(data);
        setError(null);
      }
    } catch (error) {
      console.error(`Error dari ${apiEndpoint}:`, error.message);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      setErrorFromAPI1(null);
      setErrorFromAPI2(null);

      setDataServer([]);
      setDataServer2([]);

      fetchDataFromAPI(
        'https://api.binjaiexcellent.com/newapi/caripelanggan',
        setDataServer,
        setErrorFromAPI1,
      );
      fetchDataFromAPI(
        'https://api.binjaiexcellent.com/newapi/caripelangganacmt',
        setDataServer2,
        setErrorFromAPI2,
      );
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
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
            <Image
              source={{uri: modalData}}
              style={{
                height: 500,
                borderRadius: 5,
                padding: 10,
              }}
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <HeaderBackHome />
      </TouchableOpacity>

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
        {dataServer2.idpelangganacmt > 0 && (
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
              <Text>: {dataServer2.idpelangganacmt}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{width: 120}}>Nama Pelanggan</Text>
              <Text>: {dataServer2.namapelangganacmt}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{width: 120}}>Alamat</Text>
              <Text>: {dataServer2.alamatacmt}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{width: 120}}>Data Update</Text>
              <Text>: {dataServer2.tglbacaacmt}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{width: 120}}>Jenis Tagging</Text>
              <Text>: {dataServer2.ketacmt}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{width: 120}}>Lokasi</Text>
              <Text>:</Text>
              <Button
                title="Lokasi"
                onPress={() => {
                  Linking.openURL(
                    `https://www.google.com/maps/search/?api=1&query=${dataServer2.lat},${dataServer2.lng}`,
                  );
                }}
              />
            </View>
          </View>
        )}

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
                  <Text style={{width: 120}}>Rp Tagihan</Text>
                  <Text>: Rp. {item.rptag},-</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: 120}}>Bulan</Text>
                  <Text>: {item.blth}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: 120}}>Jenis Tagging</Text>
                  <Text>: {item.ket}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: 120}}>User/Pelaksana</Text>
                  <Text>
                    : {item.petugas} / {item.tglupdate}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: 120}}>Foto</Text>
                  <Text>:</Text>
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: 'green',
                      marginEnd: 5,
                      marginBottom: 2,
                      borderRadius: 5,
                    }}>
                    <TouchableOpacity onPress={() => handlePress(item.foto)}>
                      <Text style={{color: 'white'}}>
                        <Icon size={15} name="image" /> Foto 1
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      padding: 5,
                      backgroundColor: 'green',
                      marginEnd: 5,
                      marginBottom: 2,
                      borderRadius: 5,
                    }}>
                    <TouchableOpacity onPress={() => handlePress(item.foto2)}>
                      <Text style={{color: 'white'}}>
                        <Icon size={15} name="image" /> Foto 2
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={{width: 120}}>Lokasi</Text>
                  <Text>:</Text>
                  <Button
                    title="Lokasi"
                    onPress={() => {
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

export default Search;
