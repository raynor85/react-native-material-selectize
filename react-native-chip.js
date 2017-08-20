'use strict';

import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class ReactNativeChip extends React.Component {
  static defaultProps = {
    onClose: () => {},
    text: 'John Doe'
  };

  constructor(props) {
    super(props);
    this.isIOS = Platform.OS === 'ios';
  }

  render() {
    const { onClose, text } = this.props;

    return (
      <View style={styles.root}>
        <Text style={styles.text}>{text}</Text>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={onClose}>
          <Text style={[styles.icon, this.isIOS ? styles.iconIOS : styles.iconAndroid]}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    marginBottom: 5,
    marginRight: 5
  },
  text: {
    color: 'rgba(0, 0, 0, 0.87)'
  },
  iconWrapper: {
    borderRadius: 50,
    backgroundColor: '#a6a6a6',
    height: 18,
    width: 18,
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
    fontSize: 14,

  },
  iconAndroid: {
    fontSize: 13,
    lineHeight: 15
  }
});
