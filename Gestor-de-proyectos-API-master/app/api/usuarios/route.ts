import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';
import sql from 'mssql';

// CREATE - Método POST para crear un nuevo usuario
export async function POST(req: Request) {
  try {
    const { nombre_usuario, contrasena, rol_id } = await req.json();

    // Validar que todos los campos sean proporcionados
    if (!nombre_usuario || !contrasena || !rol_id) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // Conectar a la base de datos
    const connection = await getConnection();

    // Verificar si el rol existe
    const rolResult = await connection
      .request()
      .input('rol_id', sql.Int, rol_id)
      .query('SELECT id FROM Roles WHERE id = @rol_id');

    if (rolResult.recordset.length === 0) {
      return NextResponse.json({ message: 'El rol proporcionado no existe' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // Crear un nuevo usuario
    await connection
      .request()
      .input('nombre_usuario', sql.VarChar, nombre_usuario)
      .input('contrasena', sql.VarChar, contrasena)
      .input('rol_id', sql.Int, rol_id)
      .query('INSERT INTO Usuarios (nombre_usuario, contrasena, rol_id) VALUES (@nombre_usuario, @contrasena, @rol_id)');

    return NextResponse.json({ message: 'Usuario creado correctamente' }, { status: 201, headers: { 'Access-Control-Allow-Origin': '*' } });

  } catch (error) {
    console.error('Error en la conexión o consulta SQL:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}

// READ - Método GET para obtener todos los usuarios
export async function GET() {
  try {
    const connection = await getConnection();

    const result = await connection.request().query('SELECT * FROM Usuarios');

    return NextResponse.json(result.recordset, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (error) {
    console.error('Error en la conexión o consulta SQL:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}

// UPDATE - Método PUT para actualizar un usuario por ID
export async function PUT(req: Request) {
  try {
    const { id, nombre_usuario, contrasena, rol_id } = await req.json();

    if (!id || !nombre_usuario || !contrasena || !rol_id) {
      return NextResponse.json({ message: 'Todos los campos son obligatorios' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    const connection = await getConnection();

    // Verificar si el rol existe
    const rolResult = await connection
      .request()
      .input('rol_id', sql.Int, rol_id)
      .query('SELECT id FROM Roles WHERE id = @rol_id');

    if (rolResult.recordset.length === 0) {
      return NextResponse.json({ message: 'El rol proporcionado no existe' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    // Actualizar el usuario
    await connection
      .request()
      .input('id', sql.Int, id)
      .input('nombre_usuario', sql.VarChar, nombre_usuario)
      .input('contrasena', sql.VarChar, contrasena)
      .input('rol_id', sql.Int, rol_id)
      .query('UPDATE Usuarios SET nombre_usuario = @nombre_usuario, contrasena = @contrasena, rol_id = @rol_id WHERE id = @id');

    return NextResponse.json({ message: 'Usuario actualizado correctamente' }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });

  } catch (error) {
    console.error('Error en la conexión o consulta SQL:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}

// DELETE - Método DELETE para eliminar un usuario por ID
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'El ID es obligatorio' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    const connection = await getConnection();

    await connection
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Usuarios WHERE id = @id');

    return NextResponse.json({ message: 'Usuario eliminado correctamente' }, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });

  } catch (error) {
    console.error('Error en la conexión o consulta SQL:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
