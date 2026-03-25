package com.jamallo.service.producto.modelo;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "productos")
public class Producto {

    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Getter
    @Setter
    @Column(nullable = false)
    private String nombre;

    @Getter
    @Setter
    private String descripcion;

    @Getter
    @Setter
    @Column(nullable = false)
    private BigDecimal precio;

    @Getter
    @Setter
    private boolean activo = true;

    @Setter
    @Getter
    @Column(name = "imagen_url")
    private String imagenUrl;


}