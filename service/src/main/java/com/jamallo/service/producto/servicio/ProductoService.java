package com.jamallo.service.producto.servicio;

import com.jamallo.service.producto.dto.PaginaResponseDTO;
import com.jamallo.service.producto.dto.ProductoRequestDTO;
import com.jamallo.service.producto.dto.ProductoResponseDTO;
import com.jamallo.service.producto.modelo.Producto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductoService {

    ProductoResponseDTO crear (ProductoRequestDTO dto);

    List<ProductoResponseDTO> listarTodos();

    ProductoResponseDTO buscarPorId(Long id);

    void eliminar(Long id);

    ProductoResponseDTO actualizar (Long id, ProductoRequestDTO dto);

    PaginaResponseDTO<ProductoResponseDTO> listarPaginado(
            int page,
            int size,
            String sortBy,
            String direccion,
            Boolean activo,
            String nombre,
            BigDecimal precioMin,
            BigDecimal precioMax);

    Producto obtenerEntidadPorId (Long id);

    void actualizarImagen (Producto producto);

}
    /*PaginaResponseDTO<ProductoResponseDTO> filtrar (
            String nombre,
            Boolean activo,
            BigDecimal precioMin,
            BigDecimal precioMax,
            int page,
            int size,
            String sortBy
    );*/
