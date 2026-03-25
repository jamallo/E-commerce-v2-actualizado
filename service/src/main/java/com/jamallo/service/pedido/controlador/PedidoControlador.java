package com.jamallo.service.pedido.controlador;

import com.jamallo.service.pedido.dto.*;
import com.jamallo.service.pedido.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
//@PreAuthorize("isAuthenticated()")
public class PedidoControlador {

    private final PedidoService pedidoService;

    @PostMapping("/checkout")
    public ResponseEntity<PedidoResponseDTO> checkout(
            @RequestBody CheckoutRequestDTO dto,
            Authentication authentication
            ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String email = authentication.getName();
        return ResponseEntity.ok(pedidoService.checkout(email, dto));
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<List<PedidoHistoriaDTO>> misPedidos(
            Authentication authentication
    ) {
        return ResponseEntity.ok(pedidoService.obtenerPedidoUsuario(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDetalleDTO> obtenerDetalle(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                pedidoService.obtenerDetallePedido(id, authentication.getName())
        );
    }

    @PostMapping("/{id}/repetir")
    public List<PedidoRepetirItemDTO> repetirPedido(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return pedidoService.repetirPedido(id, authentication.getName());
    }
}