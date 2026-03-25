package com.jamallo.service.controlador;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class ControladorAdmin {

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public  String admin() {
        return "Solo ADMIN puede ver esto";
    }
}