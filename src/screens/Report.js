import React from 'react';
import {Text, View, TouchableOpacity, ScrollView} from 'react-native';
import HeaderBackHome from './HeaderBackHome';
// import ListPelanggan from './ListPelanggan';

const Report = ({navigation}) => {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <HeaderBackHome />
      </TouchableOpacity>
      <Text>Report</Text>
    </View>
  );
};
export default Report;
