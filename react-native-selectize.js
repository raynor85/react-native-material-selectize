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
    errorColor: 'rgb(213, 0, 0)',
    tintColor: 'rgb(0, 145, 234)',
    baseColor: 'rgba(0, 0, 0, .38)',
    error: ''
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

  focus = () => {
    this._textInput.focus();
  }

  blur = () => {
    this._textInput.blur();
  }

  submit = () => {
    this._onSubmitEditing(this.props.textInputProps.onSubmitEditing);
  }

  _call() {
    const [ callback, ...params ] = arguments;

    if (typeof callback === 'function') {
      return callback(...params);
    }
  }

  _onChangeText = (text, callback) => {
    if (this._call(callback, text) === false) {
      return;
    }
    this.setState({ text });
  };

  _onSubmitEditing = callback => {
    const { text, selectedItems } = this.state;

    if (this._call(callback, text) === false) {
      return;
    }
    if (text === '') {
      return;
    }

    if (!selectedItems.entities.hasOwnProperty(text)) {
      selectedItems.result.push(text);
      selectedItems.entities[text] = { id: text };
    }
    this.setState({ text: '' });
  };

  _onFocus = callback => {
    const { text } = this.state;

    this._call(callback, text);
    this.setState({ hasFocus: true });
  };

  _onBlur = callback => {
    const { text } = this.state;

    this._call(callback, text);
    this.setState({ hasFocus: false });
  };

  _onChipClose = text => {
    const { selectedItems } = this.state;

    selectedItems.result = selectedItems.result.filter(item => item !== text)
    delete selectedItems.entities[text];
    this.setState({ selectedItems });
  };

  _onLayout = e => {
    const { width } = e.nativeEvent.layout;
    this.setState({ textWidth: width });
  };

  _getColor = () => {
    const { errorColor, tintColor, baseColor, error } = this.props;
    const { hasFocus } = this.state;

    if (error) {
      return errorColor;
    }
    if (hasFocus) {
      return tintColor;
    }
    return baseColor;
  };

  _getLineStyleVariant = () => {
    const { error } = this.props;
    const { hasFocus } = this.state;

    return error || hasFocus
      ? { borderBottomWidth: 2, paddingBottom: 1 }
      : { borderBottomWidth: 0.5, paddingBottom: 2.5 };
  };

  render() {
    const { containerStyle, style, textInputProps, errorColor, tintColor, baseColor, label, error } = this.props;
    const { style: textInputStyleFromProps, onChangeText, onSubmitEditing, onFocus, onBlur, ...otherTextInputProps } = textInputProps;
    const { hasFocus, selectedItems, text, textWidth } = this.state;
    const rootStyle = { paddingTop: 16, paddingBottom: 10, ...containerStyle };
    const inputContainerStyle = [styles.inputContainer, { borderBottomColor: this._getColor(), ...this._getLineStyleVariant() }];
    const labelStyle = [styles.label, { color: this._getColor() }];
    const textInputStyle = { ...StyleSheet.flatten(styles.textInput), ...textInputStyleFromProps, minWidth: textWidth > 40 ? textWidth : 40 };
    const hiddenTextStyle = { ...textInputStyle, minWidth: 0, position: 'absolute', zIndex: -1, height: 0 };

    return (
      <View style={[rootStyle, error && { paddingBottom: rootStyle.paddingBottom - 10 }]}>
        {label && <Text style={labelStyle}>{label}</Text>}
        <View style={inputContainerStyle}>
          {selectedItems.result.map(text =>
            <Chip
              onClose={() => this._onChipClose(text)}
              key={text}
              text={text}
            />)
          }
          <TextInput
            ref={c => this._textInput = c}
            value={text}
            autoCapitalize={'none'}
            autoCorrect={false}
            blurOnSubmit={false}
            onChangeText={text => this._onChangeText(text, onChangeText)}
            onSubmitEditing={() => this._onSubmitEditing(onSubmitEditing)}
            onFocus={() => this._onFocus(onFocus)}
            onBlur={() => this._onBlur(onBlur)}
            selectionColor={tintColor}
            style={textInputStyle}
            underlineColorAndroid={'transparent'}
            {...otherTextInputProps}
          />
        </View>
        <Text
          style={hiddenTextStyle}
          onLayout={this._onLayout}>
          {text}
        </Text>
        {!!error && <Text
          style={[styles.helper, { color: errorColor }]}>
          {error}
        </Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 16,
    paddingBottom: 10
  },
  inputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  helper: {
    fontSize: 12,
    marginVertical: 4
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
