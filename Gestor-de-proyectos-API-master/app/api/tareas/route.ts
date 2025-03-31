// POST /api/tareas/route.ts
import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';

export async function POST(request: Request) {
    const { nombre, descripcion, estado, proyecto_id, asignado_a } = await request.json();

    if (!nombre || !estado || !proyecto_id || !asignado_a) {
        return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    const db = await getConnection();
    const query = `
        INSERT INTO Tareas (nombre, descripcion, estado, proyecto_id, asignado_a) 
        VALUES (@nombre, @descripcion, @estado, @proyecto_id, @asignado_a);
    `;
    const result = await db.request()
        .input('nombre', nombre)
        .input('descripcion', descripcion || null)
        .input('estado', estado)
        .input('proyecto_id', proyecto_id)
        .input('asignado_a', asignado_a)
        .query(query);

    return NextResponse.json({ message: 'Tarea creada con éxito' }, { headers: { 'Access-Control-Allow-Origin': '*' } });
}

// GET /api/tareas/route.ts
export async function GET() {
    const db = await getConnection();
    const result = await db.query('SELECT * FROM Tareas');

    return NextResponse.json(result.recordset, { headers: { 'Access-Control-Allow-Origin': '*' } });
}