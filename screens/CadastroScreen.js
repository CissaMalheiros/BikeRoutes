import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import styles from '../styles/styles.js';
import { addUser } from '../database';
import * as Device from 'expo-device';

export default function CadastroScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sexo, setSexo] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {
    if (!cpf || !nome || !telefone || !sexo || !email || !dataNascimento || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    const deviceInfo = {
      fabricante: Device.manufacturer || 'Desconhecido',
      modelo: Device.modelName || 'Desconhecido',
      serial: Device.serial || 'Desconhecido',
      versao: Device.osVersion || 'Desconhecido',
    };
    try {
      await addUser(cpf, nome, telefone, sexo, email, dataNascimento, senha, deviceInfo);
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o usuário. Tente novamente.');
      console.error('Erro ao cadastrar usuário:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/background2.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} />
        <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
        <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} />
        <TextInput style={styles.input} placeholder="Sexo" value={sexo} onChangeText={setSexo} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Data de Nascimento" value={dataNascimento} onChangeText={setDataNascimento} />
        <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={senha} onChangeText={setSenha} />
        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}