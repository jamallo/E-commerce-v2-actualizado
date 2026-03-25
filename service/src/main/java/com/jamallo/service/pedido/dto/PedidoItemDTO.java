package com.jamallo.service.pedido.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PedidoItemDTO {
    private String nombreProducto;
    private int cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}