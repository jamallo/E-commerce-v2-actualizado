package com.jamallo.service.controlador;

import com.jamallo.service.dto.LoginResponse;
import com.jamallo.service.dto.LoginResquest;
import com.jamallo.service.dto.RegistroRequest;
import com.jamallo.service.servicio.ServicioAutenticacion;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController //Devuelve JSON directamente,  no vistas HTML
@RequestMapping("/auth") //Prefijo común para autenticación
@RequiredArgsConstructor
public class ControladorAutenticacion {
    private final ServicioAutenticacion servicioAutenticacion;

    @PostMapping("/register")
    public ResponseEntity<String> registrar(
            @RequestBody RegistroRequest request //Activa validaciones de DTOs. Si algo falla -> error automático
    ){
        servicioAutenticacion.registrar(request);
        return ResponseEntity.ok("Usuario registrado correctamente");
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginResquest resquest) {
        return servicioAutenticacion.login(resquest);
    }


}