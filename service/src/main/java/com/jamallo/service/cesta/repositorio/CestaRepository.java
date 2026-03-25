package com.jamallo.service.cesta.repositorio;

import com.jamallo.service.cesta.modelo.Cesta;
import com.jamallo.service.entidad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CestaRepository extends JpaRepository<Cesta, Long> {
    Optional<Cesta> findByUsuario(Usuario usuarioId);
}