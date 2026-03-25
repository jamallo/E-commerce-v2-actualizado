package com.jamallo.service.seguridad.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.hibernate.sql.exec.spi.StatementCreatorHelper;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.jamallo.service.seguridad.jwt.ServicioJwt;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class FiltroJwtAutenticacion extends OncePerRequestFilter{ //El filtro se ejecuta una vez por request, no se repita, ideal para JWT

    private final ServicioJwt servicioJwt;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        //Con esto indicamos que STRIPE no envía JWT.
        String path = request.getRequestURI();
        if (path.startsWith("/api/webhook/stripe")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 1 - Obtener la cabecera Authorization
        String cabeceraAuth = request.getHeader("Authorization"); //Leer el header Authorization, el cliente enviará: Authorization: Bearer ...


        // 2 - Comprobar  Bearer
        if (cabeceraAuth == null || !cabeceraAuth.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String tokenJwt = cabeceraAuth.substring(7);
        String email = servicioJwt.extraerEmail(tokenJwt);

        // 3 - Sihay email y no hay autenticación previa
        if(email != null && SecurityContextHolder.getContext().getAuthentication() == null) { //Comprobar que no esté ya autenticado, evita: reautenticar, sobrescribir contexto y errores raros

            // 4 - Validar token
            if (servicioJwt.esTokenValido(tokenJwt)) {

                // 5 - Estraer roles
                List<String> roles = servicioJwt.extraerRoles(tokenJwt);

                List<GrantedAuthority> authorities = roles.stream()//List.of(new SimpleGrantedAuthority("ROLE_USER"));/*roles.stream()
                        .map(rol -> new SimpleGrantedAuthority("ROLE_" + rol))
                        .collect(Collectors.toList());

                // 6 - Crear autenticación
                UsernamePasswordAuthenticationToken autenticacion =
                        new UsernamePasswordAuthenticationToken( //Crear autenticación de Spring
                                email,
                                null,
                                authorities
                        );

                // 7 - Guardar autenticación en contexto
                SecurityContextHolder.getContext().setAuthentication(autenticacion); //guardarla en el contexto de seguridad. CLAVE. Spring cree que el usuario está autenticado.

            }

        }

        filterChain.doFilter(request, response); //continuar la cadena de filtros, nunca olvidarla o la request se queda colgada.
    }
}