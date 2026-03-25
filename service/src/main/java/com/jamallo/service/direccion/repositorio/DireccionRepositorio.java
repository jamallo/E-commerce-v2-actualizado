package com.jamallo.service.direccion.repositorio;

import com.jamallo.service.direccion.modelo.Direccion;
import com.jamallo.service.entidad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DireccionRepositorio extends JpaRepository<Direccion, Long> {

    List<Direccion> findByUsuarioEmail(String email);

    Optional<Direccion> findByUsuarioAndPrincipalTrue(Usuario usuario);
}
