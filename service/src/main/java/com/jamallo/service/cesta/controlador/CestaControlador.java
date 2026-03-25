package com.jamallo.service.cesta.controlador;

import com.jamallo.service.cesta.dto.CestaItemDTO;
import com.jamallo.service.cesta.dto.CestaResponseDTO;
import com.jamallo.service.cesta.mapper.CestaMapper;
import com.jamallo.service.cesta.modelo.Cesta;
import com.jamallo.service.cesta.servicio.CestaService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cesta")
@RequiredArgsConstructor
//@PreAuthorize("isAuthenticated()")
public class CestaControlador {

    private final CestaService cestaService;

    @GetMapping
    public ResponseEntity<CestaResponseDTO> obtenerCesta(
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        return ResponseEntity.ok(
                cestaService.obtenerOCrearPorEmail(email)
        );
    }

    @PostMapping
    public ResponseEntity<Void> guardarCesta(
            Authentication authentication,
            @RequestBody List<CestaItemDTO> items
            ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        cestaService.actualizar(authentication.getName(), items);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> vaciarCesta(
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        cestaService.vaciar(authentication.getName());
        return ResponseEntity.ok().build();
    }
}