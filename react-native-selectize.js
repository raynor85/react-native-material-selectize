'use strict';

import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Chip from './react-native-chip';

export default class ReactNativeSelectize extends React.Component {
  static defaultProps = {
    onPress: () => {},
    items: [],
    style: {},
    textInputProps: {},
    textStyle: {},
    tintColor: 'rgb(0, 145, 234)',
    baseColor: 'rgba(0, 0, 0, .38)'
  };

  constructor(props) {
    super(props);
    this.state = {
      hasFocus: this.props.textInputProps.autoFocus,
      selectedItems: {
        result: [
          'JohnDoe@gmail.com',
          'RubenRizzi@f1000.com',
          'GiovanniCasnici@canna.com',
          'FabianPiau@french.fr',
          'SanjeSanjennaro@gianni.it'
        ],
        entities: {
          'JohnDoe@gmail.com': { id: 'JohnDoe@gmail.com' },
          'RubenRizzi@f1000.com': { id: 'RubenRizzi@f1000.com' },
          'GiovanniCasnici@canna.com': { id: 'GiovanniCasnici@canna.com' },
          'FabianPiau@french.fr': { id: 'FabianPiau@french.fr' },
          'SanjeSanjennaro@gianni.it': { id: 'SanjeSanjennaro@gianni.it' }
        }
      },
      text: '',
      textWidth: 0
    };
  }

  call() {
    const [ callback, ...params ] = arguments;

    if (typeof callback === 'function') {
      callback(...params);
    }
  }

  onChangeText = (text, callback) => {
    this.call(callback, text);
    this.setState({ text });
  }

  onSubmitEditing = callback => {
    const { text, selectedItems } = this.state;

    this.call(callback, text);
    if (text === '') {
      return;
    }

    if (!selectedItems.entities.hasOwnProperty(text)) {
      selectedItems.result.push(text);
      selectedItems.entities[text] = { id: text };
    }
    this.setState({ text: '' });
  }

  onFocus = callback => {
    const { text } = this.state;

    this.call(callback, text);
    this.setState({ hasFocus: true });
  }

  onBlur = callback => {
    const { text } = this.state;

    this.call(callback, text);
    this.setState({ hasFocus: false });
  }

  onChipClose = text => {
    const { selectedItems } = this.state;

    selectedItems.result = selectedItems.result.filter(item => item !== text)
    delete selectedItems.entities[text];
    this.setState({ selectedItems });
  }

  onLayout = e => {
    const { width } = e.nativeEvent.layout;
    this.setState({ textWidth: width });
  }

  render() {
    const { style, textInputProps, tintColor, baseColor, label } = this.props;
    const { style: textInputStyleFromProps, onChangeText, onSubmitEditing, onFocus, onBlur, ...otherTextInputProps } = textInputProps;
    const { hasFocus, selectedItems, text, textWidth } = this.state;
    const rootStyle = [styles.root, hasFocus
      ? { borderBottomColor: tintColor, borderBottomWidth: 2, paddingBottom: 1 }
      : { borderBottomColor: baseColor, borderBottomWidth: 0.5, paddingBottom: 2.5 }
    ];
    const labelStyle = [styles.label, { color: hasFocus ? tintColor : baseColor }];
    const textInputStyle = { ...StyleSheet.flatten(styles.textInput), ...textInputStyleFromProps, minWidth: textWidth > 40 ? textWidth : 40 };
    const hiddenTextStyle = { ...textInputStyle, minWidth: 0, position: 'absolute', zIndex: -1, height: 0 };

    return (
      <View style={rootStyle}>
        {label && <Text style={labelStyle}>{label}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {selectedItems.result.map(text =>
            <Chip
              onClose={() => this.onChipClose(text)}
              key={text}
              text={text}
            />)
          }
          <TextInput
            value={text}
            autoCapitalize={'none'}
            autoCorrect={false}
            blurOnSubmit={false}
            onChangeText={text => this.onChangeText(text, onChangeText)}
            onSubmitEditing={() => this.onSubmitEditing(onSubmitEditing)}
            onFocus={() => this.onFocus(onFocus)}
            onBlur={() => this.onBlur(onBlur)}
            selectionColor={tintColor}
            style={textInputStyle}
            underlineColorAndroid={'transparent'}
            {...otherTextInputProps}
          />
        </View>
        <Text
          style={hiddenTextStyle}
          onLayout={this.onLayout}>
          {text}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    marginVertical: 10,
    paddingBottom: 2
  },
  label: {
    marginBottom: 4,
    fontSize: 12
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    height: 32,
    padding: 0
  }
});
