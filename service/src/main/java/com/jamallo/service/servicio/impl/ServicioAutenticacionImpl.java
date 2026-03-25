package com.jamallo.service.servicio.impl;

import com.jamallo.service.dto.LoginResponse;
import com.jamallo.service.dto.LoginResquest;
import com.jamallo.service.dto.RegistroRequest;
import com.jamallo.service.entidad.Rol;
import com.jamallo.service.entidad.Usuario;
import com.jamallo.service.repositorio.RepositorioRol;
import com.jamallo.service.repositorio.RepositorioUsuario;
import com.jamallo.service.seguridad.jwt.ServicioJwt;
import com.jamallo.service.servicio.ServicioAutenticacion;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ServicioAutenticacionImpl implements ServicioAutenticacion {

    private final RepositorioUsuario repositorioUsuario;
    private final RepositorioRol repositorioRol;
    private final PasswordEncoder passwordEncoder;
    private final ServicioJwt servicioJwt;

    @Override
    public void registrar (RegistroRequest request) {
        if (repositorioUsuario.existsByEmail(request.getEmail())) { //comprobamos si el email existe
            throw new RuntimeException("El email ya está registrado");
        }

        Rol rolUsuario = repositorioRol.findByNombre("USER") //buscamos el rol USER
                .orElseThrow(() -> new RuntimeException("Rol USER no existe"));

        Usuario usuario = new Usuario();
                usuario.setEmail(request.getEmail());
                usuario.setContrasenia(passwordEncoder.encode(request.getContrasenia()));
                usuario.setRoles(Set.of(rolUsuario));

        repositorioUsuario.save(usuario);
    }

    @Override
    public LoginResponse login (LoginResquest resquest) {
        Usuario usuario = repositorioUsuario.findByEmail(resquest.getEmail()) //buscamos el usuario
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!passwordEncoder.matches( //comprobamos contraseñas encriptadas
                resquest.getContrasenia(),
                usuario.getContrasenia()
        )){
            throw new RuntimeException("Credenciales incorrectas");
        }

        String token = servicioJwt.generarToken(usuario);

        return new LoginResponse(token); //si va bien, devolvemos el usuario
    }
}
