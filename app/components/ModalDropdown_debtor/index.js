import Button from '@components/Button';
import Icon from '@components/Icon';
import Image from '@components/Image';
import Text from '@components/Text';
import TextInput from '@components/TextInput';
import {useTheme} from '@config';
import PropTypes from 'prop-types';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import styles from './styles';
import ModalSelector from 'react-native-modal-selector';
import {useDarkMode} from 'react-native-dark-mode';

const ModalDropdown_debtor = props => {
  const {colors} = useTheme();
  const isDarkMode = useDarkMode();
  const {t} = useTranslation();
  const cardColor = colors.card;
  const {options, onApply, onSelectFilter, ...attrs} = props;

  return (
    <View {...attrs}>
      {props.label && (
        <Text
          style={{
            color: isDarkMode ? '#fff' : '#000',
          }}>{`Select ${props.label}`}</Text>
      )}

      <ModalSelector
        data={props.data}
        optionTextStyle={{color: '#333'}}
        selectedItemTextStyle={{color: isDarkMode ? colors.primary : '#3C85F1'}}
        accessible={true}
        keyExtractor={item => item.debtor_acct}
        labelExtractor={item => item.debtor_acct + ` - ` + item.name} //khusus untuk debtor
        cancelButtonAccessibilityLabel={'Cancel Button'}
        onChange={option => {
          props.onChange(option);
        }}>
        <TextInput
          style={[{color: isDarkMode ? 'red' : '#000'}, _styles.input]}
          inputStyle={{color: isDarkMode ? 'grey' : colors.text}}
          onFocus={() => this.selector.open()}
          placeholder={props.label}
          editable={false}
          placeholderTextColor={isDarkMode ? 'grey' : '#a9a9a9'}
          value={props.value}
        />
      </ModalSelector>
    </View>
  );
};

ModalDropdown_debtor.defaultProps = {
  options: [],
  onApply: () => {},
  onSelectFilter: () => {},
};

ModalDropdown_debtor.propTypes = {
  options: PropTypes.array,
  onApply: PropTypes.func,
  onSelectFilter: PropTypes.func,
};

export default ModalDropdown_debtor;

const _styles = StyleSheet.create({
  input: {
    height: 40,
    backgroundColor: '#f5f5f5',
    color: 'black',
    paddingHorizontal: 10,
    marginBottom: 16,
    width: null,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
