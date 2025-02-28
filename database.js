import * as SQLite from 'expo-sqlite';

// Abrir o banco de dados de forma assíncrona
const openDatabase = async () => {
  return await SQLite.openDatabaseAsync('ciclista.db');
};

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
      senha TEXT
    );
  `);
  console.log('Tabela criada com sucesso!');
};

export const addUser = async (cpf, nome, telefone, sexo, email, dataNascimento, senha) => {
  const db = await openDatabase();
  await db.runAsync(
    'INSERT INTO users (cpf, nome, telefone, sexo, email, dataNascimento, senha) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [cpf, nome, telefone, sexo, email, dataNascimento, senha]
  );
  console.log('Usuário adicionado com sucesso!');
};

export const getUsers = async () => {
  const db = await openDatabase();
  const result = await db.getAllAsync('SELECT * FROM users');
  return result;
};

export const getUserByCpfAndSenha = async (cpf, senha) => {
  const db = await openDatabase();
  const result = await db.getAllAsync(
    'SELECT * FROM users WHERE cpf = ? AND senha = ?',
    [cpf, senha]
  );
  return result[0]; // Retorna o primeiro usuário encontrado (ou undefined se não houver)
};