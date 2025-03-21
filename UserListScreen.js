import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getUsers, getRotasByUserId } from './database'; // Importar funções do banco de dados

export default function UserListScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [rotas, setRotas] = useState([]);

  // Carregar os usuários ao abrir a tela
  useEffect(() => {
    const loadUsers = async () => {
      const userList = await getUsers();
      setUsers(userList);
    };

    loadUsers();
  }, []);

  // Carregar as rotas do usuário selecionado
  useEffect(() => {
    if (selectedUserId) {
      const loadRotas = async () => {
        const rotasList = await getRotasByUserId(selectedUserId);
        setRotas(rotasList);
      };

      loadRotas();
    }
  }, [selectedUserId]);

  // Renderizar cada item da lista de usuários
  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => setSelectedUserId(item.id)}
    >
      <Text style={styles.userText}>ID: {item.id}</Text>
      <Text style={styles.userText}>Nome: {item.nome}</Text>
      <Text style={styles.userText}>CPF: {item.cpf}</Text>
    </TouchableOpacity>
  );

  // Renderizar cada item da lista de rotas
  const renderRotaItem = ({ item }) => (
    <View style={styles.rotaItem}>
      <Text style={styles.rotaText}>Tipo: {item.tipo}</Text>
      <Text style={styles.rotaText}>Tempo: {item.tempo}</Text>
      <Text style={styles.rotaText}>Coordenadas: {item.coordenadas.length} pontos</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Usuários</Text>
      {users.length > 0 ? (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <Text style={styles.noUsersText}>Nenhum usuário cadastrado.</Text>
      )}

      {selectedUserId && (
        <View style={styles.rotasContainer}>
          <Text style={styles.subtitle}>Rotas do Usuário</Text>
          {rotas.length > 0 ? (
            <FlatList
              data={rotas}
              renderItem={renderRotaItem}
              keyExtractor={(item) => item.id.toString()}
            />
          ) : (
            <Text style={styles.noRotasText}>Nenhuma rota registrada.</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  userItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
  noUsersText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  rotasContainer: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rotaItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  rotaText: {
    fontSize: 16,
    marginBottom: 5,
  },
  noRotasText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});