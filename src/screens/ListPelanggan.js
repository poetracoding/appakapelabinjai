import React from 'react';
import {Text, View} from 'react-native';

const ListPelanggan = () => {
  return (
    <View
      style={{
        backgroundColor: '#D5D5D5',
        padding: 5,
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 5,
      }}>
      <Text>ID Pelanngan</Text>
      <Text>Nama Pelanggan</Text>
      <Text>Alamat</Text>
      <Text>Rp Tag</Text>
    </View>
  );
};
export default ListPelanggan;
