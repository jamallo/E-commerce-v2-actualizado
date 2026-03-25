# 🛒 Jamallo – Full-Stack E-Commerce

E-Commerce web application desarrollada con Angular (frontend) y Spring Boot (backend).  
Proyecto completo orientado a buenas prácticas, experiencia de usuario y arquitectura real en producción.

> 🚧 **ESTADO ACTUAL:** Este repositorio está en proceso de migración a las versiones más recientes del stack tecnológico.  
> Versión estable anterior: Java 25, Spring Boot 4.0.0, Angular 17  
> **Versión objetivo:** Java 26, Spring Boot 4.0.1, Angular 21

--------------------------------------------------

## 👨‍💻 Autor

### Alba Prado Fernández  
Full-Stack Developer  
✨ https://github.com/jamallo

--------------------------------------------------

## 🚀 Descripción

Jamallo es una plataforma de comercio electrónico con funcionalidades completas:

✔ Catálogo de productos  
✔ Gestión de carrito de compra  
✔ Checkout con validaciones y animaciones  
✔ Autenticación con roles (usuario / admin)  
✔ Panel de administración de productos  
✔ APIs REST seguras  
✔ Integración frontend ↔ backend

--------------------------------------------------

## 🧱 Arquitectura del proyecto

### 📂 El repositorio está dividido en dos partes principales:

ecommerce-v2-actualizado/  
├── ecommerce-web/ ← Frontend Angular  
├── service/ ← Backend Spring Boot  
└── README.md  


--------------------------------------------------

## 🧪 Tech Stack (Versión objetivo)

### 🔁 Frontend

| Tecnología | Versión |
|------------|--------|
| Angular | 21 |
| Angular Material | 21 |
| RxJS / Signals | Última |
| SCSS | Temas personalizados (verde & oro) |
| Stripe | Estructura lista para integrar |

### 🛠 Backend

| Tecnología | Versión |
|------------|--------|
| Java | 26 |
| Spring Boot | 4.0.1 |
| Spring Security + JWT | Última |
| Spring Data JPA | Última |
| Base de datos | PostgreSQL 17+ |

### 🗄️ Base de datos

| Tecnología | Versión |
|------------|--------|
| PostgreSQL | 17+ |
| pgAdmin | 9.12 |

--------------------------------------------------

## 🔄 Migración en curso

Este repositorio está siendo actualizado desde versiones anteriores. Los cambios principales incluyen:

### Backend (Spring Boot)
- [x] Migración de `javax.*` a `jakarta.*`
- [x] Actualización de Spring Security (eliminación de `WebSecurityConfigurerAdapter`)
- [x] Configuración de JVM para Java 26 (`--add-opens` flags)
- [x] Verificación de compatibilidad de dependencias

### Frontend (Angular)
- [x] Actualización de Angular 17 → 21 (vía migración incremental)
- [x] Migración a Signals y zoneless change detection
- [x] Migración de Karma a Vitest

### Base de datos
- [x] Pendiente actualización PostgreSQL a versión 17+
- [x] Pendiente actualización pgAdmin a 9.12

--------------------------------------------------

## ✨ Características destacadas

### 🧑‍💻 Frontend Angular

✔ Diseño responsive y moderno  
✔ Estado global del carrito reactivo  
✔ Animaciones UI (animación del total, feedback de acciones)  
✔ Resumen de compra en tiempo real  
✔ Componentes standalone

### 🔐 Autenticación & Roles

✔ Login / Logout  
✔ Gestión de roles (usuario y admin)  
✔ Directiva *appHasRole para control de UI según permisos

--------------------------------------------------

## 🛍️ Flujo de usuario

1 - El usuario navega catálogo de productos  
2 - Añade productos al carrito  
3 - El navbar actualiza el total dinámico  
4 - Rellena dirección de envío  
5 - Visualiza resumen de pedido en vivo  
6 - Confirma pago / datos finales  
7 - Backend registra la orden

--------------------------------------------------

## 🧠 Diseño UI

El frontend destaca por:

✅ Mejores prácticas de UX  
✅ Feedback visual consistente  
✅ Responsividad móvil y escritorio  
✅ Colores temáticos personalizados  
✅ Navbar animado y badge reactivo

--------------------------------------------------

## 📊 Visión técnica

### 🛠 Backend — Arquitectura REST

El backend expone API RESTful seguras usando Spring Security + JWT. Ejemplos:
- `POST /auth/login`
- `GET /productos`
- `POST /pedidos`

Los servicios están estructurados por capas:

Controller → Service → Repository → Entity


Esto facilita la mantenibilidad y pruebas unitarias.

--------------------------------------------------

## 🧩 Buenas prácticas incluidas

✔ Separación de responsabilidades  
✔ Angular Standalone Components  
✔ Reactive Forms con validación  
✔ UX intuitivo  
✔ JWT y roles en backend  
✔ API versionada y escalable

--------------------------------------------------

## 📦 Instalación y ejecución

### Prerrequisitos
- JDK 26
- Node.js 20+ (compatible con Angular 21)
- PostgreSQL 17+
- Angular CLI 21

### Backend
```bash
cd service
./mvnw spring-boot:run

## 🚀 Estado actual del proyecto

**✅ MIGRACIÓN COMPLETADA (marzo 2026)**

| Componente | Versión |
|------------|--------|
| Java | 26 |
| Spring Boot | 4.0.1 |
| PostgreSQL | 18 |
| Angular | 21 |
| Angular Material | 21 |
| Node.js | 24.14 |

### 📝 Notas de la migración

- JDK actualizado de 25 a 26
- Spring Boot actualizado de 4.0.0 a 4.0.1
- Angular ya estaba en versión 21 (no requirió migración)
- pgAdmin actualizado de 9.11 a 9.13
- PostgreSQL actualizado a versión 18