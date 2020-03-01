import React, { useState, useRef, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, Button } from 'react-native';
import EmailField from './components/email-field';

export interface Item {
  email: string;
  name: string;
  initials: string;
}

const items: Item[] = [
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
];

const App = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const childEmailFieldRef = useRef<any>(null);
  const cancelMessageInterval = useRef<number>(0);

  const handleSubmitEditing = useCallback(
    (enabled: boolean) => {
      setIsEnabled(enabled);
    },
    [setIsEnabled]
  );

  const handleChipClose = useCallback(
    (enabled: boolean) => {
      setIsEnabled(enabled);
    },
    [setIsEnabled]
  );

  const handleSendPress = () => {
    if (childEmailFieldRef.current) {
      childEmailFieldRef.current.blur();
      setTimeout(() => {
        if (childEmailFieldRef.current) {
          const emailSentMessage = `Emails sent!\n\n${childEmailFieldRef.current
            .getSelectedItems()
            .result.join('\n')}`;

          clearInterval(cancelMessageInterval.current);
          setMessage(emailSentMessage);
          cancelMessageInterval.current = setTimeout(() => {
            setMessage('');
          }, 2000);
        }
      });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.root}
      keyboardShouldPersistTaps="always">
      <View>
        <EmailField
          ref={childEmailFieldRef}
          itemId="email"
          items={items}
          onSubmitEditing={handleSubmitEditing}
          onChipClose={handleChipClose}
        />
        <View style={styles.button}>
          <Button
            color="#028fb0"
            disabled={!isEnabled}
            onPress={handleSendPress}
            title="SEND"
          />
        </View>
      </View>
      <Text style={styles.message}>{message}</Text>
    </ScrollView>
  );
};

export default App;

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
