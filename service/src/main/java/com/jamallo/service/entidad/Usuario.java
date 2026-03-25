package com.jamallo.service.entidad;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity //indica que es una tabla en BBDD
@Table (name = "usuarios") //nombre de la tabla
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id //clave primaria
    @GeneratedValue (strategy = GenerationType.IDENTITY) //Para autogenerar la clave
    private Long id;

    @Column (nullable = false, unique = true)
    private String email; //identificador del usuario (login)

    @Column (nullable = false)
    private String contrasenia;

    @ManyToMany (fetch = FetchType.EAGER) //Un usuario puede tener varios roles. Es necesario el rol durante la autentificación.
    @JoinTable (
            name = "usuario_roles",
            joinColumns = @JoinColumn (name = "usuario_id"),
            inverseJoinColumns = @JoinColumn (name = "rol_id")
    )

    private Set<Rol> roles = new HashSet<>();
}