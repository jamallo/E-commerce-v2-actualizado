package com.jamallo.service.pedido.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class CheckoutRequestDTO {

    private String nombre;
    private String apellidos;
    private String direccion;
    private String ciudad;
    private String codigoPostal;
    private String provincia;
    private String telefono;

    private List<ItemCheckoutDTO> items;
}