import React from 'react';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import EmailField from './components/email-field';

export default class App extends React.Component {
  static defaultProps = {
    items: [
      {
        email: 'JohnDoe@gmail.com',
        name: 'John Doe',
        initials: 'JD'
      },
      {
        email: 'RubenRizzi@fakemail.it',
        name: 'Ruben Rizzi',
        initials: 'RR'
      },
      {
        email: 'KileMeher@yopmail.com',
        name: 'Kile Meher',
        initials: 'KM'
      },
      {
        email: 'FabianPiau@badmail.fr',
        name: 'Fabian Piau',
        initials: 'FP'
      },
      {
        email: 'SanjeBuma@gianni.it',
        name: 'Sanje Buma',
        initials: 'SB'
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      isEnabled: false,
      message: ''
    };
  }

  checkIsEnabled(isEnabled) {
    this.setState({ isEnabled });
  }

  onSendPress = () => {
    this._emailField.blur();
    setTimeout(() => {
      if (!this._emailField.isErrored()) {
        const message = `Emails sent!\n\n${this._emailField.getSelectedEmails().join('\n')}`;

        clearInterval(this.cancelMessage);
        this.setState({ message });
        this.cancelMessage = setTimeout(() => {
          this.setState({ message: '' });
        }, 2000);
      }
    });
  };

  render() {
    const { items } = this.props;
    const { isEnabled, message } = this.state;

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        style={styles.root}
        keyboardShouldPersistTaps="always">
        <View>
          <EmailField
            ref={c => this._emailField = c}
            itemId="email"
            items={items}
            onSubmitEditing={isEnabled => this.checkIsEnabled(isEnabled)}
            onChipClose={isEnabled => this.checkIsEnabled(isEnabled)}
          />
          <View style={styles.button}>
            <Button
              color="#028fb0"
              disabled={!isEnabled}
              onPress={this.onSendPress}
              title="SEND"
            />
          </View>
        </View>
        <Text style={styles.message}>
          {message}
        </Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  root: {
    flex: 1,
    backgroundColor: '#7bdbf2',
    padding: 20
  },
  button: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff'
  },
  message: {
    justifyContent: 'flex-end',
    alignItems: 'center',

    color: 'rgba(0, 0, 0, 0.54)'
  }
});
