# BikeRoutes

BikeRoutes é um aplicativo móvel desenvolvido para ciclistas, permitindo registrar, visualizar e sincronizar rotas de ciclismo, com cadastro de usuários e integração com banco de dados local (SQLite) e remoto (PostgreSQL via API).

## Funcionalidades

- **Cadastro de Usuário**: Cadastro com CPF, nome, telefone, sexo, email, data de nascimento, senha e informações do dispositivo.
- **Login de Usuário**: Login por CPF e senha, com salvamento do último CPF utilizado.
- **Registro de Rotas**: Registra rotas de ciclismo por tipo (trabalho, escola, casa, passeio), armazena coordenadas e tempo do trajeto.
- **Visualização de Rotas**: Exibe rotas registradas em um mapa interativo (Leaflet/OpenStreetMap).
- **Resumo de Trajeto**: Mostra resumo do trajeto após o término do registro.
- **Lista de Usuários e Rotas**: Tela administrativa para listar usuários e visualizar rotas de cada um.
- **Sincronização Automática e Manual**: Sincroniza dados locais com a API remota sempre que houver conexão com a internet ou manualmente.
- **Validação de Dados**: Validação de CPF, telefone, email e data de nascimento no cadastro.

## Tecnologias Utilizadas

- **React Native** (Expo)
- **SQLite** (expo-sqlite)
- **React Navigation**
- **Expo Location**
- **React Native Maps** e **Leaflet** (via WebView)
- **@react-native-async-storage/async-storage**
- **@react-native-community/netinfo** (detecção de conexão)
- **Integração com API Node.js/Express/PostgreSQL**

## Estrutura do Projeto

- `App.js`: Inicialização do app, navegação e sincronização.
- `database/index.js`: Lógica de banco local, sincronização e utilitários.
- `screens/`: Telas do app (Cadastro, Login, Home, Tracking, UserList, Welcome).
- `navigation/StackNavigator.js`: Navegação entre telas.
- `styles/styles.js`: Estilos globais.
- `utils/format.js`: Funções utilitárias de formatação.
- `assets/`: Imagens e ícones.
- `package.json`: Dependências e scripts.

## Instalação

1. Clone o repositório ou copie a pasta `CiclistaApp` para seu ambiente local.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o aplicativo:

   ```bash
   npx expo start
   ```

## Uso

- Abra o app no emulador Android/iOS ou dispositivo físico.
- Na tela de boas-vindas, escolha "Login" ou "Cadastro".
- Após login, escolha o tipo de trajeto para registrar.
- Durante o trajeto, o app registra localização e exibe a rota no mapa.
- Ao finalizar, um resumo é exibido.
- A sincronização com o banco remoto ocorre automaticamente ao ficar online ou manualmente pelo botão na tela inicial.

## Sincronização com API

- O app armazena dados localmente e sincroniza com a API remota (Node.js/Express/PostgreSQL) quando possível.
- Sincroniza usuários e rotas, incluindo todas as coordenadas do trajeto.
- A URL da API pode ser ajustada em `database/index.js`.

## Scripts Úteis

- `npm start` — Inicia o projeto Expo.
- `npm run android` — Inicia no emulador Android.
- `npm run ios` — Inicia no emulador iOS.
- `npm run web` — Inicia no navegador.

## Observações

- O app utiliza permissões de localização em foreground e background.
- O projeto está pronto para integração com a API BikeRoutes.

---

Desenvolvido para integração com a API BikeRoutes e banco de dados remoto PostgreSQL.
