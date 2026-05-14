# Spring-WSL-Mastery: Historial de Proyecto

Este documento registra los pasos realizados en la configuración del entorno y el desarrollo de la Prueba de Concepto.

## [2026-05-14] - Inicialización y Configuración

### 1. Entorno Base
- **Java 21**: Se instaló el JDK de Microsoft (LTS) vía `winget` para modernizar el entorno desde Java 8.
- **Maven 3.9.7**: Configurado y verificado.
- **Spring Boot 3.2.5**: Inicializado el proyecto con soporte para Java 21.

### 2. Mantenimiento de Sistema
- **Limpieza de Disco**: Se liberaron aproximadamente **77 GB** de espacio eliminando grabaciones de video temporales en la carpeta de usuario.
- **Gestión de Java**: Se identificaron versiones antiguas (6, 8, 11, 17, 22). Se mantuvo **Java 8** por dependencia de Tomcat en XAMPP y **Java 21** para el desarrollo actual.

### 🏗️ Arquitectura de Microservicios

El proyecto se divide en dos componentes principales:
1.  **`backend/`**: Servidor API REST construido con **Spring Boot 3** y **Java 21**. Gestiona la lógica de negocio y la persistencia en **PostgreSQL**.
2.  **`frontend/`**: Interfaz de usuario "Premium" construida con HTML5, CSS3 moderno y Vanilla JS. Consume la API de forma asíncrona.

### Infraestructura Híbrida
- **Base de Datos**: PostgreSQL corre nativamente en **WSL (Ubuntu)**.
- **Interconectividad**: El backend en Windows se conecta a WSL vía `localhost:5432`.
    - **User**: `postgres` / `admin`.
- **Docker**: Verificado que está disponible dentro de WSL para futura "microservicificación".

### 4. Arquitectura de Microservicios & Contenedores
- **Docker Compose**: Se ha implementado la orquestación completa del stack.
- **Backend**: Dockerizado con compilación multi-etapa (Eclipse Temurin 21).
- **Frontend**: Servido mediante Nginx en un contenedor ligero.
- **Base de Datos**: PostgreSQL migrado a contenedor Docker para portabilidad total.
- **Despliegue**: Script `deploy.sh` creado para ejecución rápida en WSL.

# Spring-WSL-Mastery: Historial de Proyecto

Este documento registra los pasos realizados en la configuración del entorno y el desarrollo de la Prueba de Concepto.

## [2026-05-14] - Inicialización y Configuración

### 1. Entorno Base
- **Java 21**: Se instaló el JDK de Microsoft (LTS) vía `winget` para modernizar el entorno desde Java 8.
- **Maven 3.9.7**: Configurado y verificado.
- **Spring Boot 3.2.5**: Inicializado el proyecto con soporte para Java 21.

### 2. Mantenimiento de Sistema
- **Limpieza de Disco**: Se liberaron aproximadamente **77 GB** de espacio eliminando grabaciones de video temporales en la carpeta de usuario.
- **Gestión de Java**: Se identificaron versiones antiguas (6, 8, 11, 17, 22). Se mantuvo **Java 8** por dependencia de Tomcat en XAMPP y **Java 21** para el desarrollo actual.

### 🏗️ Arquitectura de Microservicios

El proyecto se divide en dos componentes principales:
1.  **`backend/`**: Servidor API REST construido con **Spring Boot 3** y **Java 21**. Gestiona la lógica de negocio y la persistencia en **PostgreSQL**.
2.  **`frontend/`**: Interfaz de usuario "Premium" construida con HTML5, CSS3 moderno y Vanilla JS. Consume la API de forma asíncrona.

### Infraestructura Híbrida
- **Base de Datos**: PostgreSQL corre nativamente en **WSL (Ubuntu)**.
- **Interconectividad**: El backend en Windows se conecta a WSL vía `localhost:5432`.
    - **User**: `postgres` / `admin`.
- **Docker**: Verificado que está disponible dentro de WSL para futura "microservicificación".

### 4. Arquitectura de Microservicios & Contenedores
- **Docker Compose**: Se ha implementado la orquestación completa del stack.
- **Backend**: Dockerizado con compilación multi-etapa (Eclipse Temurin 21).
- **Frontend**: Servido mediante Nginx en un contenedor ligero.
- **Base de Datos**: PostgreSQL migrado a contenedor Docker para portabilidad total.
- **Despliegue**: Script `deploy.sh` creado para ejecución rápida en WSL.

### 5. Versión 1.0.0 - Lanzamiento Oficial
- **Campos Extendidos**: Soporte para Urgencia, Importancia y Deadline.
- **Ordenación Multinivel**: Motor de ordenación dinámico basado en el orden de selección del usuario.
- **Diseño Premium**: Footer con versión y copyright, modo oscuro optimizado.
- **GitHub**: Repositorio oficial creado en `@ajpoyatonieto/Spring-WSL-Mastery`.

### 6. Versión 1.1.0 - Gestión Completa (CRUD)
- **Operaciones CRUD**: Implementación de Editar y Borrar.
- **Interactividad**: Marcado de tareas completadas desde la UI.

### 7. Versión 1.2.0 - UX Premium
- **Calendario**: Integración de Flatpickr (Dark Theme) para fechas límites.

### 8. Versión 1.3.0 - Escalabilidad y PWA
- **Java 21 Mastery**: Activación de **Virtual Threads** (Proyecto Loom).
- **Mobile Ready**: Diseño responsive y conversión a **PWA** (Progressive Web App).
- **Icono**: Generación de identidad visual para la App.

### 9. Versión 1.4.0 - Refactorización de Recursos
- **Arquitectura de Activos**: Organización de CSS, JS e Imágenes en subcarpetas `assets/`.

### 10. Versión 1.5.0 - Persistencia y Red Local
- **Persistencia**: Cambio a `ddl-auto=update` para conservar datos reales.
- **Acceso Remoto**: Configuración de API dinámica para acceso desde móviles en la misma red Wi-Fi.

### 11. Versión 2.0.0 - Seguridad y Modelo Extendido
- **Seguridad**: Implementación de Spring Security (Basic Auth) y Login Overlay.
- **Modelo**: Adición de campo `title` y conversión de `description` a área de texto amplia.
- **Lógica**: Ordenación por defecto multinivel (Urgencia > Importancia > Fecha).
- **UX**: Botón de cancelación de edición y diseño responsive avanzado.

---
*Documento actualizado por Antigravity (AI Assistant) | 2026-05-14*
