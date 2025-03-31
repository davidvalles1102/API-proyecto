// lib/db.ts
import * as sql from 'mssql';

// Función para verificar las variables de entorno
function getEnvVar(variable: string): string {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Environment variable ${variable} is not defined`);
  }
  return value;
}

const config: sql.config = {
  user: getEnvVar('DB_USER'), // Lanza error si no está definido
  password: getEnvVar('DB_PASSWORD'),
  server: getEnvVar('DB_SERVER'),
  database: getEnvVar('DB_NAME'),
  options: {
    encrypt: true,
    trustServerCertificate: false,
  }
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection() {
  if (!pool) {
    try {
      pool = await sql.connect(config);
      console.log('Connected to SQL Server');
    } catch (err) {
      console.error('Database connection failed:', err);
      throw err;
    }
  }
  return pool;
}