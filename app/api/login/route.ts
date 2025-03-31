import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';
import jwt from 'jsonwebtoken';

function getEnvVar(variable: string): string {
  const value = process.env[variable];
  if (!value) {
    throw new Error(`Environment variable ${variable} is not defined`);
  }
  return value;
}

export async function POST(req: NextRequest) {
  const { nombre_usuario, contrasena } = await req.json();

  if (!nombre_usuario || !contrasena) {
    return NextResponse.json({ message: 'Faltan campos obligatorios' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  try {
    const pool = await getConnection();
    const result = await pool
      .request()
      .input('nombre_usuario', nombre_usuario)
      .input('contrasena', contrasena)
      .query(`
        SELECT u.nombre_usuario, r.nombre as rol
        FROM Usuarios u
        INNER JOIN Roles r ON u.rol_id = r.id
        WHERE u.nombre_usuario = @nombre_usuario 
          AND u.contrasena = @contrasena
      `);

    if (result.recordset.length > 0) {
      const usuario = result.recordset[0];

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
      }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
    } else {
      return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
  } catch (error) {
    console.error('Error en la conexión o consulta SQL:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
