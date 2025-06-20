// Tela de cadastro de novo usuário
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import styles from '../styles/styles.js';
import { addUser } from '../database';
import * as Device from 'expo-device';

// Adicione a URL da API remota
const API_URL = 'https://bikeroutes.geati.camboriu.ifc.edu.br/';

// Função para verificar se usuário já existe na API remota
async function usuarioExisteRemoto(cpf, email) {
  try {
    // Verifica por CPF
    const resCpf = await fetch(`${API_URL}/usuarios/cpf/${encodeURIComponent(cpf)}`);
    if (resCpf.ok) {
      const user = await resCpf.json();
      if (user && user.id) return true;
    }
    // Verifica por email
    const resEmail = await fetch(`${API_URL}/usuarios/email/${encodeURIComponent(email)}`);
    if (resEmail.ok) {
      const user = await resEmail.json();
      if (user && user.id) return true;
    }
  } catch (e) {
    // Se não conseguir conectar, permite cadastro local (offline)
    return false;
  }
  return false;
}

export default function CadastroScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sexo, setSexo] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  // Formata o CPF conforme o usuário digita
  const formatCpf = (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return value;
  };

  // Formata o telefone brasileiro
  const formatTelefone = (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '($1) $2');
    value = value.replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    return value;
  };

  // Formata a data de nascimento para dd/mm/aaaa
  const formatData = (value) => {
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    value = value.replace(/(\d{2})(\d)/, '$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1');
    return value;
  };

  // Realiza o cadastro do usuário
  const handleCadastro = async () => {
    if (!cpf || !nome || !telefone || !sexo || !email || !dataNascimento || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (cpf.length !== 14) {
      Alert.alert('Erro', 'CPF inválido.');
      return;
    }
    if (!/^\([1-9]{2}\) [0-9]{5}-[0-9]{4}$/.test(telefone)) {
      Alert.alert('Erro', 'Telefone inválido.');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Erro', 'Email inválido.');
      return;
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dataNascimento)) {
      Alert.alert('Erro', 'Data de nascimento inválida. Use o formato dd/mm/aaaa.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }
    // Verifica se já existe remotamente
    const existeRemoto = await usuarioExisteRemoto(cpf, email);
    if (existeRemoto) {
      Alert.alert('Erro', 'Já existe um usuário com este CPF ou email cadastrado.');
      return;
    }
    // Coleta informações do dispositivo para salvar junto ao usuário
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
        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#888"
          value={cpf}
          onChangeText={text => setCpf(formatCpf(text))}
          keyboardType="numeric"
          maxLength={14}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#888"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Nascimento (dd/mm/aaaa)"
          placeholderTextColor="#888"
          value={dataNascimento}
          onChangeText={text => setDataNascimento(formatData(text))}
          keyboardType="numeric"
          maxLength={10}
        />
        <View style={{ width: '100%', alignItems: 'flex-start', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              style={{
                backgroundColor: sexo === 'Masculino' ? '#2196F3' : '#fff',
                borderWidth: 1,
                borderColor: '#2196F3',
                borderRadius: 5,
                paddingVertical: 8,
                paddingHorizontal: 16,
                marginRight: 10,
              }}
              onPress={() => setSexo('Masculino')}
            >
              <Text style={{ color: sexo === 'Masculino' ? '#fff' : '#2196F3', fontWeight: 'bold' }}>Masculino</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: sexo === 'Feminino' ? '#E91E63' : '#fff',
                borderWidth: 1,
                borderColor: '#E91E63',
                borderRadius: 5,
                paddingVertical: 8,
                paddingHorizontal: 16,
              }}
              onPress={() => setSexo('Feminino')}
            >
              <Text style={{ color: sexo === 'Feminino' ? '#fff' : '#E91E63', fontWeight: 'bold' }}>Feminino</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          placeholderTextColor="#888"
          value={telefone}
          onChangeText={text => setTelefone(formatTelefone(text))}
          keyboardType="phone-pad"
          maxLength={15}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#888"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#888"
          secureTextEntry
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}