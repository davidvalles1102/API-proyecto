import { NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getConnection();

    const ids = params.id.split(',').map((id) => parseInt(id));

    if (ids.some(isNaN)) {
      return NextResponse.json({ message: 'ID inválido' }, { status: 400 });
    }

    const gerentesResult = await db
      .request()
      .input('rolNombre', 'Gerente de Proyectos')
      .query(
        `SELECT u.id, u.nombre_usuario
         FROM Usuarios u
         JOIN Roles r ON u.rol_id = r.id
         WHERE r.nombre = @rolNombre AND u.id IN (${ids.join(',')})`
      );

    const gerentes = gerentesResult.recordset;

    if (gerentes.length === 0) {
      return NextResponse.json({ message: 'Ningún usuario con rol de gerente encontrado' }, { status: 404 });
    }

    const gerenteIds = gerentes.map((g: { id: number }) => g.id);

    const proyectosResult = await db
      .request()
      .query(
        `SELECT p.nombre, p.descripcion, p.fecha_inicio, p.fecha_fin, p.gerente_id
         FROM Proyectos p
         WHERE p.gerente_id IN (${gerenteIds.join(',')})`
      );

    const proyectos = proyectosResult.recordset;

    if (proyectos.length === 0) {
      return NextResponse.json({ message: 'No hay proyectos asociados a este gerente' }, { status: 404 });
    }

    return NextResponse.json(proyectos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}
