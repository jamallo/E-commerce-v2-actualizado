package com.jamallo.service.pedido.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class PedidoRepetirItemDTO {
    private Long productoId;
    private String nombre;
    private BigDecimal precio;
    private int cantidad;
}
