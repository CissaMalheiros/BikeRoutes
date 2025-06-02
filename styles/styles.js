import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Fundos
  background: {
    flex: 1,
    resizeMode: 'cover',
  },

  // Containers gerais
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Títulos e textos principais
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  homeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    marginBottom: 10,
    textAlign: 'center',
  },
  homeSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    textAlign: 'center',
  },

  // Inputs
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    color: '#222', // Garante texto escuro no input
  },

  // Botões
  button: {
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 10, // Adiciona espaçamento inferior entre botões
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  linkText: {
    color: '#FF6B6B',
    marginTop: 15,
    textAlign: 'center',
  },

  // Botões Home
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

  // Rastreamento e mapa
  map: {
    flex: 1,
    minHeight: 250,
    borderRadius: 10,
    marginBottom: 10,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  buttonContainer: {
    flexDirection: 'column', // Deixa os botões em coluna
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    gap: 10, // Espaço entre os botões (React Native >= 0.71)
  },

  // Resumo do trajeto
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
    color: '#222',
  },
  miniMap: {
    width: '100%',
    height: 450, // Aumentado para melhor visualização do trajeto
    marginBottom: 20,
    borderRadius: 10,
  },
  summaryText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#222',
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

  // Lista de usuários e rotas
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
    fontSize: 14,
    marginBottom: 3,
    color: '#222',
  },
  noUsersText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#222',
  },
  rotasContainer: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#222',
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
    color: '#222',
  },
  noRotasText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#222',
  },
});