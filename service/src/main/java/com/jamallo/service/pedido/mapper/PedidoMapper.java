package com.jamallo.service.pedido.mapper;

import com.jamallo.service.cesta.dto.CestaItemDTO;
import com.jamallo.service.cesta.dto.CestaResponseDTO;
import com.jamallo.service.cesta.modelo.Cesta;
import com.jamallo.service.pedido.dto.PedidoRepetirItemDTO;
import com.jamallo.service.pedido.dto.PedidoResponseDTO;
import com.jamallo.service.pedido.modelo.Pedido;
import com.jamallo.service.pedido.modelo.PedidoItem;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PedidoMapper {
    public List<PedidoRepetirItemDTO> toRepetirPedidoItems(Pedido pedido) {
        return pedido.getItems()
                .stream()
                .map(this::toRepetirItemDTO)
                .collect(Collectors.toList());
    }

    private PedidoRepetirItemDTO toRepetirItemDTO(PedidoItem item) {
        return new PedidoRepetirItemDTO(
                item.getProducto().getId(),
                item.getProducto().getNombre(),
                item.getPrecioUnitario(),
                item.getCantidad()
        );
    }
}
