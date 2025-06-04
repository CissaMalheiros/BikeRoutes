// Tela administrativa para listar usuários e visualizar rotas de cada um
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styles from '../styles/styles.js';
import { getUsers, getRotasByUserId } from '../database';

export default function UserListScreen() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [rotas, setRotas] = useState([]);

  // Carrega a lista de usuários ao abrir a tela
  useEffect(() => {
    const loadUsers = async () => {
      const userList = await getUsers();
      setUsers(userList);
    };
    loadUsers();
  }, []);

  // Carrega as rotas do usuário selecionado
  useEffect(() => {
    if (selectedUserId) {
      const loadRotas = async () => {
        const rotasList = await getRotasByUserId(selectedUserId);
        setRotas(rotasList);
      };
      loadRotas();
    }
  }, [selectedUserId]);

  // Renderiza cada usuário da lista
  const renderUserItem = ({ item }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => setSelectedUserId(item.id)}>
      <Text style={styles.userText}>ID: {item.id}</Text>
      <Text style={styles.userText}>Nome: {item.nome}</Text>
      <Text style={styles.userText}>CPF: {item.cpf}</Text>
      <Text style={styles.userText}>Telefone: {item.telefone}</Text>
      <Text style={styles.userText}>Sexo: {item.sexo}</Text>
      <Text style={styles.userText}>Email: {item.email}</Text>
      <Text style={styles.userText}>Data de Nascimento: {item.dataNascimento}</Text>
      <Text style={styles.userText}>Fabricante: {item.fabricante}</Text>
      <Text style={styles.userText}>Modelo: {item.modelo}</Text>
      <Text style={styles.userText}>Serial: {item.serial}</Text>
      <Text style={styles.userText}>Versão: {item.versao}</Text>
    </TouchableOpacity>
  );

  // Renderiza cada rota do usuário selecionado
  const renderRotaItem = ({ item }) => (
    <View style={styles.rotaItem}>
      <Text style={styles.rotaText}>Tipo: {item.tipo}</Text>
      <Text style={styles.rotaText}>Tempo: {item.tempo}</Text>
      <Text style={styles.rotaText}>Coordenadas: {item.coordenadas.length} pontos</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: '#000000' }]}>Lista de Usuários</Text>
      {users.length > 0 ? (
        <FlatList data={users} renderItem={renderUserItem} keyExtractor={(item) => item.id.toString()} />
      ) : (
        <Text style={styles.noUsersText}>Nenhum usuário cadastrado.</Text>
      )}
      {selectedUserId && (
        <View style={styles.rotasContainer}>
          <Text style={styles.subtitle}>Rotas do Usuário</Text>
          {rotas.length > 0 ? (
            <FlatList data={rotas} renderItem={renderRotaItem} keyExtractor={(item) => item.id.toString()} />
          ) : (
            <Text style={styles.noRotasText}>Nenhuma rota registrada.</Text>
          )}
        </View>
      )}
    </View>
  );
}