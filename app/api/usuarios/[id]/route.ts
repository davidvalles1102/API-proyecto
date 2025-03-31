// app/api/usuarios/[id]/route.ts

import { NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const db = await getConnection();

    try {
        const result = await db
            .request()
            .input('id', params.id)
            .query('SELECT * FROM Usuarios WHERE id = @id');

        if (result.recordset.length === 0) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } });
        }

        return NextResponse.json(result.recordset[0], { headers: { 'Access-Control-Allow-Origin': '*' } });
    } catch (error) {
        console.error('Error en la conexión o consulta SQL:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
}