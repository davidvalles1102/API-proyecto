import { NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const db = await getConnection();

        // Verificamos si el id es un único id o una lista de ids
        const ids = params.id.split(',').map((id) => parseInt(id));

        if (ids.some(isNaN)) {
            return NextResponse.json({ message: 'ID inválido' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        // Primero obtenemos los ids de los usuarios que tienen el rol de 'Gerente'
        const result = await db
            .request()
            .input('rolNombre', 'Gerente de Proyectos')
            .query(
                `SELECT u.id, u.nombre_usuario
                FROM Usuarios u
                JOIN Roles r ON u.rol_id = r.id
                WHERE r.nombre = @rolNombre AND u.id IN (${ids.join(',')})`
            );

        const gerentes = result.recordset;

        // Si no encontramos ningún gerente, devolver un error
        if (gerentes.length === 0) {
            return NextResponse.json({ message: 'Ningún usuario con rol de gerente encontrado' }, { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        // Obtenemos los proyectos que gestionan esos gerentes
        type Gerente = { id: number; /* otras propiedades */ };
        const gerenteIds = gerentes.map((g: Gerente) => g.id);

        const proyectosResult = await db
            .request()
            .query(
                `SELECT p.nombre, p.descripcion, p.fecha_inicio, p.fecha_fin, p.gerente_id
                FROM Proyectos p
                WHERE p.gerente_id IN (${gerenteIds.join(',')})`
            );

        const proyectos = proyectosResult.recordset;

        // Si no encontramos proyectos, devolvemos un mensaje
        if (proyectos.length === 0) {
            return NextResponse.json({ message: 'No hay proyectos asociados a este gerente' }, { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        // Devolver el resultado
        return NextResponse.json(proyectos, { headers: { 'Access-Control-Allow-Origin': '*' } });
    } catch (error) {
        console.error(error); // Para registrar el error en los logs
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
}