import { NextResponse } from 'next/server';
import { getConnection } from '../../../lib/db';

// Crear un Proyecto
export async function POST(request: Request) {
    const { nombre, descripcion, fecha_inicio, fecha_fin, gerente_id } = await request.json();
    
    if (!nombre || !fecha_inicio || !fecha_fin || !gerente_id) {
        return NextResponse.json({ message: 'Todos los campos excepto descripción son obligatorios' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('nombre', nombre)
            .input('descripcion', descripcion || null)
            .input('fecha_inicio', fecha_inicio)
            .input('fecha_fin', fecha_fin)
            .input('gerente_id', gerente_id)
            .query(`INSERT INTO Proyectos (nombre, descripcion, fecha_inicio, fecha_fin, gerente_id) 
                    VALUES (@nombre, @descripcion, @fecha_inicio, @fecha_fin, @gerente_id)`);
        return NextResponse.json({ message: 'Proyecto creado con éxito' }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    } catch (error) {
        return NextResponse.json({ message: 'Error al crear el proyecto' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
}

export async function GET() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query(`SELECT * FROM Proyectos`);
        return NextResponse.json(result.recordset, { headers: { 'Access-Control-Allow-Origin': '*' } });
    } catch (error) {
        return NextResponse.json({ message: 'Error al obtener los proyectos' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
}

export async function PATCH(request: Request) {
    const { id, nombre, descripcion, fecha_inicio, fecha_fin, gerente_id } = await request.json();

    if (!id) {
        return NextResponse.json({ message: 'ID del proyecto es obligatorio' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    if (!gerente_id) {
        return NextResponse.json({ message: 'ID del usuario a asignar es obligatorio' }, { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } });
    }

    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', id)
            .input('nombre', nombre)
            .input('descripcion', descripcion || null)
            .input('fecha_inicio', fecha_inicio)
            .input('fecha_fin', fecha_fin)
            .input('gerente_id', gerente_id)
            .query(`UPDATE Proyectos SET nombre = @nombre, descripcion = @descripcion, fecha_inicio = @fecha_inicio, 
                    fecha_fin = @fecha_fin, gerente_id = @gerente_id WHERE id = @id`);
        return NextResponse.json({ message: 'Proyecto actualizado con éxito' }, { headers: { 'Access-Control-Allow-Origin': '*' } });
    } catch (error) {
        return NextResponse.json({ message: 'Error al actualizar el proyecto' }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
    }
}
