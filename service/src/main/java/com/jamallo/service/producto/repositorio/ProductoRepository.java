package com.jamallo.service.producto.repositorio;

import com.jamallo.service.producto.modelo.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface ProductoRepository
        extends JpaRepository<Producto, Long>,
        JpaSpecificationExecutor<Producto>
{


    /*Page<Producto> findByNombreContainingIgnoreCaseAndActivoAndPrecioBetween(
            String nombre,
            Boolean activo,
            BigDecimal precioMin,
            BigDecimal precioMax,
            Pageable pageable);

    Page<Producto> findByNombreContainingIgnoreCase (
            String nombre,
            Pageable pageable
    );

    Page<Producto> findByActivoAndNombreContainingIgnoreCase(
            Boolean activo,
            String nombre,
            Pageable pageable
    );

    Page<Producto> findByActivo(Boolean activo, Pageable pageable);

    Page<Producto> findByPrecioBetween(
            BigDecimal min,
            BigDecimal max,
            Pageable pageable
    );

    Page<Producto> findByNombreContainingIgnoreCaseAndPrecioBetween(
            String nombre,
            BigDecimal min,
            BigDecimal max,
            Pageable pageable
    );

    Page<Producto> findByActivoAndPrecioBetween(
            Boolean activo,
            BigDecimal min,
            BigDecimal max,
            Pageable pageable
    );

    Page<Producto> findByActivoAndNombreContainingIgnoreCaseAndPrecioBetween(
            Boolean activo,
            String nombre,
            BigDecimal min,
            BigDecimal max,
            Pageable pageable
    );*/
}
