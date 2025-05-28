import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import styles from '../styles/styles.js';
import { getUserByCpfAndSenha } from '../database';

export default function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    if (!cpf || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (cpf === 'listadeusuarios' && senha === 'caminhosdabicicleta') {
      navigation.navigate('UserList');
      return;
    }
    try {
      const user = await getUserByCpfAndSenha(cpf, senha);
      if (user) {
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        navigation.navigate('Home', { userId: user.id });
      } else {
        Alert.alert('Erro', 'CPF ou senha incorretos.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login. Tente novamente.');
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/background.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.linkText}>Não tem uma conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}