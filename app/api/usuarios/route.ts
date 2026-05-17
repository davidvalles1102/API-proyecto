import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';
import bcrypt from 'bcryptjs';
import sql from 'mssql';

export async function POST(req: Request) {
  try {
    const { nombre_usuario, contrasena, rol_id } = await req.json();

    if (!nombre_usuario || !contrasena || !rol_id) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const connection = await getConnection();

    const rolResult = await connection
      .request()
      .input('rol_id', sql.Int, rol_id)
      .query('SELECT id FROM Roles WHERE id = @rol_id');

    if (rolResult.recordset.length === 0) {
      return NextResponse.json({ message: 'El rol proporcionado no existe' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await connection
      .request()
      .input('nombre_usuario', sql.VarChar, nombre_usuario)
      .input('contrasena', sql.VarChar, hashedPassword)
      .input('rol_id', sql.Int, rol_id)
      .query('INSERT INTO Usuarios (nombre_usuario, contrasena, rol_id) VALUES (@nombre_usuario, @contrasena, @rol_id)');

    return NextResponse.json({ message: 'Usuario creado correctamente' }, { status: 201 });

  } catch (error) {
    console.error('Error en la conexión o consulta SQL:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const connection = await getConnection();
    const result = await connection.request().query('SELECT id, nombre_usuario, rol_id FROM Usuarios');
    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    console.error('Error en la conexión o consulta SQL:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, nombre_usuario, contrasena, rol_id } = await req.json();

    if (!id || !nombre_usuario || !contrasena || !rol_id) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400 });
    }

    const connection = await getConnection();

    const rolResult = await connection
      .request()
      .input('rol_id', sql.Int, rol_id)
      .query('SELECT id FROM Roles WHERE id = @rol_id');

    if (rolResult.recordset.length === 0) {
      return NextResponse.json({ message: 'El rol proporcionado no existe' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    await connection
      .request()
      .input('id', sql.Int, id)
      .input('nombre_usuario', sql.VarChar, nombre_usuario)
      .input('contrasena', sql.VarChar, hashedPassword)
      .input('rol_id', sql.Int, rol_id)
      .query('UPDATE Usuarios SET nombre_usuario = @nombre_usuario, contrasena = @contrasena, rol_id = @rol_id WHERE id = @id');

    return NextResponse.json({ message: 'Usuario actualizado correctamente' }, { status: 200 });

  } catch (error) {
    console.error('Error en la conexión o consulta SQL:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'El ID es obligatorio' }, { status: 400 });
    }

    const connection = await getConnection();

    await connection
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Usuarios WHERE id = @id');

    return NextResponse.json({ message: 'Usuario eliminado correctamente' }, { status: 200 });

  } catch (error) {
    console.error('Error en la conexión o consulta SQL:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
