import Constants from 'expo-constants';
import {StatusBar} from 'expo-status-bar';
import React, {useState} from 'react';
import {Text, TextInput, View} from 'react-native';

import {usePrivy, useLoginWithEmail, useOAuthFlow} from '@privy-io/expo';

import {Button} from './Button';
import {styles} from './styles';

export const LoginScreen = () => {
  const [email, setEmail] = useState(Constants.expoConfig?.extra?.email || '');
  const [code, setCode] = useState('');

  const {user} = usePrivy();
  const emailFlow = useLoginWithEmail();
  const oauth = useOAuthFlow();

  if (user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <Text style={{color: 'rgba(0,0,0,0.4)', marginVertical: 10}}>
        (OTP state: <Text style={{color: 'blue'}}>{emailFlow.state.status}</Text>)
      </Text>
      <StatusBar style="auto" />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
        inputMode="email"
      />
      <Button
        loading={emailFlow.state.status === 'sending-code'}
        onPress={() => emailFlow.sendCode({email})}
      >
        Send Code
      </Button>

      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="Code"
        style={styles.input}
        inputMode="numeric"
      />
      <Button
        loading={emailFlow.state.status === 'submitting-code'}
        disabled={emailFlow.state.status !== 'awaiting-code-input'}
        onPress={() => emailFlow.loginWithCode({code})}
      >
        Login
      </Button>

      <View style={{display: 'flex', flexDirection: 'row', gap: 5, margin: 10}}>
        {(['github', 'google', 'discord', 'apple'] as const).map((provider) => (
          <View key={provider}>
            <Button
              disabled={oauth.state.status === 'loading'}
              loading={oauth.state.status === 'loading'}
              onPress={() => oauth.start({provider})}
            >
              {`Login with ${provider}`}
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
};
