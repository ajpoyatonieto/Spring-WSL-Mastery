# 🚀 Java 21 PoC: Spring Boot 3 & PostgreSQL

Este proyecto es una **Prueba de Concepto (PoC)** diseñada para explorar las capacidades de **Java 21** y **Spring Boot 3** en un entorno híbrido Windows/WSL.

## 🛠️ Stack Tecnológico

*   **Lenguaje:** Java 21 (Microsoft OpenJDK LTS)
*   **Framework:** Spring Boot 3.2.5
*   **Gestor de Dependencias:** Maven 3.9.7
*   **Base de Datos:** PostgreSQL 14 (corriendo en WSL 2)
*   **Entorno de Despliegue:** WSL (Ubuntu-22.04)

## 🏗️ Arquitectura del Entorno

El proyecto utiliza una arquitectura de desarrollo híbrida:
*   **Desarrollo:** Windows 11 con VS Code / IntelliJ.
*   **Servicios:** PostgreSQL corre de forma nativa en Ubuntu (WSL) para garantizar un entorno cercano a producción (Linux).
*   **Interconectividad:** El puente de red de WSL permite acceder a la base de datos desde Windows mediante `localhost:5432`.

## 🚀 Cómo empezar

### Requisitos previos
1. Tener instalado WSL 2 con Ubuntu.
2. Java 21 configurado en el PATH.

### Ejecución de la aplicación
Desde la raíz del proyecto:
```powershell
mvn spring-boot:run
```
La aplicación estará disponible en: `http://localhost:8080`

### Acceso a la Base de Datos
*   **DB Name:** `poc_db`
*   **User:** `postgres`
*   **Pass:** `admin`
*   **Port:** `5432`

## 📝 Notas de Desarrollo
- El historial detallado de cambios se encuentra en [History.md](./History.md).
- Este proyecto se utiliza para probar características como **Virtual Threads** y **Pattern Matching**.

---
*Desarrollado con la asistencia de Antigravity AI.*
