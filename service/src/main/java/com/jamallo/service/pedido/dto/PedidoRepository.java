package com.jamallo.service.pedido.dto;

import com.jamallo.service.pedido.modelo.EstadoPedido;
import com.jamallo.service.pedido.modelo.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByUsuarioEmailOrderByFechaCreacionDesc(String email);
    Optional<Pedido> findByIdAndUsuarioEmail(Long id, String email);

    Optional<Pedido> findByPaymentIntentId(String paymentIntentId);

    Optional<Pedido> findFirstByUsuarioEmailAndEstadoOrderByFechaCreacionDesc(
            String email,
            EstadoPedido estadoPedido
    );

}