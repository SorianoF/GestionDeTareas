## Gestión de Tareas
Sistema web desarrollado como una prueba técnica para la organización, planificación, priorización y seguimiento de tareas.
Consta de un backend en ASP.NET Core 8 y un frontend en Angular, conectados a una base de datos SQL Server mediante Entity Framework Core. 

## Prerrequisitos
Antes de ejecutar el proyecto, asegúrate de tener instaladas las siguientes herramientas:

Backend
.NET SDK 8.0 o superior

SQL Server


Visual Studio 2022

Visual Studio Code

Entity Framework Core CLI

Frontend

Node.js (v18 o superior)

Angular CLI 

bash: npm install -g @angular/cli

## Configuración de la Base de Datos
En el archivo appsettings.json del backend, asegúrate de tener configurada la conexión a tu base de datos SQL Server:

"ConnectionStrings": {
  "DefaultConnection": "Server=DESKTOP-6LLQQJ6;Database=GestionTareasDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
