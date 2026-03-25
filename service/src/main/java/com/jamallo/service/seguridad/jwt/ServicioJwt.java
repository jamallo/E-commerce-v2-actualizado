package com.jamallo.service.seguridad.jwt;

import com.jamallo.service.entidad.Usuario;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

@Service
public interface ServicioJwt {

   List<String> extraerRoles(String token);

   String generarToken(Usuario usuario);

   String extraerEmail(String token);

   boolean esTokenValido(String token);
}