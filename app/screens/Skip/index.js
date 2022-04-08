import {
  Card,
  Header,
  Icon,
  Image,
  ProfileDescription,
  SafeAreaView,
  Text,
  ProductBlock,
} from '@components';
import {BaseColor, BaseStyle, useTheme} from '@config';
import {Images} from '@config';
import {AboutUsData} from '@data';
import * as Utils from '@utils';
import React, {useState, useEffect} from 'react';
import {ScrollView, View, FlatList} from 'react-native';
import styles from './styles';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import moment from 'moment';
import {ActivityIndicator} from 'react-native-paper';
// import {ProductBlock} from '../../components';

const Skip = props => {
  const {navigation} = props;
  const {colors} = useTheme();
  const {t} = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rent, setRent] = useState([]);
  const [data, setData] = useState([]);

  // useEffect(() => {
  //   axios
  //     .get('http://103.111.204.131/ifcaprop-api/api/about')
  //     .then(({data}) => {
  //       console.log('data', data);
  //       setData(data[0]);
  //     })
  //     .catch(error => console.error(error));
  //   // .finally(() => setLoading(false));
  // }, []);

  const dataAbout = async () => {
    await axios
      .get(`http://103.111.204.131/apiwebpbi/api/about`)
      .then(res => {
        console.log('res image', res.data);
        // console.log('data images', res.data[0].images);

        setData(res.data[0]);
        // return res.data;
        setLoading(false);
      })
      .catch(error => {
        console.log('error get about us', error);
        // alert('error get');
      });
  };

  useEffect(() => {
    axios
      .get('http://103.111.204.131/apiwebpbi/api/rsentryMobile')
      .then(({data}) => {
        console.log('defaultApp -> data', rent);
        setRent(data);
      })
      .catch(error => console.error(error));
    // .finally(() => setLoading(false));
  }, []);

  const goProductDetail = item => {
    navigation.navigate('EProductDetail', {item: item});
  };

  useEffect(() => {
    console.log('datauser', data);
    setTimeout(() => {
      setLoading(false);
      dataAbout();
    }, 1000);
  }, []);

  return (
    <SafeAreaView
      style={BaseStyle.safeAreaView}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('about_us')}
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
      />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <ScrollView>
          <View>
            {/* <Image source={Images.trip4} style={{width: '100%', height: 135}} /> */}
            <Image
              source={require('../../assets/images/logo_about_us.jpg')}
              style={{
                height: 150,
                width: 250,
                alignItems: 'center',
                marginHorizontal: 100,
                flexDirection: 'row',
                justifyContent: 'center',
                alignSelf: 'center',
              }}
            />
          </View>
          <View style={{paddingTop: 3}}>
            <Text
              headline
              semibold
              style={{textAlign: 'center', paddingBottom: 20}}>
              {/* {t('who_we_are')} */}
              {data.about_title}
            </Text>
            {/* <View>
            <Text
              body2
              style={{
                paddingTop: 10,
                paddingBottom: 10,
              }}
              numberOfLines={100}>
              {data.about_us?.replace(/<\/?[^>]+(>|$;)/gi, '')}
            </Text>
          </View> */}
            <View style={styles.address}>
              <Text
                semibold
                style={{
                  paddingTop: 0,
                  paddingBottom: 10,
                  fontSize: 15,
                }}>
                {data.contact_name}
              </Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Icon name="mobile" size={20} />
                <Text> {data.contact_no}</Text>
              </View>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Icon name="envelope" size={20} />
                <Text> {data.contact_email}</Text>
              </View>

              <Text
                semibold
                style={{
                  fontSize: 18,
                  paddingBottom: 10,
                  paddingTop: 15,
                }}>
                Contact Us
              </Text>
              <Text body style={{paddingBottom: 5}}>
                {data.address}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Skip;
