package com.jamallo.service.entidad;

import jakarta.persistence.*;
import lombok.*;

@Entity //indica que es una tabla en BBDD
@Table (name = "roles") //nombre de la tabla
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Rol {

    @Id //Clave primaria
    @GeneratedValue (strategy = GenerationType.IDENTITY) //Genera clave autogenerada
    private Long id;

    @Column (nullable = false, unique = true)
    private String nombre; //Administrador o usuario
}