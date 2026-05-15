// One-time script to hash all plain-text passwords in the Usuarios table.
// Safe to run multiple times — already-hashed passwords are skipped.
// Usage: node scripts/migrate-passwords.js

require('dotenv').config({ path: '.env.local' });

const sql = require('mssql');
const bcrypt = require('bcryptjs');

const config = {
  user: process.env.DB_USER || 'gestor_user',
  password: process.env.DB_PASSWORD || 'GestorPass123!',
  server: process.env.DB_SERVER || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  database: process.env.DB_NAME || 'GestorProyectos',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function migrate() {
  console.log('Connecting to database...');
  const pool = await sql.connect(config);

  const { recordset: users } = await pool.request().query('SELECT id, nombre_usuario, contrasena FROM Usuarios');

  console.log(`Found ${users.length} user(s).\n`);

  let updated = 0;
  let skipped = 0;

  for (const user of users) {
    const alreadyHashed = user.contrasena.startsWith('$2a$') || user.contrasena.startsWith('$2b$');

    if (alreadyHashed) {
      console.log(`  [SKIP] ${user.nombre_usuario} — already hashed`);
      skipped++;
      continue;
    }

    const hashed = await bcrypt.hash(user.contrasena, 10);

    await pool
      .request()
      .input('id', sql.Int, user.id)
      .input('contrasena', sql.VarChar, hashed)
      .query('UPDATE Usuarios SET contrasena = @contrasena WHERE id = @id');

    console.log(`  [OK]   ${user.nombre_usuario} — password hashed`);
    updated++;
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
  await pool.close();
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
