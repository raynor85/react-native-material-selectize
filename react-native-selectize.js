'use strict';

import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Chip from './react-native-chip';

export default class ReactNativeSelectize extends React.Component {
  static defaultProps = {
    onPress: () => {},
    items: [],
    style: {},
    textStyle: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedItems: ['John Doe', 'Ruben Rizzi', 'Giovanni Casnici', 'Fabian Piau', 'Sanje Sanjennaro'],
      text: '',
      textWidth: 0
    };
  }

  onChangeText = text => {
    this.setState({ text });
  }

  onSubmit = e => {
    const { text, selectedItems } = this.state;

    selectedItems.push(text);
    this.setState({ text: '' });
  }

  onLayout = e => {
    const { width } = e.nativeEvent.layout;
    this.setState({ textWidth: width });
  }

  render() {
    const { style } = this.props;
    const { selectedItems, text, textWidth } = this.state;
    const textInputStyle = { ...StyleSheet.flatten(styles.textInput), ...style, minWidth: textWidth };
    const hiddenTextStyle = { ...textInputStyle, minWidth: 0, position: 'absolute', zIndex: -1, height: 0 };
    return (
      <View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {selectedItems.map(text => <Chip key={text} text={text} />)}
          <TextInput
            value={text}
            autoCorrect={false}
            onChangeText={this.onChangeText}
            onSubmitEditing={this.onSubmit}
            style={textInputStyle}
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
  textInput: {
    flex: 1,
    backgroundColor: '#fff',
    fontSize: 16
  }
});
