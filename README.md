# Sistema de Gestión de Proyectos — API REST

REST API para la gestión de proyectos, tareas y usuarios, desarrollada con **Next.js 14** y **SQL Server Express**.

---

## Tecnologías

| Herramienta | Uso |
|---|---|
| Next.js 14 (App Router) | Framework y servidor API |
| TypeScript | Tipado estático |
| SQL Server Express | Base de datos |
| mssql | Driver de conexión a SQL Server |
| bcryptjs | Hash de contraseñas |
| jsonwebtoken | Autenticación JWT |

---

## Requisitos previos

- Node.js 18+
- SQL Server Express con TCP/IP habilitado en el puerto 1433
- Un login de SQL Server con acceso a la base de datos `GestorProyectos`

---

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de variables de entorno
# Copiar el siguiente contenido en un archivo llamado .env.local en la raíz del proyecto
```

**.env.local**
```
DB_SERVER=localhost
DB_PORT=1433
DB_NAME=GestorProyectos
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
JWT_SECRET=una_clave_secreta_larga
```

```bash
# 3. Iniciar el servidor de desarrollo
npm run dev
```

La API estará disponible en `http://localhost:3000`.

---

## Estructura del proyecto

```
├── app/
│   └── api/
│       ├── login/              # Autenticación
│       ├── usuarios/           # CRUD de usuarios
│       │   └── [id]/
│       ├── roles/              # CRUD de roles
│       │   └── [id]/
│       ├── proyectos/          # CRUD de proyectos
│       │   └── [id]/
│       ├── tareas/             # CRUD de tareas
│       │   └── [id]/
│       └── proyectos-gerentes/ # Proyectos por gerente
│           └── [id]/
├── lib/
│   ├── db.ts                   # Conexión a SQL Server
│   └── auth.ts                 # Utilidades JWT
├── middleware.ts               # CORS global
└── scripts/
    └── migrate-passwords.js    # Migración de contraseñas
```

---

## Endpoints

### Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/login` | Inicia sesión y retorna un token JWT |

**Body:**
```json
{
  "nombre_usuario": "admin",
  "contrasena": "123456"
}
```

**Respuesta exitosa:**
```json
{
  "message": "Login correcto",
  "token": "<jwt>",
  "usuario": { "nombre": "admin", "rol": "Administrador del Sistema" }
}
```

---

### Usuarios `/api/usuarios`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios` | Lista todos los usuarios |
| GET | `/api/usuarios/[id]` | Obtiene un usuario por ID |
| POST | `/api/usuarios` | Crea un usuario (contraseña hasheada automáticamente) |
| PUT | `/api/usuarios` | Actualiza un usuario |
| DELETE | `/api/usuarios` | Elimina un usuario |

**Body para POST / PUT:**
```json
{
  "nombre_usuario": "juanperez",
  "contrasena": "mi_contraseña",
  "rol_id": 1
}
```

---

### Roles `/api/roles`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/roles` | Lista todos los roles |
| POST | `/api/roles` | Crea un rol |
| PUT | `/api/roles` | Actualiza un rol |
| DELETE | `/api/roles` | Elimina un rol |

**Roles predefinidos:**

| ID | Nombre |
|----|--------|
| 1 | Administrador del Sistema |
| 2 | Gerente de Proyectos |
| 3 | Miembro del Equipo |

---

### Proyectos `/api/proyectos`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/proyectos` | Lista todos los proyectos |
| GET | `/api/proyectos/[id]` | Obtiene un proyecto por ID |
| POST | `/api/proyectos` | Crea un proyecto |
| PATCH | `/api/proyectos` | Actualiza un proyecto |
| DELETE | `/api/proyectos/[id]` | Elimina un proyecto |

**Body para POST / PATCH:**
```json
{
  "nombre": "Proyecto Alpha",
  "descripcion": "Descripción opcional",
  "fecha_inicio": "2025-01-01",
  "fecha_fin": "2025-06-30",
  "gerente_id": 2
}
```

---

### Tareas `/api/tareas`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/tareas` | Lista todas las tareas |
| POST | `/api/tareas` | Crea una tarea |

**Body para POST:**
```json
{
  "nombre": "Diseño de base de datos",
  "descripcion": "Descripción opcional",
  "estado": "pendiente",
  "proyecto_id": 1,
  "asignado_a": 3
}
```

---

### Proyectos por Gerente `/api/proyectos-gerentes`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/proyectos-gerentes/[id]` | Obtiene los proyectos gestionados por uno o varios gerentes |

Se pueden pasar múltiples IDs separados por coma: `/api/proyectos-gerentes/1,2,3`

---

## Seguridad

- Las contraseñas se almacenan con hash **bcrypt** (salt rounds: 10).
- La autenticación usa tokens **JWT** con expiración de 1 hora.
- Los headers CORS se aplican globalmente desde `middleware.ts`.

---

## Alumnos

| Nombre | Carné |
|--------|-------|
| David Alberto Valles Gómez | VG240553 |
| Melvin Alexander Soriano Quijada | SQ242789 |
| Herbert William Solano Vásquez | SV202844 |
| Jonathan Jose Flamenco Lopez | FL161275 |
| Raquel Abigail Cortez Mata | CM162199 |

---

## Video

[Ver demostración](https://udbedu-my.sharepoint.com/:v:/g/personal/cm162199_alumno_udb_edu_sv/EaSKdqwkQ7ZNocZQxqJq-_cBbdo_BQxTfWJ-vw2GF4rABQ?e=u0P1ZN&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D)
