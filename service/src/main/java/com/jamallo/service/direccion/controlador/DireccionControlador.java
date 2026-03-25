package com.jamallo.service.direccion.controlador;

import com.jamallo.service.direccion.modelo.Direccion;
import com.jamallo.service.direccion.servicio.DireccionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/direcciones")
@RequiredArgsConstructor
public class DireccionControlador {

    private final DireccionService direccionService;

    @GetMapping
    public List<Direccion> misDirecciones(Authentication authentication) {
        return direccionService.obtenerDirecciones(authentication.getName());
    }

    @PostMapping
    public Direccion guardar(@RequestBody Direccion direccion, Authentication authentication) {
        return direccionService.guardarDireccion(authentication.getName(), direccion);
    }

    @PutMapping("/{id}")
    public Direccion actualizar (@PathVariable Long id, @RequestBody Direccion direccion, Authentication authentication) {
        return direccionService.actualizar(id, direccion, authentication.getName());
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id, Authentication authentication) {
        direccionService.eliminar(id, authentication.getName());
    }

    @PostMapping("/{id}/principal")
    public void marcarPrincipal(@PathVariable Long id, Authentication authentication) {
        direccionService.marcarPrincipal(id, authentication.getName());
    }
}
