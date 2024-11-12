import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';
import {hsdLogo} from './dummy-logo';

const SamplePrint = props => {
  // const idpel={props.idpel}
  const tgl = new Date().getDate();
  const bln = new Date().getMonth() + 1; //To get the Current Month
  const thn = new Date().getFullYear(); //To get the Current Year
  return (
    <View>
      <View style={styles.btn}>
        <Button
          title="Print Invoce"
          onPress={async () => {
            let columnWidths = [8, 12, 12];
            try {
              // await BluetoothEscposPrinter.printText('Uji Coba Print', {});
              await BluetoothEscposPrinter.printPic(hsdLogo, {width: 150});
              await BluetoothEscposPrinter.printColumn(
                [32],
                [BluetoothEscposPrinter.ALIGN.LEFT],
                ['PLN UP3 Pematang Siantar'],
                {},
              );
              await BluetoothEscposPrinter.printText(props.ulp + '\r\n', {});
              await BluetoothEscposPrinter.printText(
                '================================',
                {},
              );
              await BluetoothEscposPrinter.printText(
                '   INVOICE TAGIHAN LISTRIK \r\n \r\n',
                {},
              );
              await BluetoothEscposPrinter.printText(
                'Nama: ' +
                  props.nama +
                  '\r\nIDPEL: ' +
                  props.idpel +
                  '\r\nAlamat: ' +
                  props.alamat +
                  '\r\nTarif/Daya: ' +
                  props.tarif +
                  '/' +
                  props.daya +
                  '\r\nBLN/TH REK:' +
                  props.thnbln +
                  '\r\nStand Meter:' +
                  props.standmeter +
                  '\r\nRPTAG: Rp.' +
                  props.rptag +
                  '\r\n\r\nDisampaikan kepada saudara,\r\nuntuk menghindari pemutusan \r\naliran listrik agar Segera laku-\r\nkan pembayaran  sebelum  tanggal\r\n20 setiap bulannya.  Penggantian\r\nAlat Pengukur dan Pembatas (APP)\r\nPascabayar Milik PLN menjadi APP\r\nPrabayar tidak dipungut biaya.\r\nTagihan  belum  termasuk  biaya\r\nadmin Bank. Abaikan jika tagihan\r\nsudah Lunas.\r\n\r\n' +
                  props.alamatinvoice +
                  ',' +
                  tgl +
                  '-' +
                  bln +
                  '-' +
                  thn +
                  '\r\n',
                {},
              );

              await BluetoothEscposPrinter.printQRCode(
                props.mulp +
                  ', Manager ' +
                  props.ulp +
                  ',' +
                  props.idpel +
                  ', ' +
                  'Rp. ' +
                  props.rptag +
                  ', TahunBulan :' +
                  props.thnbln,
                250,
                BluetoothEscposPrinter.ERROR_CORRECTION.L,
              );
              await BluetoothEscposPrinter.printText('\r\n\r\n\r\n', {});
            } catch (e) {
              alert(e.message || 'ERROR');
            }
          }}
        />
      </View>
    </View>
  );
};

export default SamplePrint;

const styles = StyleSheet.create({
  btn: {
    marginBottom: 8,
  },
});
