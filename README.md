# MediCita API

API REST de la plataforma de citas médicas MediCita (Node.js, Express y MySQL).

## Requisitos

- Node.js 20 o superior
- MySQL 8

## Puesta en marcha

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Crear la base de datos y las tablas ejecutando `database/schema.sql` en MySQL Workbench (o por consola):

   ```bash
   mysql -u root -p < database/schema.sql
   ```

3. Cargar datos de prueba con `database/seed.sql`. Este script también sirve para reiniciar los datos
   cuando se quiera repetir un recorrido de pruebas:

   ```bash
   mysql -u root -p --default-character-set=utf8mb4 < database/seed.sql
   ```

4. Copiar `.env.example` como `.env` y completar los valores (usuario y contraseña de MySQL, secreto JWT y `CATALOG_CACHE_SECONDS`, segundos de caché del catálogo de médicos).

5. Iniciar el servidor:

   ```bash
   npm start
   ```

La API queda en `http://localhost:3000/api` y la documentación interactiva en `http://localhost:3000/api-docs`.

La especificación OpenAPI también está disponible como archivo en `openapi.json`, para abrirla en Swagger Editor sin ejecutar la API.

## Usuarios de prueba (database/seed.sql)

| Rol           | Correo                | Contraseña  |
| ------------- | --------------------- | ----------- |
| Administrador | admin@medicita.com    | Admin12345  |
| Paciente      | ana.torres@correo.com | Paciente123 |

## Autenticación

`POST /api/sessions` recibe correo, contraseña y rol (`admin` o `patient`), verifica las credenciales
contra la base de datos y devuelve un token JWT. Los demás endpoints protegidos esperan el encabezado
`Authorization: Bearer <token>`.

## Endpoints

| Recurso                 | Rutas                                                                   |
| ----------------------- | ----------------------------------------------------------------------- |
| Sesiones                | `POST /sessions`                                                        |
| Administradores         | `GET, POST /admins` · `GET, PATCH, DELETE /admins/:id`                  |
| Pacientes               | `GET, POST /patients` · `GET, PATCH, DELETE /patients/:id`              |
| Médicos                 | `GET, POST /doctors` · `GET, PATCH, DELETE /doctors/:id`                |
| Citas                   | `GET, POST /appointments` · `GET, PATCH, DELETE /appointments/:id`      |
| Exámenes                | `GET, POST /exams` · `GET, PATCH, DELETE /exams/:id`                    |
| Reseñas                 | `GET, POST /reviews` · `GET, PATCH, DELETE /reviews/:id`                |
| Reporte de ingresos     | `GET /income-reports?date=YYYY-MM-DD` o `?month=YYYY-MM` (solo `admin`) |
| Estadísticas de reseñas | `GET /review-statistics?doctorId=` (solo `admin`)                       |

Permisos por rol:

- Registro de pacientes (`POST /patients`): público.
- Administradores: solo rol `admin`.
- Listar pacientes: solo `admin`. Consultar, actualizar o eliminar un paciente: el propio paciente o un `admin`.
- Médicos y exámenes: cualquier usuario autenticado puede consultar; solo `admin` puede crear, actualizar o eliminar.
- Citas, exámenes y reseñas: un paciente solo ve y modifica sus propios registros (responde `403` en otro caso); un `admin` accede a todos.
- Reportes: solo `admin`.

Filtros por query string en los listados (cualquier parámetro no previsto responde `400`):

| Recurso  | Parámetros                                             |
| -------- | ------------------------------------------------------ |
| Médicos  | `specialty`, `search` (nombre o especialidad)          |
| Citas    | `patientId`, `doctorId`, `status`, `date` (YYYY-MM-DD) |
| Exámenes | `patientId`, `type`                                    |
| Reseñas  | `doctorId`, `appointmentId`                            |

El catálogo de médicos (`GET /doctors` y `GET /doctors/:id`) responde con `Cache-Control: private, max-age=<CATALOG_CACHE_SECONDS>`.

Reglas de negocio:

- El precio de una cita se toma de la tarifa del médico y la fecha debe ser futura.
- El reporte de ingresos suma el precio de las citas no canceladas del día o mes consultado.
- Un médico no puede tener dos citas activas en el mismo horario.
- Solo se pueden modificar citas en estado `programada`.
- Solo se pueden reseñar citas `completada` y cada cita admite una única reseña.
- Un examen `cuantitativo` exige `numericValue`, uno `cualitativo` exige `qualitativeResult` y uno de `imagen` exige `imageUrl`.

## Arquitectura

Basada en el proyecto base de la asignatura (`Node_MySQL_Example`): `server.js` en la raíz, `routes/`, `dao/`, `services/mysql.service.js` y `env/`, con CommonJS.

```
server.js        arranque de Express, Swagger UI y archivos estáticos
env/             variables de entorno, configuración de MySQL y constantes
routes/          definición de rutas y permisos por recurso
controllers/     traducen la solicitud HTTP a llamadas de servicio
services/        reglas de negocio y conexión a MySQL (mysql.service.js)
dao/             acceso a datos (consultas SQL con mysql2)
validators/      esquemas de validación de entrada (Joi)
middlewares/     autenticación, validación, caché y manejo de errores
docs/            especificación OpenAPI servida con Swagger UI
errors/          error HTTP propio de la aplicación
utils/           contraseñas, tokens, periodos y control de acceso
public/          página estática con enlace a la documentación
database/        esquema y datos de prueba
postman/         colección de pruebas (importable en Postman, Thunder Client o Insomnia)
```

## Pruebas

La carpeta `postman/` contiene la colección `MediCita.postman_collection.json` con dos carpetas:

- `VIDEO - Recorrido de 5 minutos`: secuencia para la demostración en vivo.
- `EVIDENCIA - Cobertura completa`: cada endpoint con casos de éxito y de error.

Antes de cada recorrido hay que ejecutar `database/seed.sql` para reiniciar los datos y los identificadores.

## Formato de errores

```json
{
  "status": 400,
  "message": "Datos de entrada invalidos",
  "details": [{ "field": "email", "message": "\"email\" must be a valid email" }]
}
```
