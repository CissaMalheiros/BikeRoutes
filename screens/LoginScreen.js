import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/styles.js';
import { getUserByCpfAndSenha, addUser } from '../database';

// Adicione a URL da API remota
const API_URL = 'https://bikeroutes.geati.camboriu.ifc.edu.br/';

// Função para autenticar usuário na API remota
async function autenticarRemoto(cpf, senha) {
  try {
    const res = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cpf, senha })
    });
    if (res.ok) {
      const user = await res.json();
      return user;
    }
  } catch (e) {
    // Falha de conexão, retorna null
    return null;
  }
  return null;
}

export default function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [showSenha, setShowSenha] = useState(false);

  React.useEffect(() => {
    // Recupera o último CPF salvo para facilitar o login do usuário
    AsyncStorage.getItem('ultimoCPF').then((value) => {
      if (value) setCpf(value);
    });
  }, []);

  // Formata o CPF conforme o usuário digita
  const formatCpf = (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
  };

  // Realiza o login do usuário
  const handleLogin = async () => {
    if (!cpf || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    try {
      let user = await getUserByCpfAndSenha(cpf, senha);
      if (user) {
        await AsyncStorage.setItem('ultimoCPF', cpf);
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        navigation.navigate('Home', { userId: user.id });
      } else {
        // Tenta login remoto
        const userRemoto = await autenticarRemoto(cpf, senha);
        if (userRemoto && userRemoto.id) {
          // Salva usuário remoto no banco local para permitir login offline depois
          // Adapta os campos conforme necessário
          await addUser(
            userRemoto.cpf,
            userRemoto.nome,
            userRemoto.telefone,
            userRemoto.sexo,
            userRemoto.email,
            userRemoto.dataNascimento,
            senha, // salva a senha digitada
            {
              fabricante: userRemoto.fabricante || 'Remoto',
              modelo: userRemoto.modelo || 'Remoto',
              serial: userRemoto.serial || 'Remoto',
              versao: userRemoto.versao || 'Remoto'
            }
          );
          // Busca novamente localmente para pegar o id local
          user = await getUserByCpfAndSenha(cpf, senha);
          await AsyncStorage.setItem('ultimoCPF', cpf);
          Alert.alert('Sucesso', 'Login realizado com sucesso!');
          navigation.navigate('Home', { userId: user.id });
        } else {
          Alert.alert('Erro', 'CPF ou senha incorretos.');
        }
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
        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#888"
          value={cpf}
          onChangeText={text => setCpf(formatCpf(text))}
          keyboardType="numeric"
          maxLength={14}
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Senha"
            placeholderTextColor="#888"
            secureTextEntry={!showSenha}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity onPress={() => setShowSenha(!showSenha)} style={{ position: 'absolute', right: 10 }}>
            <Text style={{ color: '#2196F3', fontWeight: 'bold', fontSize: 16 }}>
              {showSenha ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>
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