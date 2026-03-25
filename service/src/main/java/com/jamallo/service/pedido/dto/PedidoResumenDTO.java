package com.jamallo.service.pedido.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PedidoResumenDTO {
    private Long id;
    private LocalDateTime fecha;
    private String estado;
    private BigDecimal total;
}