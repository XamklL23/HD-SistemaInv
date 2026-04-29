package com.ventas.ropa.sistema.servicio;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ventas.ropa.sistema.modelo.Cliente;
import com.ventas.ropa.sistema.repositorio.ClienteRepository;

@Service
public class ClienteServicio {
    
    @Autowired
    private ClienteRepository clienteRepository;
    
    public List<Cliente> obtenerTodos() {
        return clienteRepository.findAll();
    }
    
    public Optional<Cliente> obtenerPorId(Long id) {
        return clienteRepository.findById(id);
    }
    
    public Cliente guardar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
    
    public void eliminar(Long id) {
        clienteRepository.deleteById(id);
    }
}
