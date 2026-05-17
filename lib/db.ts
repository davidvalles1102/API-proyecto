import * as sql from 'mssql';

const config: sql.config = {
  user: process.env.DB_USER ?? 'gestor_user',
  password: process.env.DB_PASSWORD ?? 'GestorPass123!',
  server: process.env.DB_SERVER ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '1433', 10),
  database: process.env.DB_NAME ?? 'GestorProyectos',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
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
