package com.jamallo.service.pedido.dto;

import com.jamallo.service.pedido.dto.PedidoItemDTO;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PedidoDetalleDTO {
    private Long id;
    private LocalDateTime fecha;
    private String estado;
    private BigDecimal total;
    private List<PedidoItemDTO> items;
}