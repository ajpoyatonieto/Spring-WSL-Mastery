# Gestión de la Configuración: Spring-WSL-Mastery

Este documento define la configuración técnica, las dependencias y los procedimientos de mantenimiento del ecosistema.

## 1. Línea Base de Software (Baseline)

| Componente | Versión | Proveedor |
| :--- | :--- | :--- |
| **JDK** | 21.0.11 LTS | Microsoft OpenJDK |
| **Maven** | 3.9.7 | Apache |
| **Spring Boot**| 3.2.5 | VMware (Habilitado Virtual Threads) |
| **PostgreSQL** | 14 | Nativo en WSL |
| **Frontend** | PWA | Vanilla JS / Flatpickr / manifest.json |

## 2. Matriz de Puertos y Servicios (Modo Desarrollo)

| Servicio | Puerto Host | Protocolo | Acceso Local | Acceso Red WiFi |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend** | 3000 | HTTP | `localhost:3000` | `192.168.1.170:3000` |
| **Backend** | 8080 | HTTP | `localhost:8080` | `192.168.1.170:8080` |
| **Base de Datos** | 5432 | TCP | `localhost:5432` | N/A (Solo Local/WSL) |

## 3. Configuración del Backend (`application.properties`)

| Propiedad | Valor | Descripción |
| :--- | :--- | :--- |
| `spring.jpa.hibernate.ddl-auto` | `update` | Mantiene los datos entre reinicios. |
| `spring.threads.virtual.enabled` | `true` | **Habilita Proyecto Loom (Virtual Threads).** |
| `endpoints.cors.allowed-origins` | `*` | Permite acceso desde cualquier origen. |

## 4. Gestión de Persistencia

Los datos se almacenan en PostgreSQL dentro de la instancia de Ubuntu (WSL).
- **Nombre de la DB:** `poc_db`
- **Usuario:** `postgres` / `admin`
- **Persistencia:** Garantizada mediante el modo `update` de Hibernate.

## 5. Procedimientos de Mantenimiento

### 🔄 Despliegue de Cambios (Backend)
```bash
mvn spring-boot:run
```

### 🌐 Despliegue de Cambios (Frontend)
```bash
npx serve -l 3000 frontend
```

### 📦 Copia de Seguridad (Backup)
Desde Windows o WSL:
```bash
pg_dump -U postgres poc_db > backup_mastery.sql
```

---
*Última actualización: 2026-05-14 | Versión Actual: 1.5.0*
