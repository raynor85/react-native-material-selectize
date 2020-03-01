import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  ImageStyle
} from 'react-native';
import { Chip, Selectize } from 'react-native-material-selectize';

import { Item } from '../App';

interface Props {
  items: Item[];
  itemId: 'email';
  onChipClose: (is: boolean) => void;
  onSubmitEditing: (submit: boolean) => void;
  selectizeRef: React.MutableRefObject<any>;
}

const EmailField = ({
  items,
  itemId,
  onChipClose,
  onSubmitEditing,
  selectizeRef
}: Props) => {
  const [error, setError] = useState('');

  const getSelectedEmails = () =>
    selectizeRef.current.getSelectedItems().result;

  const validate = (email: string) => {
    if (getSelectedEmails().length >= 10 && selectizeRef.current.state.text) {
      setError('Sorry, you can enter a maximum of 10 emails');
      onSubmitEditing(false);
      return false;
    } else if (
      (email === '' && getSelectedEmails().length) ||
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email.trim())
    ) {
      // http://www.w3resource.com/javascript/form/email-validation.php
      setError('');
      onSubmitEditing(true);
    } else {
      setError('Please enter a valid email');
      onSubmitEditing(false);
      return false;
    }
  };

  const handleSubmitEditing = (email: string) => {
    return validate(email);
  };

  const handleChipClose = (onClose: any) => {
    onChipClose(!error && getSelectedEmails().length > 1);
    onClose();
  };

  return (
    <View>
      <Selectize
        ref={selectizeRef}
        chipStyle={styles.chip}
        chipIconStyle={styles.chipIcon}
        error={error}
        itemId={itemId}
        items={items}
        label="Email addresses"
        listStyle={styles.list}
        tintColor="#028fb0"
        textInputProps={{
          onSubmitEditing: handleSubmitEditing,
          onBlur: () => selectizeRef.current.submit(),
          placeholder: 'Insert one or more emails',
          keyboardType: 'email-address'
        }}
        renderRow={(id: string, onPress: () => void, item: Item) => (
          <TouchableOpacity
            activeOpacity={0.6}
            key={id}
            onPress={onPress}
            style={styles.listRow}>
            <View style={styles.listWrapper}>
              <View style={styles.listIcon}>
                <Text style={styles.listInitials}>{item.initials}</Text>
              </View>
              <View>
                <Text style={styles.listNameText}>{item.name}</Text>
                <Text style={styles.listEmailText}>{id}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        renderChip={(
          id: string,
          onClose: () => void,
          item: Item,
          style: StyleProp<ViewStyle>,
          iconStyle: StyleProp<ImageStyle>
        ) => (
          <Chip
            key={id}
            iconStyle={iconStyle}
            onClose={() => handleChipClose(onClose)}
            text={id}
            style={style}
          />
        )}
      />
      <Text style={styles.coveredContent}>Content which is covered</Text>
    </View>
  );
};

const EmailFieldWithRef = React.forwardRef(
  (props: Omit<Props, 'selectizeRef'>, ref: any) => {
    return <EmailField {...props} selectizeRef={ref} />;
  }
);

export default EmailFieldWithRef;

const styles = StyleSheet.create({
  chip: {
    paddingRight: 2
  },
  chipIcon: {
    height: 24,
    width: 24
  },
  list: {
    backgroundColor: '#fff',
    position: 'absolute'
  },
  listRow: {
    paddingVertical: 8,
    paddingHorizontal: 10
  },
  listWrapper: {
    flexDirection: 'row'
  },
  listIcon: {
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    height: 40,
    width: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  listInitials: {
    fontSize: 20,
    lineHeight: 24,
    color: '#fff'
  },
  listNameText: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 14,
    lineHeight: 21
  },
  listEmailText: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 14,
    lineHeight: 21
  },
  coveredContent: {
    zIndex: -1
  }
});
