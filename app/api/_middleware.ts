import { NextResponse } from 'next/server';

export function middleware(request: Request) {
    const response = NextResponse.next();

    // Establecer los encabezados CORS
    response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.headers.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    // Manejo de la solicitud OPTIONS
    if (request.method === 'OPTIONS') {
        return new Response(null, {
            status: 200, // No Content
            headers: {
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
    return response;
}