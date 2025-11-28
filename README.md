# lab1-proyecto-2025-31052063-28712802
Plataforma API para Gestión de Servicios Médicos
## Estado: 2da Entrega 

Este proyecto es una API REST construida con Node.js y Express, diseñada para la gestión integral de servicios médicos. Permite administrar identidades (pacientes, profesionales), unidades de atención y registros clínicos (episodios, diagnósticos, notas).

Utiliza Prisma ORM para la interacción con una base de datos MySQL y sigue una arquitectura basada en controladores y rutas.

***

Características Principales

    Gestión de Identidades: CRUD completo para Personas (Pacientes), Profesionales y Unidades de Atención.

    Registro Clínico: Manejo de episodios de atención, notas clínicas, diagnósticos y consentimientos.

    Base de Datos Relacional: Modelo robusto que incluye facturación, aseguradoras, agenda y seguridad (roles/permisos).

    Validación de Datos: Manejo de errores centralizado y validación de tipos.

    Emailing: Integración preparada con SendGrid para notificaciones.

    Seeding: Scripts para poblar la base de datos con información inicial de prueba.

***

Tecnologías Utilizadas

    Node.js - Entorno de ejecución.

    Express - Framework web.

    Prisma ORM - Mapeo objeto-relacional y migraciones.

    MySQL - Motor de base de datos.

    SendGrid - Servicio de envío de correos.

***

Instalación y Configuración

1. Requisitos Previos

    Node.js (v18 o superior recomendado).

    MySQL Server en ejecución.

2. Clonar el repositorio e instalar dependencias
~~~
Bash

git clone [<URL_DEL_REPOSITORIO>](https://github.com/Fabicodigo/lab1-proyecto-2025-31052063-28712802)
cd lab1-proyecto-2025-31052063-28712802
npm install
~~~

3. Configuración de Variables de Entorno

Crea un archivo .env en la raíz del proyecto:
~~~
 .env

# Puerto del servidor (Por defecto 4000)
PORT=4000

# Conexión a Base de Datos MySQL (Prisma)
# Formato: mysql://USUARIO:PASSWORD@HOST:PUERTO/NOMBRE_DB
DATABASE_URL="mysql://user:password@localhost:3306/lab1_proyecto"

# Configuración de SendGrid
SENDGRID_API_KEY="tu_api_key_aqui"
SENDGRID_FROM_EMAIL="no-reply@tuapp.com"
~~~

4. Base de Datos (Migraciones y Seed)

Ejecucion de la migracion de Prisma para crear la base de datos MySQL:
~~~
Bash

npx prisma migrate dev --name init
~~~

Poblar la base de datos con los datos de prueba:
~~~
Bash

npm run seed
~~~

***

Ejecución

Modo Desarrollo (con Nodemon)
~~~
Bash

npm run dev
~~~

Modo Producción
~~~
Bash

npm start
~~~

El servidor iniciará por defecto en http://localhost:4000.

Endpoints de la API

La API expone los siguientes recursos:

Identidades y Configuración (/)

+ GET	/personas	Listar pacientes paginados.
+ POST	/personas	Crear un nuevo paciente.
+ GET	/personas/:id	Obtener detalle de un paciente.
+ PATCH	/personas/:id	Actualizar datos de un paciente.
+ DELETE	/personas/:id	Desactivar (borrado logico) un paciente.
+ GET	/profesionales	Listar profesionales de la salud.
+ POST	/profesionales	Registrar un nuevo profesional.
+ GET	/unidades	Listar unidades de atención (sedes/consultorios).

Registros Clínicos

+ GET	/episodios	Listar episodios de atención.
+ POST	/episodios	Abrir un nuevo episodio de atención.
+ GET	/episodios/:id/notas	Ver notas clínicas de un episodio.
+ POST	/episodios/:id/notas	Agregar una nota clínica.
+ GET	/episodios/:id/diagnosticos	Ver diagnósticos de un episodio.
***
Ejemplo de metodo GET:
~~~
Request
metodo GET http://localhost:4000/episodios
~~~
**Respuesta Exitosa (200 OK):**
~~~
Response
{
  "items": [
    {
      "id": 1,
      "personaId": 1,
      "fechaApertura": "2025-11-20T03:49:25.000Z",
      "motivo": "Cefalea intensa",
      "tipo": "Ambulatorio",
      "estado": "En Progreso"
    }
  ],
  "page": 1,
  "pageSize": 20
}
~~~

Ejemplo de metodo POST:
~~~
Request
metodo POST http://localhost:4000/episodios
~~~
Body:
~~~
JSON
{
      "personaId": 1,
      "fechaApertura": "2025-11-20T03:49:25.000Z",
      "motivo": "Cefalea intensa",
      "tipo": "Ambulatorio",
      "estado": "En Progreso"
    }
~~~
Estructura del Proyecto
~~~
.
├── prisma/
│   ├── migrations/      # Historial de cambios en la BD
│   ├── schema.prisma    # Definición de modelos de datos
│   └── seed.ts          # Script de datos iniciales
├── src/
│   ├── controllers/     # Lógica de negocio de los endpoints
│   ├── middlewares/     # Manejo de errores y validaciones
│   ├── routes/          # Definición de rutas de la API
│   ├── utils/           # Utilidades (Email, Mappers, Parsers)
│   ├── app.js           # Configuración de Express
│   └── prisma.js        # Instancia del cliente Prisma
├── package.json
└── README.md
~~~
***
Autores

    Fabian Camacaro

    Marlon Melendez

Licencia

Este proyecto está bajo la licencia ISC.

