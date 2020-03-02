declare module 'react-native-material-selectize' {
  import { Component, ReactNode } from 'react';
  import {
    StyleProp,
    ViewStyle,
    TextStyle,
    TextInputProps,
    ImageStyle
  } from 'react-native';

  type ItemIdObj<ItemId extends string> = { [K in ItemId]: string };

  type OverriddenTextInputProps = Omit<
    TextInputProps,
    'onChangeText' | 'onSubmitEditing' | 'onFocus' | 'onBlur'
  > &
    Partial<{
      onChangeText: (text: string) => boolean;
      onSubmitEditing: (text: string) => boolean | undefined;
      onFocus: (text: string) => void;
      onBlur: (text: string) => void;
    }>;

  export interface SelectizeProps<ItemId extends string, Item> {
    chipStyle?: StyleProp<ViewStyle>;
    chipIconStyle?: StyleProp<ViewStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    inputContainerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    listStyle?: StyleProp<ViewStyle>;
    listRowStyle?: StyleProp<ViewStyle>;
    itemId?: ItemId;
    items?: (Item & ItemIdObj<ItemId>)[];
    selectedItems?: (Item & ItemIdObj<ItemId>)[];
    label?: string;
    error?: string;
    errorColor?: string;
    tintColor?: string;
    baseColor?: string;
    showItems?: 'onFocus' | 'onTyping' | 'always' | 'never';
    autoReflow?: boolean;
    trimOnSubmit?: boolean;
    renderRow?: (
      itemId: ItemId,
      onPress: () => void,
      item: Item & ItemIdObj<ItemId>,
      style: StyleProp<ViewStyle>
    ) => ReactNode;
    renderChip?: (
      itemId: ItemId,
      onClose: () => void,
      item: Item & ItemIdObj<ItemId>,
      chipStyle: StyleProp<ViewStyle>,
      chipIconStyle: StyleProp<ImageStyle>
    ) => ReactNode;
    textInputProps?: OverriddenTextInputProps;
    middleComponent?: ReactNode;
    filterOnKey?: string;
    onChangeSelectedItems?: (
      selectedItems: (Item & ItemIdObj<ItemId>)[]
    ) => void;
  }

  class Selectize<ItemId extends string, Item> extends Component<
    SelectizeProps<ItemId, Item>
  > {
    focus: () => void;
    blur: () => void;
    submit: () => void;
    getValue: () => string;
    getSelectedItems: () => {
      result: string[];
      entities: { item: { [key: string]: Item } };
    };
    clearSelectedItems: () => void;
  }

  export interface ChipProps {
    iconStyle?: StyleProp<ImageStyle>;
    onClose?: () => void;
    text?: string;
    style?: StyleProp<ViewStyle>;
  }

  class Chip extends Component<ChipProps> {}

  export { Chip, Selectize };
}
