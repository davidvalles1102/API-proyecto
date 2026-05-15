import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export function getEnvVar(variable: string): string {
  const value = process.env[variable];
  if (!value) throw new Error(`Environment variable ${variable} is not defined`);
  return value;
}

export interface JwtPayload {
  nombre_usuario: string;
  rol: string;
}

export function verifyToken(req: NextRequest): JwtPayload {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Token no proporcionado');
  }
  const token = authHeader.slice(7);
  return jwt.verify(token, getEnvVar('JWT_SECRET')) as JwtPayload;
}

export function unauthorizedResponse(message = 'No autorizado') {
  return NextResponse.json({ message }, { status: 401 });
}
