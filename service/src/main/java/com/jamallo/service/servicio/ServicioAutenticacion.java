package com.jamallo.service.servicio;

import com.jamallo.service.dto.LoginResponse;
import com.jamallo.service.dto.LoginResquest;
import com.jamallo.service.dto.RegistroRequest;
import com.jamallo.service.entidad.Usuario;

public interface ServicioAutenticacion {

    void registrar (RegistroRequest request);

    LoginResponse login (LoginResquest request);
}