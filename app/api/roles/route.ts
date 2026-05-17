import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';

// CREATE a new role
export async function POST(request: Request) {
  const { nombre } = await request.json();

  if (!nombre) {
    return NextResponse.json({ error: 'Nombre de rol es requerido' }, { status: 400 });
  }

  try {
    const connection = await getConnection();
    const result = await connection
      .request()
      .input('nombre', nombre)
      .query('INSERT INTO Roles (nombre) OUTPUT INSERTED.id VALUES (@nombre)');

    const newRoleId = result.recordset[0].id;
    return NextResponse.json({ message: 'Rol creado exitosamente', id: newRoleId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear rol' }, { status: 500 });
  }
}

// READ all roles
export async function GET() {
  try {
    const connection = await getConnection();
    const result = await connection.request().query('SELECT * FROM Roles');

    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener roles' }, { status: 500 });
  }
}

// UPDATE a role
export async function PUT(request: Request) {
  const { id, nombre } = await request.json();

  if (!id || !nombre) {
    return NextResponse.json({ error: 'ID y nombre de rol son requeridos' }, { status: 400 });
  }

  try {
    const connection = await getConnection();
    await connection
      .request()
      .input('id', id)
      .input('nombre', nombre)
      .query('UPDATE Roles SET nombre = @nombre WHERE id = @id');

    return NextResponse.json({ message: 'Rol actualizado exitosamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar rol' }, { status: 500 });
  }
}

// DELETE a role
export async function DELETE(request: Request) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'ID de rol es requerido' }, { status: 400 });
  }

  try {
    const connection = await getConnection();
    await connection.request().input('id', id).query('DELETE FROM Roles WHERE id = @id');

    return NextResponse.json({ message: 'Rol eliminado exitosamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar rol' }, { status: 500 });
  }
}
