package com.jamallo.service.repositorio;

import com.jamallo.service.entidad.Rol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RepositorioRol extends JpaRepository <Rol, Long> { //CRUD completo automático

    Optional <Rol> findByNombre (String nombre); //Buscamos roles por nombre: Usuario o Administrador
}