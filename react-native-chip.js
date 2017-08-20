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
        <View style={styles.container}>
          <Text style={styles.text} numberOfLines={1}>{text}</Text>
          <TouchableOpacity
            style={styles.iconWrapper}
            onPress={onClose}>
            <Text style={[styles.icon, this.isIOS ? styles.iconIOS : styles.iconAndroid]}>✕</Text>
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 30,
    marginBottom: 5,
    marginRight: 5
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
