# TaskFlow 

API para gestión de tareas colaborativas. Proyecto hecho con NestJS + MongoDB Atlas para el tercer examen.

## Comenzando 

**Lo que necesitas:**
- Node.js (versión 18 o superior)
- MongoDB Atlas o una instancia local
- NestJS CLI: `npm i -g @nestjs/cli`
- Thunder Client (o Postman si prefieres)

**Instalación:**

```bash
git clone https://github.com/Andres-Arango280/TercerExamen.git
cd TercerExamen
npm install
```

Configura tu archivo `.env` con estos datos:

```env
MONGO_URI=<ya esta el mio>
JWT_SECRET=<aca ´pues lo que quieras >
PORT=3000
```

Para correr el proyecto:

```bash
npm install
npm run start:dev
```

La API va a estar corriendo en `http://localhost:3000`

---

## Cómo está estructurado 

El proyecto tiene los siguientes módulos:

- **Auth**: Maneja registro y login, genera tokens JWT
- **Usuarios**: Solo el schema, los usuarios se crean cuando te registras
- **Equipos**: Crear equipos y gestionar miembros (solo el líder puede hacer esto)
- **Proyectos**: Se crean dentro de un equipo
- **Listas**: Cuando creas un proyecto se generan automáticamente 3 listas: "Por Hacer", "En Progreso" y "Hecho"
- **Tareas**: Se asignan a usuarios del equipo y se pueden mover entre listas

Todas las rutas están protegidas con JWT y se valida que pertenezcas al equipo antes de hacer cualquier operación.

---

## Guía de uso con Thunder Client 

### 1. Autenticación

**Registrar un usuario nuevo:**

```
POST http://localhost:3000/auth/register
```

Body:
```json
{
  "nombre": "Juan",
  "email": "juan@example.com",
  "password": "123456"
}
```

**Iniciar sesión:**

```
POST http://localhost:3000/auth/login
```

Body:
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

Te va a devolver un `access_token`. **Guárdalo bien** porque lo vas a necesitar para todas las demás peticiones.

>  **Importante:** A partir de aquí, todas las peticiones deben llevar el header:  
> `Authorization: Bearer <tu_token_aquí> y Content-Type  application/json` 

---

### 2. Crear y gestionar equipos

**Crear un equipo:**

```
POST http://localhost:3000/equipos
```

Body:
```json
{
  "nombre": "Equipo Backend"
}
```

**Invitar miembros al equipo:**

```
POST http://localhost:3000/equipos/{id_del_equipo}/miembros
```

Body:
```json
{
  "usuarioId": "<id_del_usuario_a_invitar>"
}
```

**Eliminar un miembro:**

```
DELETE http://localhost:3000/equipos/{id_del_equipo}/miembros/{id_del_miembro}
```

Solo el líder del equipo puede invitar o remover miembros.

---

### 3. Proyectos

**Crear un proyecto:**

```
POST http://localhost:3000/proyectos
```

Body:
```json
{
  "nombre": "Proyecto Backend",
  "equipo": "<id_del_equipo>"
}
```

Cuando creas un proyecto se generan automáticamente las tres listas: "Por Hacer", "En Progreso" y "Hecho".

**Ver las listas de un proyecto:**

```
GET http://localhost:3000/listas/proyecto/{id_del_proyecto}
```

---

### 4. Tareas

**Crear una tarea:**

```
POST http://localhost:3000/tareas
```

Body:
```json
{
  "titulo": "Diseñar la API",
  "descripcion": "Definir endpoints y controladores",
  "proyectoId": "<id_del_proyecto>",
  "asignados": ["<id_del_miembro>"]
}
```

Por defecto, la tarea se crea en la lista "Por Hacer".

**Asignar más miembros a una tarea:**

```
PATCH http://localhost:3000/tareas/{id_de_la_tarea}/asignar
```

Body:
```json
{
  "miembros": ["<id_miembro1>", "<id_miembro2>"]
}
```

**Mover una tarea entre listas:**

```
PATCH http://localhost:3000/tareas/{id_de_la_tarea}/mover
```

Body:
```json
{
  "nuevaListaId": "<id_de_la_lista_destino>"
}
```

---

## Ejemplo de flujo completo 

1. Registrarte como usuario y hacer login → Guardar el token JWT
2. Crear un equipo → Anotar el ID del equipo
3. Invitar miembros al equipo
4. Crear un proyecto dentro del equipo → Guardar el ID del proyecto
5. Crear tareas en el proyecto
6. Asignar miembros a las tareas
7. Mover tareas entre listas según vayan avanzando

---

## Permisos y seguridad 

- Todas las rutas requieren autenticación con JWT
- Solo puedes hacer operaciones en equipos a los que perteneces
- Solo el líder del equipo puede invitar o remover miembros
- Si intentas acceder a un recurso sin pertenecer al equipo, te sale:

```json
{
  "statusCode": 403,
  "message": "No perteneces al equipo",
  "error": "Forbidden"
}
```

---

## Dudas o problemas 

Si algo no funciona o no queda claro, me puedes escribir al correo.

---

**Hecho por:** Andrés Arango  
**Repo:** https://github.com/Andres-Arango280/TercerExamen
