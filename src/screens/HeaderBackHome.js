import React from 'react';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const HeaderBackHome = () => {
  return (
    <View
      style={{
        backgroundColor: '#125B9A',
        padding: 10,
        borderBottomEndRadius: 54,
        borderTopEndRadius: 54,
        marginTop: 2,
        marginEnd: 50,
      }}>
      <Text style={{fontWeight: 'bold', color: '#FFFFFF'}}>
        {' '}
        <Icon size={15} name="angle-left" /> Home
      </Text>
    </View>
  );
};
export default HeaderBackHome;
