import React from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import HeaderBackHome from './HeaderBackHome';
// import ListPelanggan from './ListPelanggan';

const Print = ({navigation}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <HeaderBackHome />
      </TouchableOpacity>
      <Text>Print</Text>
    </View>
  );
};
export default Print;
