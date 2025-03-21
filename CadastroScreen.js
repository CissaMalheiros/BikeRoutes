import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { addUser } from './database'; // Importar a função addUser
import * as Device from 'expo-device'; // Importar expo-device para obter informações do dispositivo

export default function CadastroScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sexo, setSexo] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');

  const validateCPF = (cpf) => {
    const cpfRegex = /^\d{11}$/;
    return cpfRegex.test(cpf);
  };

  const validateNome = (nome) => {
    const nomeRegex = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
    return nomeRegex.test(nome);
  };

  const validateTelefone = (telefone) => {
    const telefoneRegex = /^\d{10,11}$/;
    return telefoneRegex.test(telefone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateDataNascimento = (data) => {
    const dataRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    return dataRegex.test(data);
  };

  const handleCadastro = async () => {
    try {
      // Verifica se todos os campos foram preenchidos
      if (!cpf || !nome || !telefone || !sexo || !email || !dataNascimento || !senha) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
      }

      // Validações
      if (!validateCPF(cpf)) {
        Alert.alert('Erro', 'CPF inválido. Deve conter exatamente 11 números.');
        return;
      }

      if (!validateNome(nome)) {
        Alert.alert('Erro', 'Nome inválido. Deve conter apenas letras.');
        return;
      }

      if (!validateTelefone(telefone)) {
        Alert.alert('Erro', 'Telefone inválido. Deve conter 10 ou 11 números.');
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert('Erro', 'Email inválido.');
        return;
      }

      if (!validateDataNascimento(dataNascimento)) {
        Alert.alert('Erro', 'Data de nascimento inválida. Use o formato dd/MM/yyyy.');
        return;
      }

      // Coletar informações do dispositivo
      const deviceInfo = {
        fabricante: Device.manufacturer,
        modelo: Device.modelName,
        serial: Device.osBuildId,
        versao: Device.osVersion,
      };

      // Adiciona o usuário ao banco de dados
      await addUser(cpf, nome, telefone, sexo, email, dataNascimento, senha, deviceInfo);

      // Exibe uma mensagem de sucesso
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');

      // Navega para a tela de login
      navigation.navigate('Login');
    } catch (error) {
      // Exibe uma mensagem de erro caso algo dê errado
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o usuário. Tente novamente.');
      console.error('Erro ao cadastrar usuário:', error);
    }
  };

  return (
    <ImageBackground source={require('./assets/background2.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
          maxLength={11}
        />
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Telefone"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Sexo"
          value={sexo}
          onChangeText={setSexo}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Nascimento (dd/MM/yyyy)"
          value={dataNascimento}
          onChangeText={setDataNascimento}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  button: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});