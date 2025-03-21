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
      versao TEXT
    );
  `);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS rotas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      tipo TEXT,
      coordenadas TEXT,
      tempo TEXT,
      FOREIGN KEY (userId) REFERENCES users (id)
    );
  `);

  console.log('Tabelas criadas com sucesso!');
};

// Atualizar o esquema do banco de dados
export const updateDatabaseSchema = async () => {
  const db = await openDatabase();

  // Verificar se as colunas já existem
  const columnsToAdd = [
    { name: 'fabricante', type: 'TEXT' },
    { name: 'modelo', type: 'TEXT' },
    { name: 'serial', type: 'TEXT' },
    { name: 'versao', type: 'TEXT' },
  ];

  for (const column of columnsToAdd) {
    const columnExists = await db.getAllAsync(
      `PRAGMA table_info(users);`
    ).then((columns) => {
      return columns.some((col) => col.name === column.name);
    });

    if (!columnExists) {
      await db.execAsync(
        `ALTER TABLE users ADD COLUMN ${column.name} ${column.type};`
      );
      console.log(`Coluna ${column.name} adicionada com sucesso!`);
    } else {
      console.log(`Coluna ${column.name} já existe.`);
    }
  }
};

// Adicionar usuário com informações do dispositivo
export const addUser = async (cpf, nome, telefone, sexo, email, dataNascimento, senha, deviceInfo) => {
  const db = await openDatabase();
  await db.runAsync(
    'INSERT INTO users (cpf, nome, telefone, sexo, email, dataNascimento, senha, fabricante, modelo, serial, versao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
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
    'INSERT INTO rotas (userId, tipo, coordenadas, tempo) VALUES (?, ?, ?, ?)',
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