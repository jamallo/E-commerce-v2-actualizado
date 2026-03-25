package com.jamallo.service.pedido.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PedidoHistoriaDTO {
    private Long id;
    private LocalDateTime fecha;
    private BigDecimal total;
    private String estado;
}