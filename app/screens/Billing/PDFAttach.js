import {
  Header,
  Icon,
  ListThumbCircleNotif,
  SafeAreaView,
  Text,
} from '@components';
import {BaseColor, BaseStyle, useTheme} from '@config';
// Load sample data
// import {NotificationData} from '@data';
import React, {useState, useEffect} from 'react';
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
// import getUser from '../../selectors/UserSelectors';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'rn-fetch-blob';

const PDFAttach = props => {
  const {navigation, route} = props;
  console.log('route params', route);
  const paramsItem = route.params;
  const {t} = useTranslation();
  const {colors} = useTheme();

  const downloadFile = () => {
    const url = paramsItem.link_url;
    console.log('url', url);
    const android = RNFetchBlob.android;
    let dirs = RNFetchBlob.fs.dirs;
    console.log('dirs', dirs);
    const title = paramsItem.doc_no + '_' + paramsItem.remark + '.pdf';
    RNFetchBlob.config({
      // response data will be saved to this path if it has access right.

      fileCache: true,
      addAndroidDownloads: {
        path:
          dirs.DownloadDir +
          '/downloads/' +
          paramsItem.doc_no +
          '_' +
          paramsItem.remark +
          '.pdf',
        useDownloadManager: true,
        // Show notification when response data transmitted
        notification: true,
        // Title of download notification
        title: title,
        // File description (not notification description)
        description: 'downloading content...',
        mime: 'application/pdf',
        // Make the file scannable  by media scanner
        mediaScannable: true,
      },
    })
      .fetch('GET', url)
      .then(res => {
        // the path should be dirs.DocumentDir + 'path-to-file.anything'
        console.log('The file saved to ', res.path());
        alert('Saved at : ' + res.path());
      });
    // RNFetchBlob.config({
    //   fileCache: true,
    //   addAndroidDownloads: {
    //     path:
    //       RNFetchBlob.fs.dirs.DocumentDir +
    //       // RNFetchBlob.fs.dirs.SDCardDir +
    //       '/downloads/' +
    //       paramsItem.doc_no +
    //       '_' +
    //       paramsItem.remark +
    //       '.pdf',
    //     useDownloadManager: true,
    //     notification: true,
    //     overwrite: true,
    //     description: 'downloading content...',
    //     mime: 'application/pdf',
    //     mediaScannable: true,
    //   },
    // })
    //   .fetch('GET', url)
    //   .then(res => {
    //     console.log('The file saved to ', res.path());
    //     alert('Saved at : ' + res.path());
    //     // android.actionViewIntent(res.path(), 'application/pdf')
    //     // android.actionViewIntent(RNFetchBlob.fs.dirs.SDCardDir +'/Download/laporan.pdf','application/pdf')
    //   });
  };
  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('Attachment Invoice')}
        renderLeft={() => {
          return (
            <Icon
              name="angle-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderRight={() => {
          return (
            <Icon
              name="download"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressRight={() => {
          downloadFile();
        }}
      />
      <View style={{flex: 1}}>
        <Pdf
          source={{
            uri: paramsItem.link_url,
            cache: true,
          }}
          // source={require('@assets/termsconditions/Facility_Booking_System_Regulation.pdf')}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={uri => {
            console.log(`Link pressed: ${uri}`);
          }}
          password={'220359'}
          style={stylesCurrent.pdf}
          fitWidth={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default PDFAttach;

const stylesCurrent = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
