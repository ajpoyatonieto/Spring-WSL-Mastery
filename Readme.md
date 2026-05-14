# Spring-WSL-Mastery 🚀 (v2.0.0)

Proyecto PoC (Prueba de Concepto) para dominar el ecosistema de **Java 21**, **Spring Boot 3** y **WSL 2**, orientado a una futura aplicación comercial responsive y escalable.

## 🌟 Características Destacadas
- **Java 21 Mastery**: Uso de **Virtual Threads (Loom)** para alta concurrencia.
- **Arquitectura Híbrida**: Backend en Windows consumiendo PostgreSQL nativo en WSL.
- **Frontend Premium**: Interfaz responsive, modo oscuro y animaciones fluidas (Vanilla JS).
- **PWA Ready**: Aplicación web progresiva instalable en dispositivos móviles con icono personalizado.
- **Gestión Avanzada**: Ordenación dinámica multinivel, CRUD completo y calendario premium (Flatpickr).

## 📂 Estructura del Proyecto
```text
Spring-WSL-Mastery/
├── backend/            # Spring Boot 3 + Java 21 API
├── frontend/           # PWA Frontend
│   ├── assets/         # Recursos organizados (css, js, images)
│   ├── index.html      # Página principal
│   ├── manifest.json   # Manifiesto PWA
│   └── sw.js           # Service Worker
├── ConfigManagement.md # Gestión de puertos y baseline
├── History.md          # Registro de hitos y versiones
└── Readme.md           # Este archivo
```

## 🛠️ Requisitos Previos
- **Windows 11** con **WSL 2** instalado (Ubuntu recomendado).
- **Java 21** (Microsoft OpenJDK recomendado).
- **PostgreSQL** corriendo en WSL (puerto 5432 expuesto).

## 🚀 Ejecución en Desarrollo

1. **Iniciar Backend**:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Iniciar Frontend**:
   ```bash
   npx serve -l 3000 frontend
   ```

3. **Acceso Local**: [http://localhost:3000](http://localhost:3000)
4. **Acceso WiFi**: [http://TU_IP_LOCAL:3000](http://TU_IP_LOCAL:3000)

## 🛡️ Seguridad y Persistencia
- Los datos se guardan en la DB `poc_db` de Postgres en WSL.
- La persistencia está garantizada mediante Hibernate en modo `update`.

---
*Desarrollado como parte del Mastery Experiment | 2026*
