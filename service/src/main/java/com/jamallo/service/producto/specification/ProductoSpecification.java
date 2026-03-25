package com.jamallo.service.producto.specification;

import com.jamallo.service.producto.modelo.Producto;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;

public class ProductoSpecification {

    public static Specification<Producto> filtrar (
            String nombre,
            Boolean activo,
            BigDecimal precioMin,
            BigDecimal precioMax
    ){
        return ((root, query, criteriaBuilder) -> {

            var predicate = criteriaBuilder.conjunction();

            System.out.println("=== PRODUCTO SPECIFICATION ===");
            System.out.println("Nombre recibido: " + (nombre != null ? "'" + nombre + "'" : "null"));
            System.out.println("Activo recibido: " + activo);
            System.out.println("PrecioMin recibido: " + precioMin);
            System.out.println("PrecioMax recibido: " + precioMax);

            if (nombre != null && !nombre.isBlank()) {
                String nombreBusqueda = "%" + nombre.toLowerCase() + "%";
                System.out.println("Aplicando filtro nombre LIKE: " + nombreBusqueda);

                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("nombre")),
                                nombreBusqueda
                ));
            }

            if (activo != null) {
                System.out.println("Aplicando filtro activo: " + activo);
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.equal(root.get("activo"), activo)
                );
            }

            if (precioMin != null) {
                System.out.println("Aplicando filtro precioMin: " + precioMin);
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.greaterThanOrEqualTo(root.get("precio"), precioMin)
                );
            }

            if (precioMax != null) {
                System.out.println("Aplicando filtro precioMax: " + precioMax);
                predicate = criteriaBuilder.and(
                        predicate,
                        criteriaBuilder.lessThanOrEqualTo(root.get("precio"), precioMax)
                );
            }

            System.out.println("Predicates finales: " + predicate);
            System.out.println("=============================");

            return predicate;
        });

    }
}