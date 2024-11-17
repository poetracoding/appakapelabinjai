import React, {useState, useEffect, useCallback, useContext} from 'react';
import {
  ActivityIndicator,
  DeviceEventEmitter,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  View,
  Button,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {BluetoothManager} from 'react-native-bluetooth-escpos-printer';
import {PERMISSIONS, requestMultiple, RESULTS} from 'react-native-permissions';
import ItemList from '../../ItemList';
import SamplePrint from '../../SamplePrint';
import {styles} from '../../styles';

import HeaderBackHome from './HeaderBackHome';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {GlobalContext} from './GlobalContext';

const Invoice = ({navigation}) => {
  const [dataServer, setDataServer] = useState([]);
  const [pairedDevices, setPairedDevices] = useState([]);
  const [foundDs, setFoundDs] = useState([]);
  const [bleOpend, setBleOpend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [boundAddress, setBoundAddress] = useState('');

  const [text, onChangeText] = React.useState('Useless Text');
  const [number, onChangeNumber] = React.useState('');
  const [searchText, setSearchText] = useState('');

  const [mounted, setMounted] = useState(true);
  const {
    usernameGlobal,
    namaGlobal,
    jabatanGlobal,
    unitGlobal,
    setUsernameGlobal,
  } = useContext(GlobalContext);

  // Data

  // useEffect(() => {
  //   const abortController = new AbortController();

  //   fetch('https://api.binjaiexcellent.com/api/pelanggan/idpelanggan/2', {
  //     signal: abortController.signal,
  //   })
  //     .then(response => response.json())
  //     .then(json => {
  //       if (mounted) {
  //         setDataServer(json);
  //         console.log(json);
  //       }
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });

  //   return () => {
  //     abortController.abort();
  //   };
  // }, []);

  // const handleSearch = () => {
  //   // Logika atau tindakan yang ingin Anda lakukan saat tombol "Cari" ditekan
  //   console.log('Tombol "Cari" ditekan');
  // };

  const cariidpel = () => {
    fetch(
      'https://api.binjaiexcellent.com/newapi/pelangganinv/?idp=' +
        searchText +
        '&user=' +
        usernameGlobal,
    )
      .then(response => response.json())
      .then(json => {
        setDataServer(json);
        console.log(json);
        setSearchText('');
      })
      .catch(error => {
        Alert.alert('Informasi', `Data ${searchText} tidak ditemukan.`);
      });
  };

  // ===============================

  useEffect(() => {
    BluetoothManager.isBluetoothEnabled().then(
      enabled => {
        if (mounted) {
          setBleOpend(Boolean(enabled));
          setLoading(false);
        }
      },
      err => {
        err;
      },
    );

    if (Platform.OS === 'ios') {
      let bluetoothManagerEmitter = new NativeEventEmitter(BluetoothManager);
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        rsp => {
          deviceAlreadPaired(rsp);
        },
      );
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        rsp => {
          deviceFoundEvent(rsp);
        },
      );
      bluetoothManagerEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        () => {
          setName('');
          setBoundAddress('');
        },
      );
    } else if (Platform.OS === 'android') {
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
        rsp => {
          deviceAlreadPaired(rsp);
        },
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_DEVICE_FOUND,
        rsp => {
          deviceFoundEvent(rsp);
        },
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_CONNECTION_LOST,
        () => {
          setName('');
          setBoundAddress('');
        },
      );
      DeviceEventEmitter.addListener(
        BluetoothManager.EVENT_BLUETOOTH_NOT_SUPPORT,
        () => {
          ToastAndroid.show(
            'Device Not Support Bluetooth !',
            ToastAndroid.LONG,
          );
        },
      );
    }
    if (pairedDevices.length < 1) {
      scan();
    }
    return () => {
      setMounted(false); // Set status mounting komponen menjadi false saat komponen dilepas
    };
  }, [boundAddress, deviceAlreadPaired, deviceFoundEvent, pairedDevices, scan]);

  const deviceAlreadPaired = useCallback(
    rsp => {
      var ds = null;
      if (typeof rsp.devices === 'object') {
        ds = rsp.devices;
      } else {
        try {
          ds = JSON.parse(rsp.devices);
        } catch (e) {}
      }
      if (ds && ds.length) {
        let pared = pairedDevices;
        if (pared.length < 1) {
          pared = pared.concat(ds || []);
        }
        setPairedDevices(pared);
      }
    },
    [pairedDevices],
  );

  const deviceFoundEvent = useCallback(
    rsp => {
      var r = null;
      try {
        if (typeof rsp.device === 'object') {
          r = rsp.device;
        } else {
          r = JSON.parse(rsp.device);
        }
      } catch (e) {
        // ignore error
      }

      if (r) {
        let found = foundDs || [];
        if (found.findIndex) {
          let duplicated = found.findIndex(function (x) {
            return x.address == r.address;
          });
          if (duplicated == -1) {
            found.push(r);
            setFoundDs(found);
          }
        }
      }
    },
    [foundDs],
  );

  const connect = row => {
    setLoading(true);
    BluetoothManager.connect(row.address).then(
      s => {
        setLoading(false);
        setBoundAddress(row.address);
        setName(row.name || 'UNKNOWN');
      },
      e => {
        setLoading(false);
        alert(e);
      },
    );
  };

  const unPair = address => {
    setLoading(true);
    BluetoothManager.unpaire(address).then(
      s => {
        setLoading(false);
        setBoundAddress('');
        setName('');
      },
      e => {
        setLoading(false);
        alert(e);
      },
    );
  };

  const scanDevices = useCallback(() => {
    setLoading(true);
    BluetoothManager.scanDevices().then(
      s => {
        // const pairedDevices = s.paired;
        var found = s.found;
        try {
          found = JSON.parse(found); //@FIX_it: the parse action too weired..
        } catch (e) {
          //ignore
        }
        var fds = foundDs;
        if (found && found.length) {
          fds = found;
        }
        setFoundDs(fds);
        setLoading(false);
      },
      er => {
        setLoading(false);
        // ignore
      },
    );
  }, [foundDs]);

  const scan = useCallback(() => {
    try {
      async function blueTooth() {
        const permissions = {
          title: 'HSD bluetooth meminta izin untuk mengakses bluetooth',
          message:
            'HSD bluetooth memerlukan akses ke bluetooth untuk proses koneksi ke bluetooth printer',
          buttonNeutral: 'Lain Waktu',
          buttonNegative: 'Tidak',
          buttonPositive: 'Boleh',
        };

        const bluetoothConnectGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          permissions,
        );
        if (bluetoothConnectGranted === PermissionsAndroid.RESULTS.GRANTED) {
          const bluetoothScanGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            permissions,
          );
          if (bluetoothScanGranted === PermissionsAndroid.RESULTS.GRANTED) {
            scanDevices();
          }
        } else {
          // ignore akses ditolak
        }
      }
      blueTooth();
    } catch (err) {
      console.warn(err);
    }
  }, [scanDevices]);

  const scanBluetoothDevice = async () => {
    setLoading(true);
    try {
      const request = await requestMultiple([
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);

      if (
        request['android.permission.ACCESS_FINE_LOCATION'] === RESULTS.GRANTED
      ) {
        scanDevices();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <HeaderBackHome />
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 10, marginHorizontal: 20, marginBottom: 10}}>
        <View style={{marginBottom: 10, flexDirection: 'row'}}>
          <TextInput
            keyboardType="numeric"
            onChangeText={text => setSearchText(text)}
            value={searchText}
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
          <TouchableOpacity onPress={cariidpel}>
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
        <View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 150}}>ID Pelanggan </Text>
            <Text>: {dataServer.idpelanggan}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 150}}>Nama Pelanggan </Text>
            <Text>: {dataServer.namapelanggan}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 150}}>Alamat </Text>
            <Text>: {dataServer.alamat}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 150}}>ULP </Text>
            <Text>: {dataServer.kodeulp}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 150}}>Stand Meter </Text>
            <Text>: {dataServer.standmeter}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 150}}>Tarif/Daya </Text>
            {dataServer && dataServer.rptag !== null ? (
              <Text>
                : {dataServer.tarif}/{dataServer.daya}
              </Text>
            ) : null}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 150}}>Bulan </Text>
            <Text>: {dataServer.blth}</Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 150}}>Rp Tagihan </Text>
            {dataServer && dataServer.rptag !== null ? (
              <Text>: Rp. {dataServer.rptag},-</Text>
            ) : null}
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={{width: 150}}>Petugas </Text>
            <Text>: {dataServer.petugas}</Text>
          </View>
        </View>
      </View>

      <View style={{paddingTop: 5, paddingHorizontal: 20}}>
        <SamplePrint
          idpel={dataServer.idpelanggan}
          nama={dataServer.namapelanggan}
          alamat={dataServer.alamat}
          rptag={dataServer.rptag}
          tarif={dataServer.tarif}
          daya={dataServer.daya}
          thnbln={dataServer.blth}
          standmeter={dataServer.standmeter}
          ulp={dataServer.ulp}
          alamatinvoice={dataServer.alamatinvoice}
        />
        <Button onPress={() => scanBluetoothDevice()} title="Scan Bluetooth" />
        {!bleOpend && (
          <Text style={styles.bluetoothInfo}>
            Mohon aktifkan bluetooth anda
          </Text>
        )}
        <Text style={styles.sectionTitle}>
          Printer yang terhubung ke aplikasi:
        </Text>
        {boundAddress.length > 0 && (
          <ItemList
            label={name}
            value={boundAddress}
            onPress={() => unPair(boundAddress)}
            actionText="Putus"
            color="#E9493F"
          />
        )}
      </View>
      <ScrollView
        style={{
          // flex: 1,
          paddingTop: 40,
          paddingHorizontal: 20,
          height: 200,
        }}>
        <View style={styles.bluetoothStatusContainer}>
          <Text
            style={styles.bluetoothStatus(bleOpend ? '#47BF34' : '#A8A9AA')}>
            Bluetooth {bleOpend ? 'Aktif' : 'Non Aktif'}
          </Text>
        </View>

        {boundAddress.length < 1 && (
          <Text style={styles.printerInfo}>
            Belum ada printer yang terhubung
          </Text>
        )}
        <Text style={styles.sectionTitle}>
          Bluetooth yang terhubung ke HP ini:
        </Text>
        {loading ? <ActivityIndicator animating={true} /> : null}
        <View style={{paddingTop: 10, paddingHorizontal: 10}}>
          {pairedDevices.map((item, index) => {
            return (
              <ItemList
                key={index}
                onPress={() => connect(item)}
                label={item.name}
                value={item.address}
                connected={item.address === boundAddress}
                actionText="Hubungkan"
                color="#00BCD4"
              />
            );
          })}
        </View>
        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
};

export default Invoice;
