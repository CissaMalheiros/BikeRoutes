import * as SQLite from 'expo-sqlite';

// Abrir o banco de dados de forma assíncrona
const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('ciclista.db');
};

// Criar tabelas
export const createTables = async () => {
  const db = await openDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cpf TEXT,
      nome TEXT,
      telefone TEXT,
      sexo TEXT,
      email TEXT,
      dataNascimento TEXT,
      senha TEXT,
      fabricante TEXT,
      modelo TEXT,
      serial TEXT,
      versao TEXT,
      sincronizado INTEGER DEFAULT 0
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS rotas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      tipo TEXT,
      coordenadas TEXT,
      tempo TEXT,
      sincronizado INTEGER DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES users (id)
    );
  `);

  console.log('Tabelas criadas com sucesso!');
};

// Atualizar o esquema do banco de dados
export const updateDatabaseSchema = async () => {
  const db = await openDatabase();

  // Verificar se as colunas já existem nas tabelas users e rotas
  const columnsToAddUsers = [
    { name: 'fabricante', type: 'TEXT' },
    { name: 'modelo', type: 'TEXT' },
    { name: 'serial', type: 'TEXT' },
    { name: 'versao', type: 'TEXT' },
    { name: 'sincronizado', type: 'INTEGER DEFAULT 0' },
  ];
  for (const column of columnsToAddUsers) {
    const columnExists = await db.getAllAsync(
      `PRAGMA table_info(users);`
    ).then((columns) => {
      return columns.some((col) => col.name === column.name);
    });
    if (!columnExists) {
      await db.execAsync(
        `ALTER TABLE users ADD COLUMN ${column.name} ${column.type};`
      );
      console.log(`Coluna ${column.name} adicionada na tabela users!`);
    } else {
      console.log(`Coluna ${column.name} já existe na tabela users.`);
    }
  }

  // Adicionar coluna sincronizado na tabela rotas
  const rotaSincronizadoExists = await db.getAllAsync(
    `PRAGMA table_info(rotas);`
  ).then((columns) => columns.some((col) => col.name === 'sincronizado'));
  if (!rotaSincronizadoExists) {
    await db.execAsync(
      `ALTER TABLE rotas ADD COLUMN sincronizado INTEGER DEFAULT 0;`
    );
    console.log('Coluna sincronizado adicionada na tabela rotas!');
  } else {
    console.log('Coluna sincronizado já existe na tabela rotas.');
  }
};

// Adicionar usuário com informações do dispositivo
export const addUser = async (cpf, nome, telefone, sexo, email, dataNascimento, senha, deviceInfo) => {
  const db = await openDatabase();
  await db.runAsync(
    'INSERT INTO users (cpf, nome, telefone, sexo, email, dataNascimento, senha, fabricante, modelo, serial, versao, sincronizado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)',
    [
      cpf,
      nome,
      telefone,
      sexo,
      email,
      dataNascimento,
      senha,
      deviceInfo.fabricante,
      deviceInfo.modelo,
      deviceInfo.serial,
      deviceInfo.versao,
    ]
  );
  console.log('Usuário adicionado com sucesso!');
};

// Obter todos os usuários
export const getUsers = async () => {
  const db = await openDatabase();
  const result = await db.getAllAsync('SELECT * FROM users');
  return result;
};

// Obter usuário por CPF e senha
export const getUserByCpfAndSenha = async (cpf, senha) => {
  const db = await openDatabase();
  const result = await db.getAllAsync(
    'SELECT * FROM users WHERE cpf = ? AND senha = ?',
    [cpf, senha]
  );
  return result[0]; // Retorna o primeiro usuário encontrado (ou undefined se não houver)
};

// Adicionar uma rota ao banco de dados
export const addRota = async (userId, tipo, coordenadas, tempo) => {
  const db = await openDatabase();
  await db.runAsync(
    'INSERT INTO rotas (userId, tipo, coordenadas, tempo, sincronizado) VALUES (?, ?, ?, ?, 0)',
    [userId, tipo, JSON.stringify(coordenadas), tempo]
  );
  console.log('Rota adicionada com sucesso!');
};

// Obter rotas de um usuário
export const getRotasByUserId = async (userId) => {
  const db = await openDatabase();
  const result = await db.getAllAsync(
    'SELECT * FROM rotas WHERE userId = ?',
    [userId]
  );
  return result.map((rota) => ({
    ...rota,
    coordenadas: JSON.parse(rota.coordenadas), // Converter coordenadas de volta para objeto
  }));
};

// Função para buscar usuários não sincronizados
export const getUsersNaoSincronizados = async () => {
  const db = await openDatabase();
  return await db.getAllAsync('SELECT * FROM users WHERE sincronizado = 0');
};

// Função para buscar rotas não sincronizadas
export const getRotasNaoSincronizadas = async () => {
  const db = await openDatabase();
  return await db.getAllAsync('SELECT * FROM rotas WHERE sincronizado = 0');
};

// Função para marcar usuário como sincronizado
export const marcarUserSincronizado = async (id) => {
  const db = await openDatabase();
  await db.runAsync('UPDATE users SET sincronizado = 1 WHERE id = ?', [id]);
};

// Função para marcar rota como sincronizada
export const marcarRotaSincronizada = async (id) => {
  const db = await openDatabase();
  await db.runAsync('UPDATE rotas SET sincronizado = 1 WHERE id = ?', [id]);
};

// Controle para evitar sincronizações concorrentes
let syncLock = false;

// Busca o id do usuário remoto pelo email
async function getRemoteUserIdByEmail(email) {
  try {
    const API_URL = 'http://192.168.3.127:3001';
    const res = await fetch(`${API_URL}/usuarios/email/${encodeURIComponent(email)}`);
    if (res.ok) {
      const user = await res.json();
      return user.id;
    }
  } catch (e) {
    console.log('Erro ao buscar id remoto do usuário:', e);
  }
  return null;
}

export const sincronizarComAPI = async () => {
  if (syncLock) {
    console.log('Sincronização já em andamento, ignorando chamada duplicada.');
    return;
  }
  syncLock = true;
  try {
    const API_URL = 'http://192.168.3.127:3001';
    // 1. Sincronizar usuários
    const users = await getUsersNaoSincronizados();
    console.log('Usuários não sincronizados:', users.length, users);
    for (const user of users) {
      // Envia todos os dados do usuário
      const res = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      if (res.ok) {
        await marcarUserSincronizado(user.id);
      }
    }
    // 2. Sincronizar rotas
    const rotas = await getRotasNaoSincronizadas();
    console.log('Rotas não sincronizadas:', rotas.length, rotas);
    for (const rota of rotas) {
      // Busca o usuário local
      const user = await getUsers();
      const userAtual = user.find(u => u.id === rota.userId);
      if (!userAtual) continue;
      // Busca o id remoto pelo email
      const usuario_id = await getRemoteUserIdByEmail(userAtual.email);
      if (!usuario_id) {
        console.log('Usuário remoto não encontrado para rota:', rota);
        continue;
      }
      const res = await fetch(`${API_URL}/rotas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id,
          tipo: rota.tipo,
          tempo: rota.tempo,
          coordenadas: JSON.parse(rota.coordenadas)
        })
      });
      if (res.ok) {
        await marcarRotaSincronizada(rota.id);
      }
    }
    console.log('Sincronização concluída!');
  } catch (error) {
    console.log('Erro ao sincronizar com a API:', error);
  } finally {
    syncLock = false;
  }
}

// Função utilitária para limpar o banco local (apenas para uso pontual)
export const limparBancoLocal = async () => {
  const db = await openDatabase();
  try {
    await db.execAsync('DELETE FROM rotas;');
    await db.execAsync('DELETE FROM users;');
    console.log('Banco local limpo!');
  } catch (e) {
    console.log('Erro ao limpar banco local:', e);
  }
};