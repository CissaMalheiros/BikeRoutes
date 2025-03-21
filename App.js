import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, TextInput, FlatList, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createTables, updateDatabaseSchema, addUser, getUsers, getUserByCpfAndSenha, addRota, getRotasByUserId } from './database';
import * as Device from 'expo-device';

const Stack = createStackNavigator();

// Tela de Boas-Vindas
function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground source={require('./assets/background2.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Bem-vindo ao CiclistaApp</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Cadastro')}>
          <Text style={styles.buttonText}>Cadastro</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

// Tela de Login
function LoginScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      // Verifica se os campos foram preenchidos
      if (!cpf || !senha) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
      }

      // Verifica se é o login de desenvolvedor
      if (cpf === 'listadeusuarios' && senha === 'caminhosdabicicleta') {
        navigation.navigate('UserList'); // Redireciona para a lista de usuários
        return;
      }

      // Busca o usuário no banco de dados
      const user = await getUserByCpfAndSenha(cpf, senha);

      if (user) {
        // Se o usuário for encontrado, navega para a tela inicial (Home)
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        navigation.navigate('Home', { userId: user.id }); // Passa o userId para a HomeScreen
      } else {
        // Se o usuário não for encontrado, exibe uma mensagem de erro
        Alert.alert('Erro', 'CPF ou senha incorretos.');
      }
    } catch (error) {
      // Exibe uma mensagem de erro caso algo dê errado
      Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login. Tente novamente.');
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <ImageBackground source={require('./assets/background.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="CPF"
          value={cpf}
          onChangeText={setCpf}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
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

// Tela de Cadastro
function CadastroScreen({ navigation }) {
  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [sexo, setSexo] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [senha, setSenha] = useState('');

  const handleCadastro = async () => {
    try {
      // Verifica se todos os campos foram preenchidos
      if (!cpf || !nome || !telefone || !sexo || !email || !dataNascimento || !senha) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos.');
        return;
      }

      // Obtém as informações do dispositivo
      const deviceInfo = {
        fabricante: Device.manufacturer || 'Desconhecido',
        modelo: Device.modelName || 'Desconhecido',
        serial: Device.serial || 'Desconhecido',
        versao: Device.osVersion || 'Desconhecido',
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
        />
        <TextInput
          style={styles.input}
          placeholder="Data de Nascimento"
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

// Tela Inicial (Home)
function HomeScreen({ route, navigation }) {
  const { userId } = route.params; // Receber userId como parâmetro
  const [showHome, setShowHome] = useState(true);
  const [routeType, setRouteType] = useState(null);

  const startTracking = (type) => {
    setRouteType(type);
    setShowHome(false);
    navigation.navigate('Tracking', { routeType: type, userId });
  };

  return (
    <ImageBackground
      source={require('./assets/background.jpg')}
      style={styles.homeContainer}
    >
      <Text style={styles.homeTitle}>Bike Tracker</Text>
      <Text style={styles.homeSubtitle}>Registre suas rotas de ciclismo</Text>
      <TouchableOpacity style={styles.homeButton} onPress={() => startTracking('trabalho')}>
        <Text style={styles.homeButtonText}>Trabalho</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeButton} onPress={() => startTracking('escola')}>
        <Text style={styles.homeButtonText}>Escola</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeButton} onPress={() => startTracking('casa')}>
        <Text style={styles.homeButtonText}>Casa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.homeButton} onPress={() => startTracking('passeio')}>
        <Text style={styles.homeButtonText}>Passeio</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

// Tela de Rastreamento
function TrackingScreen({ route, navigation }) {
  const { routeType, userId } = route.params; // Receber routeType e userId como parâmetros
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const timerRef = useRef(null);
  const mapRef = useRef(null);
  const locationSubscription = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }
    })();
  }, []);

  useEffect(() => {
    if (isTracking && !isPaused) {
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (newLocation) => {
          setLocation(newLocation);
          setRouteCoords((prevRoute) => [...prevRoute, newLocation]);

          if (mapRef.current) {
            mapRef.current.animateToRegion({
              latitude: newLocation.coords.latitude,
              longitude: newLocation.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }
      ).then(subscription => {
        locationSubscription.current = subscription;
      });
    } else if (!isTracking || isPaused) {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    }
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    };
  }, [isTracking, isPaused]);

  useEffect(() => {
    if (isTracking && !isPaused) {
      timerRef.current = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (!isTracking || isPaused) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTracking, isPaused]);

  const startTracking = () => {
    setIsTracking(true);
    setIsPaused(false);
  };

  const pauseTracking = () => {
    setIsPaused(true);
  };

  const stopTracking = async () => {
    setIsTracking(false);
    setIsPaused(false);
    setShowSummary(true);

    // Salvar a rota no banco de dados
    await addRota(userId, routeType, routeCoords, formatTime(seconds));
  };

  const resetTracking = () => {
    setSeconds(0);
    setRouteCoords([]);
    setShowSummary(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  let text = 'Aguardando...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.coords.latitude.toFixed(6)}, Longitude: ${location.coords.longitude.toFixed(6)}`;
  }

  if (showSummary) {
    return (
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Resumo do Trajeto</Text>
        <Text style={styles.summaryText}>Tipo de Trajeto: {routeType}</Text>
        <MapView
          style={styles.miniMap}
          region={{
            latitude: routeCoords.length > 0 ? routeCoords[0].coords.latitude : -23.5505,
            longitude: routeCoords.length > 0 ? routeCoords[0].coords.longitude : -46.6333,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          {routeCoords.length > 0 && (
            <>
              <Marker coordinate={routeCoords[routeCoords.length - 1].coords} />
              <Polyline
                coordinates={routeCoords.map((loc) => loc.coords)}
                strokeColor="#FF6B6B"
                strokeWidth={4}
              />
            </>
          )}
        </MapView>
        <Text style={styles.summaryText}>Tempo total: {formatTime(seconds)}</Text>
        <TouchableOpacity style={styles.summaryButton} onPress={resetTracking}>
          <Text style={styles.summaryButtonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={{
          latitude: location ? location.coords.latitude : -23.5505,
          longitude: location ? location.coords.longitude : -46.6333,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        customMapStyle={mapStyle}
      >
        {location && <Marker coordinate={location.coords} />}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords.map((loc) => loc.coords)}
            strokeColor="#FF6B6B"
            strokeWidth={4}
          />
        )}
      </MapView>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>{text}</Text>
        <Text style={styles.timerText}>Tempo de percurso: {formatTime(seconds)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isTracking && !isPaused ? styles.buttonDisabled : null]}
          onPress={startTracking}
          disabled={isTracking && !isPaused}
        >
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isTracking || isPaused ? styles.buttonDisabled : null]}
          onPress={pauseTracking}
          disabled={!isTracking || isPaused}
        >
          <Text style={styles.buttonText}>Pausar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, !isTracking ? styles.buttonDisabled : null]}
          onPress={stopTracking}
          disabled={!isTracking}
        >
          <Text style={styles.buttonText}>Parar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Tela de Lista de Usuários
function UserListScreen() {
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
      <Text style={[styles.title, { color: '#000000' }]}>Lista de Usuários</Text>
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

const mapStyle = [
  // ... (mantenha o mesmo estilo do mapa)
];

// Estilos
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
  linkText: {
    color: '#FF6B6B',
    marginTop: 15,
    textAlign: 'center',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  homeSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  homeButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 25,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  summaryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  miniMap: {
    width: '100%',
    height: '40%',
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 20,
  },
  summaryButton: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 25,
    width: '50%',
    alignItems: 'center',
    marginTop: 10,
  },
  summaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
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
  fontSize: 14, // Reduza o tamanho da fonte se necessário
  marginBottom: 3, // Ajuste o espaçamento entre as linhas
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

// Inicialização do App
export default function App() {
  useEffect(() => {
    // Inicializar o banco de dados
    const initializeDatabase = async () => {
      await createTables(); // Criar tabelas se não existirem
      await updateDatabaseSchema(); // Atualizar esquema se necessário
    };

    initializeDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={CadastroScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Tracking" component={TrackingScreen} />
        <Stack.Screen name="UserList" component={UserListScreen} options={{ title: 'Lista de Usuários' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}