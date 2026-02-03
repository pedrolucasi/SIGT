package com.sigt.API.service;

import com.sigt.API.model.Tcc;
import com.sigt.API.repository.TccRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.util.List;

@Service
public class TccService {
    @Autowired
    private TccRepository repository;

    public List<Tcc> listarTccs() { return repository.findAll(); }

    public Tcc buscarOuFalhar(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "TCC não encontrado"));
    }

    public Tcc salvar(Tcc tcc) { return repository.save(tcc); }

    public void remover(Long id) {
        Tcc tcc = buscarOuFalhar(id);
        repository.delete(tcc);
    }
}