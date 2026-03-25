package com.jamallo.service.pedido.service;

import com.jamallo.service.cesta.modelo.Cesta;
import com.jamallo.service.cesta.modelo.CestaItem;
import com.jamallo.service.cesta.repositorio.CestaRepository;
import com.jamallo.service.entidad.Usuario;
import com.jamallo.service.pedido.dto.*;
import com.jamallo.service.pedido.mapper.PedidoMapper;
import com.jamallo.service.pedido.modelo.EstadoPedido;
import com.jamallo.service.pedido.modelo.Pedido;
import com.jamallo.service.pedido.modelo.PedidoItem;
import com.jamallo.service.repositorio.RepositorioUsuario;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Service
@RequiredArgsConstructor
public class PedidoService {
    private final PedidoRepository pedidoRepository;
    private final CestaRepository cestaRepository;
    private final RepositorioUsuario usuarioRepository;
    private final PedidoMapper pedidoMapper;



    @Transactional
    public PedidoResponseDTO checkout(String email, CheckoutRequestDTO dto) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Cesta cesta = cestaRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "La cesta está vacía"));

        if (cesta.getItems().isEmpty()) {
            throw new ResponseStatusException(BAD_REQUEST, "La cesta está vacía");
        }

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setEstado(EstadoPedido.PENDIENTE);
        pedido.setFechaCreacion(LocalDateTime.now());
        pedido.setItems(new ArrayList<>());

        pedido.setNombre(dto.getNombre());
        pedido.setApellidos(dto.getApellidos());
        pedido.setDireccion(dto.getDireccion());
        pedido.setCiudad(dto.getCiudad());
        pedido.setCodigoPostal(dto.getCodigoPostal());
        pedido.setProvincia(dto.getProvincia());
        pedido.setTelefono(dto.getTelefono());

        BigDecimal total = BigDecimal.ZERO;

        for (CestaItem item : cesta.getItems()) {
            PedidoItem pedidoItem = new PedidoItem();
            pedidoItem.setPedido(pedido);
            pedidoItem.setProducto(item.getProducto());
            pedidoItem.setCantidad(item.getCantidad());
            pedidoItem.setPrecioUnitario(item.getProducto().getPrecio());

            total = total.add(
                    item.getProducto().getPrecio()
                            .multiply(BigDecimal.valueOf(item.getCantidad()))
            );

            pedido.getItems().add(pedidoItem);
        }

        pedido.setTotal(total);

        pedidoRepository.save(pedido);

        //VACIAR CESTA AUTOMÁTICAMENTE
        cesta.getItems().clear();
        cestaRepository.save(cesta);

        PedidoResponseDTO response = new PedidoResponseDTO();
        response.setId(pedido.getId());
        response.setTotal(pedido.getTotal());
        response.setEstado(pedido.getEstado().name());

        return response;
    }

    @Transactional(readOnly = true)
    public List<PedidoHistoriaDTO> obtenerPedidoUsuario(String email) {
        return pedidoRepository
                .findByUsuarioEmailOrderByFechaCreacionDesc(email)
                .stream()
                .map(pedido -> {
                    PedidoHistoriaDTO dto = new PedidoHistoriaDTO();
                    dto.setId(pedido.getId());
                    dto.setFecha(pedido.getFechaCreacion());
                    dto.setTotal(pedido.getTotal());
                    dto.setEstado(pedido.getEstado().name());
                    return dto;
                }).toList();
    }

    @Transactional(readOnly = true)
    public PedidoDetalleDTO obtenerDetallePedido(Long pedidoId, String email) {
        Pedido pedido = pedidoRepository
                .findByIdAndUsuarioEmail(pedidoId, email)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));

        PedidoDetalleDTO dto = new PedidoDetalleDTO();
        dto.setId(pedido.getId());
        dto.setFecha(pedido.getFechaCreacion());
        dto.setEstado(pedido.getEstado().name());
        dto.setTotal(pedido.getTotal());

        List<PedidoItemDTO> items = pedido.getItems().stream().map(item -> {
            PedidoItemDTO itemDTO = new PedidoItemDTO();
            itemDTO.setNombreProducto(item.getProducto().getNombre());
            itemDTO.setCantidad(item.getCantidad());
            itemDTO.setPrecioUnitario(item.getPrecioUnitario());
            itemDTO.setSubtotal(item.getPrecioUnitario()
                    .multiply(BigDecimal.valueOf(item.getCantidad())));
            return itemDTO;
        }).toList();

        dto.setItems(items);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<PedidoRepetirItemDTO> repetirPedido(Long pedidoId, String email) {

        Pedido pedido = pedidoRepository.findByIdAndUsuarioEmail(pedidoId, email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (!pedido.getUsuario().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        return pedidoMapper.toRepetirPedidoItems(pedido);
    }

    @Transactional(readOnly = true)
    public Pedido obtenerPedidoPendiente(String email) {

        return pedidoRepository
                .findFirstByUsuarioEmailAndEstadoOrderByFechaCreacionDesc(
                        email,
                        EstadoPedido.PENDIENTE
                ).orElseThrow(() ->
                        new RuntimeException("No hay pedido pendiente para el usuario"));
    }

    @Transactional
    public void asignarPaymentIntent(Long pedidoId, String paymentIntentId) {

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() ->
                        new RuntimeException("Pedido no encontrado"));

        pedido.setPaymentIntentId(paymentIntentId);
        pedidoRepository.save(pedido);
    }

    @Transactional
    public void marcarPedidoComoPagado(String paymentIntentId) {
        var pedidoOpt = pedidoRepository.findByPaymentIntentId(paymentIntentId);

        if (pedidoOpt.isEmpty()) {
            System.out.println(("No existe pedido para paymentIntentId: " + paymentIntentId));
            return;
        }

        Pedido pedido = pedidoOpt.get();

        if (pedido.getEstado() == EstadoPedido.CONFIRMADO) {
            System.out.println("Pedido ya confirmado" + pedido.getId());
            return;
        }

        pedido.setEstado(EstadoPedido.CONFIRMADO);
        pedidoRepository.save(pedido);

        System.out.println("Pedido confirmado correctamente: " + pedido.getId());
    }
}