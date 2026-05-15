import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';
import { getEnvVar } from '../../../lib/auth';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { nombre_usuario, contrasena } = await req.json();

  if (!nombre_usuario || !contrasena) {
    return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400 });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('nombre_usuario', nombre_usuario)
      .query(`
        SELECT u.nombre_usuario, u.contrasena, r.nombre as rol
        FROM Usuarios u
        INNER JOIN Roles r ON u.rol_id = r.id
        WHERE u.nombre_usuario = @nombre_usuario
      `);

    if (result.recordset.length === 0) {
      return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 });
    }

    const usuario = result.recordset[0];
    const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 });
    }

    const token = jwt.sign(
      { nombre_usuario: usuario.nombre_usuario, rol: usuario.rol },
      getEnvVar('JWT_SECRET'),
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      message: 'Login correcto',
      token,
      usuario: {
        nombre: usuario.nombre_usuario,
        rol: usuario.rol,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Error en la conexión o consulta SQL:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
