import {
  CardReport03,
  CardReport08,
  CardReport07,
  ProfileGridSmall,
  SafeAreaView,
  Text,
  Header,
  Transaction2Col,
  Icon,
  Tag,
  Price3Col,
  ListTransactionExpand,
} from '@components';
import {BaseStyle, useTheme} from '@config';
import {FRecentTransactions, FHotNews} from '@data';
import {useNavigation, useRoute} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {enableExperimental} from '@utils';

import moment from 'moment';

import {
  ScrollView,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import HeaderHome from './HeaderHome';
import styles from './styles';
import HeaderCard from './HeaderCard';
import getUser from '../../selectors/UserSelectors';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import numFormat from '../../components/numFormat';
import CurrencyFormatter from '../../components/CurrencyFormatter';
import {TransactionExpandHistory} from '../../components';

const BillingHistory = ({
  isCenter = false,
  isPrimary = false,
  style = {},
  onPress = () => {},
  disabled = false,
}) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => getUser(state));
  const [hasError, setErrors] = useState(false);
  const [bill, setBill] = useState([]);
  const [data, setData] = useState([]);
  const [dataCurrent, setDataCurrent] = useState([]);

  // Make function to call the api
  async function fetchData() {
    try {
      const res = await axios.get(
        `http://103.111.204.131/apiwebpbi/api/getSummaryHistory/IFCAPB/${user.user}`,
      );
      console.log('res datacurrent', res.data.Data);
      setDataCurrent(res.data.Data);
      // console.log('DATA DUE DATE -->', dataCurrent);
    } catch (error) {
      setErrors(error.ressponse.data);
      // alert(hasError.toString());
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView
      style={[BaseStyle.safeAreaView, {flex: 1}]}
      edges={['right', 'top', 'left']}>
      <Header
        title={t('Invoice History')}
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
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {TABS.map((item, index) => (
            <View key={index} style={{flex: 1, paddingHorizontal: 20}}>
              <Tag
                primary
                style={{
                  backgroundColor:
                    tab.id == item.id ? colors.primary : colors.background,
                }}
                onPress={() => {
                  enableExperimental();
                  setTab(item);
                }}>
                <Text
                  body1={tab.id != item.id}
                  light={tab.id != item.id}
                  whiteColor={tab.id == item.id}>
                  {item.title}
                </Text>
              </Tag>
            </View>
          ))}
        </View> */}
        {/* <Text>halo billig history</Text> */}

        <View style={{flex: 1, paddingHorizontal: 20}}>
          {dataCurrent.map((item, key) => (
            <TransactionExpandHistory
              onPress={() => navigation.navigate('FHistoryDetail')}
              tower={item.tower}
              name={item.name}
              lot_no={item.lot_no}
              doc_no={item.doc_no}
              project_no={item.project_no}
              entity_cd={item.entity_cd}
              doc_date={moment(item.doc_date).format('DD MMMM YYYY')}
              debtor_acct={item.debtor_acct}
              due_date={moment(item.due_date).format('DD MMMM YYYY')}
              mdoc_amt={`${numFormat(`${item.mdoc_amt}`)}`}
              key={key}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BillingHistory;
