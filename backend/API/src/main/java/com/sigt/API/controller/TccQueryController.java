package com.sigt.API.controller;

import com.sigt.API.model.Tcc;
import com.sigt.API.service.TccService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/tccs")
@CrossOrigin(origins = "*")
public class TccQueryController {

    @Autowired
    private TccService service;

    // GET /tccs (Listagem Geral)
    @GetMapping
    public List<Tcc> listarGeral() {
        return service.listarTccs();
    }

    // GET /tccs/{id} (Listagem por ID)
    @GetMapping("/{id}")
    public Tcc listarPorId(@PathVariable Long id) {
        return service.buscarOuFalhar(id);
    }
}
