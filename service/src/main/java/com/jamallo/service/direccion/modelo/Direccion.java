package com.jamallo.service.direccion.modelo;

import com.jamallo.service.entidad.Usuario;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "direccion")
@Getter @Setter
public class Direccion {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    private String nombre;
    private String apellidos;
    private String direccion;
    private String ciudad;
    private String codigoPostal;
    private String provincia;
    private String telefono;

    private boolean principal;
}
