package com.jamallo.service.seguridad.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import com.jamallo.service.seguridad.jwt.FiltroJwtAutenticacion;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@EnableMethodSecurity
@Configuration
@EnableWebSecurity
public class ConfiguracionSeguridadWeb {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain (HttpSecurity http, FiltroJwtAutenticacion filtroJwtAutenticacion)
            throws Exception {

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth
                        //PAGO
                        .requestMatchers("/api/webhook/stripe").permitAll()
                        .requestMatchers("/api/webhook/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/pago/**").permitAll()
                        //PUBLICO
                        .requestMatchers(HttpMethod.GET, "/api/productos/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos").permitAll()
                        .requestMatchers(
                                "/auth/**",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        //CESTA
                        .requestMatchers("/api/cesta/**").authenticated()
                        //PEDIDOS
                        .requestMatchers("/api/pedidos/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/pedidos/mis-pedidos").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/pedidos/checkout").authenticated()
                        //DIRECCIÓN
                        .requestMatchers("/api/perfil/direcciones").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/perfil/direcciones").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/perfil/direcciones").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/perfil/direcciones").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/perfil/direcciones").authenticated()
                        .requestMatchers("/api/direcciones/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/direcciones").authenticated()
                        //ADMINISTRADOR
                        .requestMatchers(HttpMethod.POST, "/api/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/productos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        filtroJwtAutenticacion,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();

    }
}
       /* http
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) //API REST -> sin sesiones
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable()) //Desactivamos CSRF porque usamos API REST (no formularios)
                .httpBasic(basic -> basic.disable()) //desactivar mecanismos por defecto
                .authorizeHttpRequests(auth -> auth //configuración de autorización
                        .requestMatchers(
                                "/auth/**",
                               // "/auth/register",
                              //  "/auth/login",
                                "/swagger-ui/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        .anyRequest()
                        .authenticated());

        return http.build();*/
