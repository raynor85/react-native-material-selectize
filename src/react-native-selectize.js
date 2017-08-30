'use strict';

import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { normalize, schema } from 'normalizr';
import Chip from './react-native-chip';

export default class ReactNativeSelectize extends React.Component {
  static defaultProps = {
    onPress: () => {},
    containerStyle: { paddingTop: 16, paddingBottom: 10 },
    itemId: 'id',
    items: [],
    textInputProps: {},
    errorColor: 'rgb(213, 0, 0)',
    tintColor: 'rgb(0, 145, 234)',
    baseColor: 'rgba(0, 0, 0, .38)',
    error: '',
    trimOnSubmit: true,
    renderRow: (id, onPress, item, style) => (
      <TouchableOpacity
        activeOpacity={0.6}
        key={id}
        onPress={onPress}
        style={[styles.listRow, style]}>
        <Text style={{ color: 'rgba(0, 0, 0, 0.87)' }}>{id}</Text>
      </TouchableOpacity>
    ),
    renderChip: (id, onClose, item, style) => (
      <Chip
        key={id}
        onClose={onClose}
        text={id}
        style={style}
      />
    )
  };

  constructor(props) {
    super(props);
    this.state = {
      hasFocus: this.props.textInputProps.autoFocus,
      items: this._getNormalizedItems(props),
      selectedItems: { result: [], entities: { item: {} } },
      text: '',
      textWidth: 0
    };
    this.defaultTextInputProps = {
      autoCapitalize: 'none',
      autoCorrect: false,
      blurOnSubmit: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const items = this._getNormalizedItems(nextProps);

    this.setState({ items });
  }

  componentWillUnmount() {
    clearInterval(this.cancelBlur);
  }

  focus = () => {
    this._textInput.focus();
  }

  blur = () => {
    const { onBlur } = this.props.textInputProps;
    const { text } = this.state;

    this._textInput.blur();
    clearInterval(this.cancelBlur);
    this._call(onBlur, text);
    this.setState({ hasFocus: false });
  }

  submit = () => {
    this._onSubmitEditing(this.props.textInputProps.onSubmitEditing);
  }

  getSelectedItems = () => this.state.selectedItems;

  _getNormalizedItems = ({ itemId, items }) => {
    let itemsCopy = [...items];
    if (itemsCopy.every(item => typeof item === 'string')) {
      itemsCopy = itemsCopy.reduce((acc, value) => {
        return acc.concat({ [itemId]: value });
      }, []);
    }
    if (itemsCopy.every(item => typeof item[itemId] === 'number')) {
      itemsCopy = itemsCopy.map(item => {
        item[itemId] = String(item[itemId]);
        return item;
      });
    }
    const itemSchema = new schema.Entity('item', undefined, { idAttribute: itemId });
    let normalizedItems = normalize(itemsCopy, [itemSchema]);
    if (!normalizedItems.entities.item) {
      normalizedItems.entities.item = {};
    }
    return normalizedItems;
  }

  _call() {
    const [callback, ...params] = arguments;

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
    const { itemId, trimOnSubmit } = this.props;
    const { items, selectedItems } = this.state;
    const text = trimOnSubmit ? this.state.text.trim() : this.state.text;

    if (this._call(callback, text) === false) {
      return;
    }
    if (text === '') {
      return;
    }

    if (!selectedItems.entities.item.hasOwnProperty(text)) {
      const item = items.entities.item.hasOwnProperty(text) ? { ...items.entities.item[text] } : { [itemId]: text };

      selectedItems.result.push(text);
      selectedItems.entities.item[text] = item;
    }
    this.setState({ text: '' });
  };

  _onFocus = callback => {
    const { text } = this.state;

    clearInterval(this.cancelBlur);
    this._call(callback, text);
    this.setState({ hasFocus: true });
  };

  _onBlur = callback => {
    const { text } = this.state;

    this.cancelBlur = setTimeout(() => {
      this._call(callback, text);
      // when the user tap on an item of the list, the state 'hasFocus' should stay true, so we use setTimeout
      this.setState({ hasFocus: false });
    }, 150);
  };

  _onChipClose = text => {
    const { selectedItems } = this.state;

    selectedItems.result = selectedItems.result.filter(item => item !== text);
    delete selectedItems.entities.item[text];
    this.setState({ selectedItems });
  };

  _onLayout = e => {
    const { width } = e.nativeEvent.layout;
    this.setState({ textWidth: width });
  };

  _selectItem = id => {
    this.setState({ text: id }, this.submit);
    this._textInput.focus();
  };

  _getRow = id => {
    const { listRowStyle, renderRow } = this.props;
    const { items } = this.state;

    return renderRow(id, () => this._selectItem(id), items.entities.item[id], listRowStyle);
  };

  _filterItems = searchTerm => {
    const { items, selectedItems } = this.state;
    const filteredItems = { result: [], entities: { item: {} } };

    items.result.forEach(id => {
      const parts = searchTerm.trim().split(/[ \-:]+/);
      const regex = new RegExp(`(${parts.join('|')})`, 'ig');
      if (!selectedItems.entities.item[id] && regex.test(id)) {
        filteredItems.result.push(id);
        filteredItems.entities.item[id] = { ...items.entities.item[id] };
      }
    });
    return filteredItems;
  };

  _renderItems = () => {
    const { listStyle } = this.props;
    const { hasFocus } = this.state;
    const searchTerm = this.state.text.trim();
    const items = this._filterItems(searchTerm);
    let component = null;

    if (items.result.length && hasFocus) {
      component = (
        <View style={[styles.list, listStyle]}>
          {items.result.map(id => this._getRow(id))}
        </View>
      );
    }
    return component;
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

    return error || hasFocus ?
      { borderBottomWidth: 2, paddingBottom: 1 } :
      { borderBottomWidth: 0.5, paddingBottom: 2.5 };
  };

  render() {
    const { chipStyle, containerStyle, textInputProps, errorColor, renderChip, tintColor, label, error } = this.props;
    const { style: textInputStyleFromProps, onChangeText, onSubmitEditing, onFocus, onBlur, placeholder,
            ...otherTextInputProps } = textInputProps;
    const { selectedItems, text, textWidth } = this.state;
    const inputContainerStyle = [
      styles.inputContainer, { borderBottomColor: this._getColor(), ...this._getLineStyleVariant() }
    ];
    const labelStyle = [styles.label, { color: this._getColor() }];
    const textInputStyle = {
      ...StyleSheet.flatten(styles.textInput), ...textInputStyleFromProps, minWidth: textWidth > 40 ? textWidth : 40
    };
    const hiddenTextStyle = { ...textInputStyle, minWidth: 0, position: 'absolute', zIndex: -1, height: 0 };

    return (
      <View style={containerStyle}>
        {label && <Text style={labelStyle}>{label}</Text>}
        <View style={inputContainerStyle}>
          {selectedItems.result.map(id =>
            renderChip(id, () => this._onChipClose(id), selectedItems.entities.item[id], chipStyle)
          )}
          <TextInput
            ref={c => this._textInput = c}
            {... { ...this.defaultTextInputProps, ...otherTextInputProps }}
            disableFullscreenUI={true}
            placeholder={selectedItems.result.length ? '' : placeholder}
            underlineColorAndroid={'transparent'}
            value={text}
            onChangeText={text => this._onChangeText(text, onChangeText)}
            onSubmitEditing={() => this._onSubmitEditing(onSubmitEditing)}
            onFocus={() => this._onFocus(onFocus)}
            onBlur={() => this._onBlur(onBlur)}
            selectionColor={tintColor}
            style={textInputStyle}
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
        {this._renderItems()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
  list: {
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    borderStyle: 'solid',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
    shadowColor: '#e0e0e0',
    shadowOffset: { height: 1, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1
  },
  listRow: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    height: 32,
    padding: 0
  }
});
