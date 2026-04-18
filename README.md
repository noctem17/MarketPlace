# 🛍️ Marketplace UD

Plataforma tipo marketplace orientada a estudiantes universitarios, permitiendo la promoción de emprendimientos dentro del campus y la comercialización de productos (artículos de segunda mano, servicios, etc.).

---

## 📁 Estructura del Proyecto

```
marketplace-app/
├── frontend/         # App móvil React Native + Expo
├── backend/          # API REST Node.js + TypeScript
├── docker/           # Dockerfiles de cada servicio
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 🏗️ Arquitectura General

El sistema sigue una **arquitectura hexagonal (Ports & Adapters)** organizada en un **monolito modular**, con separación clara entre capas:

```
Frontend (Expo)
      ↓
API REST (Node.js + TypeScript)
      ↓
┌─────────────────────────────────┐
│  Capa de Aplicación (Casos de uso) │
│  Dominio (Entidades + Reglas)       │
│  Infraestructura (DB, Auth, Storage)│
└─────────────────────────────────┘
      ↓
PostgreSQL
```

### Módulos del sistema

- **Usuarios** — registro, login, roles (comprador, vendedor, admin)
- **Emprendimientos** — creación y gestión de negocios universitarios
- **Catálogo** — publicación y listado de productos
- **Transacciones** — historial de compras y ventas
- **Moderación** — reportes y control de publicaciones

---

## 🧑‍💻 Roles de usuario

| Rol | Descripción |
|-----|-------------|
| **Comprador** | Busca productos, consulta historial, encuentra tiendas físicas |
| **Vendedor** | Publica productos, gestiona su emprendimiento |
| **Admin** | Modera publicaciones, gestiona usuarios y reportes |

---

## 📱 Frontend — Expo (React Native)

### Tecnologías
- React Native + Expo SDK
- Expo Router (file-system routing)
- TypeScript
- Zustand o Redux Toolkit (manejo de estado)

### Estructura de carpetas

```
frontend/
├── app/
│   ├── _layout.tsx       # Layout raíz
│   ├── Auth/             # Login, registro
│   ├── Comprador/        # Hub, búsqueda, historial
│   ├── Vendedor/         # Hub vendedor, mis productos
│   └── Admin/            # Dashboard de administración
├── components/           # Componentes reutilizables
├── constants/            # Estilos globales, colores
├── hooks/                # Custom hooks
├── services/             # Llamadas a la API
├── store/                # Estado global
└── utils/                # Funciones utilitarias
```

### Instalación y arranque

```bash
cd frontend
npm install
npx expo start
```

Para abrir en dispositivo físico descarga **Expo Go** y escanea el QR que aparece en la terminal.

---

## ⚙️ Backend — Node.js + TypeScript

### Tecnologías
- Node.js + TypeScript
- NestJS (recomendado) o Express con arquitectura estricta
- PostgreSQL
- JWT para autenticación
- Almacenamiento de imágenes (S3 o equivalente)

### Estructura de carpetas

```
backend/
└── src/
    ├── domain/           # Entidades y reglas de negocio puras
    ├── application/      # Casos de uso
    ├── infrastructure/   # Controladores, repositorios, auth, storage
    ├── shared/           # Errores, tipos, utilidades comunes
    └── main.ts           # Punto de entrada
```

### Instalación y arranque

```bash
cd backend
npm install
npm run dev
```

---

## 🗂️ Historias de Usuario principales

### Comprador
- `HU-01` Como comprador quiero buscar productos por nombre o categoría para encontrar lo que necesito
- `HU-02` Como comprador quiero ver el historial de mis compras para llevar un registro
- `HU-03` Como comprador quiero ver tiendas físicas cercanas dentro del campus
- `HU-04` Como comprador quiero poder convertirme en vendedor desde la app

### Vendedor
- `HU-05` Como vendedor quiero publicar mis productos con foto, nombre y precio
- `HU-06` Como vendedor quiero gestionar mi emprendimiento con nombre y descripción
- `HU-07` Como vendedor quiero ver el historial de mis ventas

### Admin
- `HU-08` Como admin quiero moderar publicaciones reportadas por los usuarios
- `HU-09` Como admin quiero gestionar los usuarios de la plataforma
- `HU-10` Como admin quiero ver métricas generales del marketplace

---

## 🐳 Docker (próximamente)

```bash
docker-compose up --build
```

---

## 👥 Equipo

Proyecto desarrollado por **IEEE CS UD 2026**
