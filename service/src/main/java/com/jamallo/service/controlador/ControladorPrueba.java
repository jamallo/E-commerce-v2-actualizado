package com.jamallo.service.controlador;

import com.jamallo.service.seguridad.util.UsuarioAutenticadoUtil;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/prueba")
public class ControladorPrueba {

    @PreAuthorize("hasRoles('USER')")
    @GetMapping
    public String protegido() {
        String email = UsuarioAutenticadoUtil.obtenerEmail();
        return "Hola " + email + ", acceso permitido";
    }
}