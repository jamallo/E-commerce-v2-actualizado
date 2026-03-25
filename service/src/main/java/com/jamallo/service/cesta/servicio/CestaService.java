package com.jamallo.service.cesta.servicio;

import com.jamallo.service.cesta.dto.CestaItemDTO;
import com.jamallo.service.cesta.dto.CestaResponseDTO;
import com.jamallo.service.cesta.mapper.CestaMapper;
import com.jamallo.service.cesta.modelo.Cesta;
import com.jamallo.service.cesta.modelo.CestaItem;
import com.jamallo.service.cesta.repositorio.CestaRepository;
import com.jamallo.service.entidad.Usuario;
import com.jamallo.service.producto.modelo.Producto;
import com.jamallo.service.producto.repositorio.ProductoRepository;
import com.jamallo.service.repositorio.RepositorioUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CestaService {

    private final CestaRepository cestaRepository;
    private final ProductoRepository productoRepository;
    private final RepositorioUsuario usuarioRepository;


    private Cesta obtenerOCrearEntidadPorEmail (String email) {
        Usuario usuario = usuarioRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return cestaRepository
                .findByUsuario(usuario)
                .orElseGet(() -> {
                    Cesta nueva = new Cesta();
                    nueva.setUsuario(usuario);
                    return cestaRepository.save(nueva);
                });
    }

    public CestaResponseDTO obtenerOCrearPorEmail(String email) {
        Cesta cesta = obtenerOCrearEntidadPorEmail(email);
        return CestaMapper.toDto(cesta);
    }

    public CestaResponseDTO actualizar(String email, List<CestaItemDTO> items) {
        Cesta cesta = obtenerOCrearEntidadPorEmail(email);
        cesta.getItems().clear();

        for (CestaItemDTO dto : items) {
            Producto producto = productoRepository
                    .findById(dto.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            CestaItem item = new CestaItem();
            item.setProducto(producto);
            item.setCantidad(dto.getCantidad());
            item.setCesta(cesta);
            cesta.getItems().add(item);
        }
        Cesta guardada = cestaRepository.save(cesta);
        return CestaMapper.toDto(guardada);
    }

    public void vaciar(String email) {
        Cesta cesta = obtenerOCrearEntidadPorEmail(email);
        cesta.getItems().clear();
        cestaRepository.save(cesta);
    }
}