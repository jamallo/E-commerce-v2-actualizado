package com.jamallo.service.seguridad.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration // clase de configuración de Spring
public class ConfiguracionSeguridad {

    @Bean // Spring crea y gestiona el objeto
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); //estándar seguro para contraseñas
    }
}