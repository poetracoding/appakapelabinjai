import React, {useEffect, useState, useContext} from 'react';
import {Text, View, TouchableOpacity, ScrollView, FlatList} from 'react-native';
import HeaderBackHome from './HeaderBackHome';
import {GlobalContext} from './GlobalContext';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/FontAwesome5';
// import ListPelanggan from './ListPelanggan';

const History = ({navigation}) => {
  const [dataServer, setDataServer] = useState([]);
  const {
    usernameGlobal,
    namaGlobal,
    jabatanGlobal,
    unitGlobal,
    setUsernameGlobal,
  } = useContext(GlobalContext);

  useEffect(() => {
    ambilDataServer();
  }, []);

  const [copiedText, setCopiedText] = useState('');

  const copyToClipboard = data => {
    const textToCopy = data;
    Clipboard.setString(textToCopy);
    setCopiedText(textToCopy);
  };

  function ambilDataServer() {
    fetch(
      'https://api.binjaiexcellent.com/newapi/history/?user=' + usernameGlobal,
    )
      .then(response => response.json())
      .then(json => {
        setDataServer(json);
        // console.log(json)
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <HeaderBackHome />
      </TouchableOpacity>
      <View style={{marginHorizontal: 5, marginTop: 10, marginBottom: 50}}>
        <FlatList
          data={dataServer}
          renderItem={({item, index}) => (
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
              <TouchableOpacity
                onPress={() => copyToClipboard(item.idpelanggan)}>
                <View
                  style={{
                    backgroundColor: 'grey',
                    padding: 3,
                    width: '40%',
                    borderRadius: 5,
                  }}>
                  <Text>
                    {' '}
                    <Icon size={15} name="copy" /> Copy ID Pelanggan
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};
export default History;
