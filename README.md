# 🛒 Jamallo – Full-Stack E-Commerce

E-Commerce web application desarrollada con Angular (frontend) y Spring Boot (backend).  
Proyecto completo orientado a buenas prácticas, experiencia de usuario y arquitectura real en producción.  

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

E-commerce/  
├── ecommerce-web/          ← Frontend Angular  
├── service/                ← Backend Spring Boot (Java 25)  
└── README.md  

--------------------------------------------------  

## 🧪 Tech Stack  

### 🔁 Frontend  

Angular 17  
Angular Material (UI + animaciones)  
RxJS / Reactive Forms  
SCSS con temas personalizados (verde & oro)  
Stripe para pago (estructura lista para integrar)  

### 🛠 Backend  

Java 25  
Spring Boot 4.0  
Spring Web (REST API)  
Spring Security + JWT  
Spring Data JPA  
Base de datos (MySQL/PostgreSQL según configuración)  

Este backend ofrece APIs seguras que atienden a:  
autenticación y autorización  
gestión de usuarios y roles  
productos, carrito y pedidos  
endpoints protegidos por roles  

--------------------------------------------------  

## ✨ Características destacadas  

### 🧑‍💻 Frontend Angular  

✔ Diseño responsive y moderno  
✔ Estado global del carrito reactivo  
✔ Animaciones UI (animación del total, feedback de acciones)  
✔ Resumen de compra en tiempo real  
✔ Componentes standalone Angular 17  

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
POST /auth/login  
GET  /productos  
POST /pedidos  

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
