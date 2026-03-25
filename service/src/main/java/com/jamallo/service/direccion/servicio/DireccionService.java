package com.jamallo.service.direccion.servicio;

import com.jamallo.service.direccion.modelo.Direccion;
import com.jamallo.service.direccion.repositorio.DireccionRepositorio;
import com.jamallo.service.entidad.Usuario;
import com.jamallo.service.repositorio.RepositorioUsuario;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DireccionService {

    private final RepositorioUsuario usuarioRepository;
    private final DireccionRepositorio direccionRepositorio;

    @Transactional
    public Direccion guardarDireccion(String email, Direccion dto) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow();

        if (dto.isPrincipal()) {
            desmarcarPrincipal(usuario);
        }

        dto.setUsuario(usuario);
        return direccionRepositorio.save(dto);
    }

    @Transactional(readOnly = true)
    public List<Direccion> obtenerDirecciones(String email) {
        return direccionRepositorio.findByUsuarioEmail(email);
    }

    public Direccion actualizar(Long id, Direccion nueva, String email) {
        Direccion d = (Direccion) obtenerPorIdUsuario(id, email);

        if (nueva.isPrincipal()) {
            desmarcarPrincipal(d.getUsuario());
        }

        d.setNombre(nueva.getNombre());
        d.setApellidos(nueva.getApellidos());
        d.setDireccion(nueva.getDireccion());
        d.setCiudad(nueva.getCiudad());
        d.setCodigoPostal(nueva.getCodigoPostal());
        d.setProvincia(nueva.getProvincia());
        d.setTelefono(nueva.getTelefono());
        d.setPrincipal(nueva.isPrincipal());

        return direccionRepositorio.save(d);

    }

    public void eliminar(Long id, String email) {
        Direccion d = (Direccion) obtenerPorIdUsuario(id, email);
        direccionRepositorio.delete(d);
    }

    public void marcarPrincipal(Long id, String email) {
        Direccion d = obtenerPorIdUsuario(id, email);
        desmarcarPrincipal(d.getUsuario());
        d.setPrincipal(true);
        direccionRepositorio.save(d);
    }

    public Direccion obtenerPorIdUsuario(Long id, String email) {
        Direccion d = direccionRepositorio.findById(id)
                .orElseThrow();
        if(!d.getUsuario().getEmail().equals(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return d;
    }

    private void desmarcarPrincipal(Usuario usuario) {
        direccionRepositorio.findByUsuarioAndPrincipalTrue(usuario)
                .ifPresent(d -> {
                    d.setPrincipal(false);
                    direccionRepositorio.save(d);
                });
    }
}
