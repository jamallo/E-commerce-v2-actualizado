package com.jamallo.service.cesta.modelo;

import com.jamallo.service.cesta.modelo.Cesta;
import com.jamallo.service.producto.modelo.Producto;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cesta_items")
@Setter
@Getter
public class CestaItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cesta_id")
    private Cesta cesta;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    private int cantidad;
}