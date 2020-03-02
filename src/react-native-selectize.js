'use strict';

import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';
import { normalize, schema } from 'normalizr';
import Chip from './react-native-chip';

const SHOWITEMS = {
  ONFOCUS: 'onFocus',
  ONTYPING: 'onTyping',
  ALWAYS: 'always',
  NEVER: 'never'
};

export default class ReactNativeSelectize extends React.Component {
  static propTypes = {
    chipStyle: ViewPropTypes.style,
    chipIconStyle: ViewPropTypes.style,
    containerStyle: ViewPropTypes.style,
    inputContainerStyle: ViewPropTypes.style,
    labelStyle: ViewPropTypes.style,
    listStyle: ViewPropTypes.style,
    listRowStyle: ViewPropTypes.style,
    itemId: PropTypes.string,
    items: PropTypes.array,
    selectedItems: PropTypes.array,
    label: PropTypes.string,
    error: PropTypes.string,
    errorColor: PropTypes.string,
    tintColor: PropTypes.string,
    baseColor: PropTypes.string,
    showItems: PropTypes.oneOf([
      SHOWITEMS.ONFOCUS,
      SHOWITEMS.ONTYPING,
      SHOWITEMS.ALWAYS,
      SHOWITEMS.NEVER
    ]),
    autoReflow: PropTypes.bool,
    trimOnSubmit: PropTypes.bool,
    renderRow: PropTypes.func,
    renderChip: PropTypes.func,
    textInputProps: PropTypes.object,
    middleComponent: PropTypes.element,
    filterOnKey: PropTypes.string,
    onChangeSelectedItems: PropTypes.func
  };

  static defaultProps = {
    autoReflow: true,
    itemId: 'id',
    items: [],
    errorColor: 'rgb(213, 0, 0)',
    tintColor: 'rgb(0, 145, 234)',
    baseColor: 'rgba(0, 0, 0, .38)',
    selectedItems: [],
    showItems: SHOWITEMS.ONFOCUS,
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
    renderChip: (id, onClose, item, style, iconStyle) => (
      <Chip
        key={id}
        iconStyle={iconStyle}
        onClose={onClose}
        text={id}
        style={style}
      />
    ),
    textInputProps: {},
    middleComponent: null,
    filterOnKey: null,
    onChangeSelectedItems: () => {}
  };

  constructor(props) {
    super(props);
    this.state = {
      hasFocus: props.textInputProps.autoFocus,
      items: this._getNormalizedItems(props),
      selectedItems: this._getNormalizedSelectedItems(props),
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
  };

  blur = () => {
    const { onBlur } = this.props.textInputProps;
    const { text } = this.state;

    this._textInput.blur();
    clearInterval(this.cancelBlur);
    this._call(onBlur, text);
    this.setState({ hasFocus: false });
  };

  submit = () => {
    this._onSubmitEditing(this.props.textInputProps.onSubmitEditing);
  };

  getSelectedItems = () => this.state.selectedItems;

  clearSelectedItems = () => {
    const selectedItems = {
      result: [],
      entities: {
        item: {}
      }
    };
    this._setSelectedItems(selectedItems);
  };

  _copySelectedItems = () => {
    return {
      result: [...this.state.selectedItems.result],
      entities: { ...this.state.selectedItems.entities }
    };
  };

  _setSelectedItems = selectedItems => {
    this.setState({ selectedItems }, () => {
      this.props.onChangeSelectedItems(selectedItems);
    });
  };

  getValue = () => this.state.text;

  _getNormalized = ({ itemId }, items) => {
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
    const itemSchema = new schema.Entity('item', undefined, {
      idAttribute: itemId
    });
    let normalizedItems = normalize(itemsCopy, [itemSchema]);
    if (!normalizedItems.entities.item) {
      normalizedItems.entities.item = {};
    }
    return normalizedItems;
  };

  _getNormalizedItems = ({ itemId, items }) =>
    this._getNormalized({ itemId }, items);

  _getNormalizedSelectedItems = ({ itemId, selectedItems }) =>
    this._getNormalized({ itemId }, selectedItems);

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
    const { items } = this.state;
    const selectedItems = this._copySelectedItems();
    const text = trimOnSubmit ? this.state.text.trim() : this.state.text;

    if (this._call(callback, text) === false) {
      return;
    }
    if (text === '') {
      return;
    }

    if (!selectedItems.entities.item.hasOwnProperty(text)) {
      const item = items.entities.item.hasOwnProperty(text)
        ? { ...items.entities.item[text] }
        : { [itemId]: text };

      selectedItems.result.push(text);
      selectedItems.entities.item[text] = item;
      this._setSelectedItems(selectedItems);
    }
    this.setState({ text: '' });

    // Hack for Android devices to reset keyboard state. Otherwise TextInput does not properly clear
    // previously inputted text.
    // See: https://stackoverflow.com/questions/37798584/react-native-when-submitting-a-text-input-in-android-the-word-suggestions-are
    this._textInput.setNativeProps({ keyboardType: 'email-address' });
    this._textInput.setNativeProps({ keyboardType: 'default' });
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
    const selectedItems = this._copySelectedItems();

    selectedItems.result = selectedItems.result.filter(item => item !== text);
    delete selectedItems.entities.item[text];
    this._setSelectedItems(selectedItems);
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

    return renderRow(
      id,
      () => this._selectItem(id),
      items.entities.item[id],
      listRowStyle
    );
  };

  _filterItems = searchTerm => {
    const { items, selectedItems } = this.state;
    const filteredItems = { result: [], entities: { item: {} } };
    const { filterOnKey } = this.props;

    items.result.forEach(id => {
      const parts = searchTerm
        .replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
        .trim()
        .split(/[ \-:]+/);
      const regex = new RegExp(`(${parts.join('|')})`, 'ig');
      const filterOnValue = filterOnKey
        ? items.entities.item[id][filterOnKey]
        : id;
      if (!selectedItems.entities.item[id] && regex.test(filterOnValue)) {
        filteredItems.result.push(id);
        filteredItems.entities.item[id] = { ...items.entities.item[id] };
      }
    });
    return filteredItems;
  };

  _keyExtractor = id => id;

  _renderItem = ({ item }) => this._getRow(item);

  _renderItems = () => {
    const { listStyle, showItems } = this.props;
    const { hasFocus, text } = this.state;
    const items = this._filterItems(text.trim());
    const itemComponent = (
      <View>
        <View style={[styles.list, listStyle]}>
          <FlatList
            data={items.result}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </View>
    );

    switch (showItems) {
      case SHOWITEMS.NEVER:
        return null;

      case SHOWITEMS.ALWAYS:
        return items.result.length ? itemComponent : null;

      case SHOWITEMS.ONFOCUS:
        return items.result.length && hasFocus ? itemComponent : null;

      case SHOWITEMS.ONTYPING:
        return items.result.length && hasFocus && text ? itemComponent : null;

      default:
        return null;
    }
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
    const {
      autoReflow,
      chipStyle,
      chipIconStyle,
      containerStyle,
      inputContainerStyle,
      labelStyle,
      textInputProps,
      errorColor,
      renderChip,
      tintColor,
      label,
      error,
      middleComponent
    } = this.props;
    const {
      style: textInputStyleFromProps,
      onChangeText,
      onSubmitEditing,
      onFocus,
      onBlur,
      placeholder,
      ...otherTextInputProps
    } = textInputProps;
    const { selectedItems, text, textWidth } = this.state;
    const inputContainerBorderStyle = {
      borderBottomColor: this._getColor(),
      ...this._getLineStyleVariant()
    };
    const computedLabelStyle = [
      styles.label,
      { color: this._getColor() },
      labelStyle
    ];
    const textInputStyle = {
      ...StyleSheet.flatten(styles.textInput),
      ...textInputStyleFromProps,
      minWidth: textWidth > 40 ? textWidth : 40
    };
    const hiddenTextStyle = {
      ...textInputStyle,
      minWidth: 0,
      position: 'absolute',
      zIndex: -1,
      height: 0
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {!!label && <Text style={computedLabelStyle}>{label}</Text>}
        <View
          style={[
            styles.inputContainer,
            inputContainerBorderStyle,
            inputContainerStyle
          ]}>
          {selectedItems.result.map(id =>
            renderChip(
              id,
              () => this._onChipClose(id),
              selectedItems.entities.item[id],
              chipStyle,
              chipIconStyle
            )
          )}
          <TextInput
            ref={c => (this._textInput = c)}
            {...{ ...this.defaultTextInputProps, ...otherTextInputProps }}
            disableFullscreenUI={true}
            placeholder={selectedItems.result.length ? null : placeholder}
            underlineColorAndroid="transparent"
            value={text}
            onChangeText={text => this._onChangeText(text, onChangeText)}
            onSubmitEditing={() => this._onSubmitEditing(onSubmitEditing)}
            onFocus={() => this._onFocus(onFocus)}
            onBlur={() => this._onBlur(onBlur)}
            selectionColor={tintColor}
            style={textInputStyle}
          />
        </View>
        {autoReflow && (
          <Text style={hiddenTextStyle} onLayout={this._onLayout}>
            {text}
          </Text>
        )}
        {!!error && (
          <Text style={[styles.helper, { color: errorColor }]}>{error}</Text>
        )}
        {middleComponent}
        {this._renderItems()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
