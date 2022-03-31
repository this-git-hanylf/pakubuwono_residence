import {Text, Button} from '@components';
import ListTransaction from '@components/List/Transaction';
import PropTypes from 'prop-types';
import React, {useState, Fragment, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import styles from './styles';
import {useTheme} from '@config';
import numFormat from '../../numFormat';
import {useNavigation, useRoute} from '@react-navigation/core';
import Modal from 'react-native-modal';
import {useTranslation} from 'react-i18next';
import axios from 'axios';
import {ActivityIndicator} from 'react-native-paper';

const TransactionExpand = ({
  style = {
    paddingTop: 5,
  },
  tradingPairTitle = '',
  tradingPairValue = '',
  priceTitle = '',
  price = '',
  name = '',
  doc_no = '',
  descs = '',
  mbal_amt = '',
  trx_type = '',
  due_date = '',
  doc_date = '',
  tower = '',
  lot_no = '',
  feeTitle = '',
  feeValue = '',
  costTitle = '',
  costValue = '',
  changeTitle = '',
  changeValue = '',
  currentTitle = '',
  currentValue = '',
  debtor_acct = '',
  entity_cd = '',
  project_no = '',
  email = '',
  ListTransactionProps = {
    icon: 'exchange-alt',
    name: name,
    tower: tower,
    descs: descs,
    due_date: due_date,
    doc_no: doc_no,
    mbal_amt: mbal_amt,
    disabled: true,
    lot_no: lot_no,
    debtor_acct: debtor_acct,
    entity_cd: entity_cd,
    project_no: project_no,
    email: email,
  },
  isExpandInit = false,
}) => {
  const {colors} = useTheme();
  const [isExpand, setIsExpand] = useState(isExpandInit);
  const navigation = useNavigation();
  const [modalSuccessVisible, showModalSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [hasError, setErrors] = useState(false);
  const {t} = useTranslation();
  const [datadetailDateDue, setDetailDateDue] = useState([]);
  const [loading, setLoading] = useState(true);

  const detailDateDue = async () => {
    try {
      const res = await axios.get(
        `http://103.111.204.131/apiwebpbi/api/getDataDue/IFCAPB/${email}/${entity_cd}/${project_no}/${debtor_acct}/${doc_no}`,
      );
      setDetailDateDue(res.data.Data);
      console.log('detail date due -->', res.data.Data);
      setLoading(false);
    } catch (error) {
      setErrors(error);
      // alert(hasError.toString());
    }
  };

  const sumTotal =
    datadetailDateDue != 0
      ? datadetailDateDue.reduceRight((max, bills) => {
          return (max += parseInt(bills.mbal_amt));
        }, 0)
      : null;
  const math_total = Math.floor(sumTotal);
  const replaceTotal = math_total
    .toFixed()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  console.log('sum detail mbal mont', sumTotal);
  console.log('replace total', replaceTotal);

  // useEffect(() => {
  //   detailDateDue();
  // }, []);

  const clickExpand = () => {
    console.log('expand di klik');
    setIsExpand(!isExpand);
    detailDateDue();
  };

  const clickAttachment = () => {
    const params = {
      entity_cd: entity_cd,
      project_no: project_no,
      debtor_acct: debtor_acct,
      doc_no: doc_no,
    };
    console.log('params for click attach], params');
    navigation.navigate('AttachmentBilling', params);
    // if (data.debtor_acct == '') {
    //   // alert('Please Choose Debtor First');
    //   setMessage('Please choose debtor first');
    //   showModalSuccess(true);
    // } else {

    // }
  };

  const onCloseModal = () => {
    showModalSuccess(false);
  };

  return (
    <View style={style}>
      <ListTransaction
        style={StyleSheet.flatten([
          {
            borderBottomWidth: 1,
            paddingBottom: 1,
            borderBottomColor: colors.background,
          },
          !isExpand && {
            borderBottomWidth: 1,
            paddingBottom: 1,
            borderBottomColor: colors.border,
          },
        ])}
        {...ListTransactionProps}
        onPress={() => clickExpand()}
      />
      <Button style={{height: 35}} onPress={() => clickAttachment()}>
        <Text style={{color: '#fff', fontSize: 14}}>Attachment</Text>
      </Button>
      {isExpand && (
        <View
          style={StyleSheet.flatten([
            {paddingBottom: 20},
            isExpand && {
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
              marginTop: 15,
            },
          ])}>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{marginTop: 20}} />
          ) : datadetailDateDue != 0 ? (
            <View>
              {datadetailDateDue.map((item, key) => (
                <View key={key}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      // paddingHorizontal: 10,
                      paddingVertical: 5,
                    }}>
                    <View style={{width: '50%', paddingLeft: 10}}>
                      <Text subhead>{item.descs}</Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',

                        width: '35%',
                      }}>
                      <Text>Rp. </Text>
                      <Text subhead>
                        {item.mbal_amt.replace(
                          /(\d)(?=(\d{3})+(?!\d))/g,
                          '$1.',
                        )}
                        {/* 100.000.000.00 */}
                      </Text>
                      {/* <Text subhead>{numFormat(item.mbal_amt)}</Text> */}
                    </View>
                  </View>
                </View>
              ))}
              <View
                style={{
                  borderTopWidth: 0.5,
                  borderStyle: 'dashed',
                  borderColor: colors.primary,
                  marginLeft: 9,
                }}></View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                  // paddingHorizontal: 10,
                  paddingVertical: 5,
                }}>
                <View style={{width: '50%', paddingLeft: 10}}>
                  <Text subhead bold style={{fontSize: 16}}>
                    Total
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',

                    width: '35%',
                  }}>
                  <Text subhead bold style={{fontSize: 16}}>
                    Rp.{' '}
                  </Text>
                  <Text subhead bold style={{fontSize: 16}}>
                    {replaceTotal}.00
                    {/* 100.000.000.00 */}
                  </Text>
                  {/* <Text subhead>{numFormat(item.mbal_amt)}</Text> */}
                </View>
              </View>
            </View>
          ) : (
            <View style={{alignSelf: 'center'}}>
              <Text>Not have data detail </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

TransactionExpand.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  tradingPairTitle: PropTypes.string,
  tradingPairValue: PropTypes.string,
  priceTitle: PropTypes.string,
  price: PropTypes.string,
  email: PropTypes.string,
  lot_no: PropTypes.string,
  debtor_acct: PropTypes.string,
  entity_cd: PropTypes.string,
  project_no: PropTypes.string,
  feeTitle: PropTypes.string,
  feeValue: PropTypes.string,
  costTitle: PropTypes.string,
  costValue: PropTypes.string,
  changeTitle: PropTypes.string,
  changeValue: PropTypes.string,
  currentTitle: PropTypes.string,
  currentValue: PropTypes.string,
};

export default TransactionExpand;
