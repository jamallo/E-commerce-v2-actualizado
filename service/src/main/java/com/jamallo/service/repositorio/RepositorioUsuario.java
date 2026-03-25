package com.jamallo.service.repositorio;

import com.jamallo.service.entidad.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RepositorioUsuario extends JpaRepository <Usuario, Long> { //CRUD completo automático
    Optional <Usuario> findByEmail (String email); //para login
    boolean existsByEmail  (String email); //para evitar registros duplicados
}