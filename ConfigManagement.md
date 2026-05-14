# Gestión de la Configuración: Spring-WSL-Mastery

Este documento define la configuración técnica, las dependencias y los procedimientos de mantenimiento del ecosistema.

## 1. Línea Base de Software (Baseline)

| Componente | Versión | Proveedor |
| :--- | :--- | :--- |
| **JDK** | 21.0.11 LTS | Microsoft OpenJDK |
| **Maven** | 3.9.7 | Apache |
| **Docker** | 26.1.3 | Docker Inc. |
| **PostgreSQL** | 14-alpine | Docker Hub (Official) |
| **Nginx** | alpine | Docker Hub (Official) |
| **Spring Boot**| 3.2.5 | VMware |

## 2. Matriz de Puertos y Servicios

| Servicio | Puerto Host | Puerto Contenedor | Acceso Externo |
| :--- | :--- | :--- | :--- |
| `frontend` | 80 | 80 | http://localhost |
| `backend` | 8080 | 8080 | http://localhost:8080 |
| `db` | 5432 | 5432 | localhost:5432 |

## 3. Variables de Entorno (Environment Variables)

Las variables críticas se gestionan a través del archivo `docker-compose.yml`.

| Variable | Valor por Defecto | Descripción |
| :--- | :--- | :--- |
| `POSTGRES_DB` | `poc_db` | Nombre de la base de datos |
| `POSTGRES_USER` | `postgres` | Usuario administrador de DB |
| `POSTGRES_PASSWORD`| `admin` | Contraseña (Cambiar en Prod) |
| `SPRING_DATASOURCE_URL`| `jdbc:postgresql://db:5432/poc_db` | URL de conexión interna |

## 4. Gestión de Persistencia

Los datos de la base de datos se mantienen en un volumen gestionado por Docker:
- **Nombre del volumen:** `zenith-db-data`
- **Ubicación en WSL:** `/var/lib/docker/volumes/` (gestionado por Docker Engine).

## 5. Procedimientos de Mantenimiento

### 🔄 Despliegue de Cambios
Para actualizar el sistema tras un cambio de código:
```bash
./deploy.sh
```

### 🧹 Limpieza de Entorno
Para detener todo y eliminar volúmenes (borrado total de datos):
```bash
docker-compose down -v
```

### 📦 Copia de Seguridad (Backup)
Para realizar un dump de la base de datos desde el host:
```bash
docker exec -t zenith-db pg_dumpall -c -U postgres > backup_$(date +%Y%m%d).sql
```

---
*Última actualización: 2026-05-14*
