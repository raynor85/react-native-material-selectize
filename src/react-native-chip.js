'use strict';

import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default class ReactNativeChip extends React.PureComponent {
  static defaultProps = {
    onClose: () => {},
    text: ''
  };

  constructor(props) {
    super(props);
    this.isIOS = Platform.OS === 'ios';
  }

  render() {
    const { iconStyle, onClose, style, text } = this.props;

    return (
      <View style={[styles.root, style]}>
        <View style={styles.container}>
          <Text style={styles.text} numberOfLines={1}>
            {text}
          </Text>
          <TouchableOpacity
            style={[styles.iconWrapper, iconStyle]}
            onPress={onClose}>
            <Text
              style={[
                styles.icon,
                this.isIOS ? styles.iconIOS : styles.iconAndroid
              ]}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    height: 28,
    marginBottom: 4,
    marginRight: 4
  },
  container: {
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  text: {
    color: 'rgba(0, 0, 0, 0.87)'
  },
  iconWrapper: {
    borderRadius: 50,
    backgroundColor: '#a6a6a6',
    height: 16,
    width: 16,
    overflow: 'hidden',
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    textAlign: 'center',
    color: '#e0e0e0'
  },
  iconIOS: {
    fontSize: 14
  },
  iconAndroid: {
    fontSize: 13,
    lineHeight: 15
  }
});
