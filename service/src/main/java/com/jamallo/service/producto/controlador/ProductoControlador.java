package com.jamallo.service.producto.controlador;

import com.jamallo.service.producto.dto.PaginaResponseDTO;
import com.jamallo.service.producto.dto.ProductoRequestDTO;
import com.jamallo.service.producto.dto.ProductoResponseDTO;
import com.jamallo.service.producto.modelo.Producto;
import com.jamallo.service.producto.repositorio.ProductoRepository;
import com.jamallo.service.producto.servicio.ProductoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoControlador {

    private final ProductoService productoService;
    private final ProductoRepository productoRepository;

    //Crear producto - SOLO ADMINISTRADOR
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ProductoResponseDTO> crear(@Valid @RequestBody ProductoRequestDTO dto) {
        /*Producto producto = ProductoMapper.toEntity(dto);
        Producto guardado = productoService.crear(producto);*/
        return ResponseEntity.status(HttpStatus.CREATED).body(productoService.crear(dto));
    }

    //Listar productos - PÚBLICO
    //@GetMapping
    public ResponseEntity<List<ProductoResponseDTO>> listar() {
        return ResponseEntity.ok(
                productoService.listarTodos());
    }

    //PÚBLICO
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> obtener(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.buscarPorId(id));
    }

    //SOLO ADMINISTRADOR
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    //solo ADMINISTRADOR
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ProductoRequestDTO dto) {


        return ResponseEntity.ok((productoService
                .actualizar(id, dto)));
    }

    @GetMapping
    public ResponseEntity<PaginaResponseDTO<ProductoResponseDTO>> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "ASC") String direccion,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) BigDecimal precioMin,
            @RequestParam(required = false) BigDecimal precioMax
    ) {
        return ResponseEntity.ok(
                productoService.listarPaginado(
                        page,
                        size,
                        sortBy,
                        direccion,
                        activo,
                        nombre,
                        precioMin,
                        precioMax));
    }



    @PostMapping("/{id}/imagen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> subirImagen(
            @PathVariable Long id,
            @RequestParam("imagen")MultipartFile imagen
            ) throws IOException {
        Producto producto = productoService.obtenerEntidadPorId(id);

        String nombreArchivo = id + "_" + imagen.getOriginalFilename();
        Path ruta = Paths.get("uploads/productos/" + nombreArchivo);

        Files.createDirectories(ruta.getParent());
        Files.write(ruta, imagen.getBytes());

        producto.setImagenUrl("/uploads/productos/" + nombreArchivo);
        productoService.actualizarImagen(producto);

        return ResponseEntity.ok().build();


    }

    /*@GetMapping
    public ResponseEntity<PaginaResponseDTO<ProductoResponseDTO>> listar (
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(required = false) BigDecimal precioMin,
            @RequestParam(required = false) BigDecimal precioMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy

            ) {
        return ResponseEntity.ok(
                productoService.filtrar(nombre, activo, precioMin, precioMax, page, size, sortBy)
        );
    }*/
}