import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GlobalContext = createContext();

export const GlobalProvider = ({children}) => {
  const [usernameGlobal, setUsernameGlobal] = useState('');
  const [namaGlobal, setNamaGlobal] = useState('');
  const [jabatanGlobal, setJabatanGlobal] = useState('');
  const [unitGlobal, setUnitGlobal] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        if (storedUsername !== null) {
          setUsernameGlobal(storedUsername);
        }
        const storedNama = await AsyncStorage.getItem('nama');
        if (storedNama !== null) {
          setNamaGlobal(storedNama);
        }
        const storedJabatan = await AsyncStorage.getItem('jabatan');
        if (storedJabatan !== null) {
          setJabatanGlobal(storedJabatan);
        }
        const storedUnit = await AsyncStorage.getItem('unit');
        if (storedUnit !== null) {
          setUnitGlobal(storedUnit);
        }
      } catch (error) {
        console.log('Error fetching data from AsyncStorage:', error);
      }
    };

    fetchData();
  }, []);

  const setProfileData = async (username, nama, jabatan, unit) => {
    try {
      await AsyncStorage.setItem('username', username);
      setUsernameGlobal(username);
      await AsyncStorage.setItem('nama', nama);
      setNamaGlobal(nama);
      await AsyncStorage.setItem('jabatan', jabatan);
      setJabatanGlobal(jabatan);
      await AsyncStorage.setItem('unit', unit);
      setUnitGlobal(unit);
    } catch (error) {
      console.log('Error saving data to AsyncStorage:', error);
    }
  };

  const contextValue = {
    usernameGlobal,
    namaGlobal,
    jabatanGlobal,
    unitGlobal,
    setUsernameGlobal,
    setProfileData,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};
