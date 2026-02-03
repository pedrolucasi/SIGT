package com.sigt.API.controller;

import com.sigt.API.model.Tcc;
import com.sigt.API.service.TccService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.lang.reflect.Field;
import org.springframework.util.ReflectionUtils;

@RestController
@RequestMapping("/tccs")
@CrossOrigin(origins = "*") // Necessário para o Angular da Pessoa 3 conseguir ligar-se
public class TccRegistrationController {

    @Autowired
    private TccService service;

    // POST /tccs (Tarefa: Criar Cadastro)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Tcc cadastrar(@RequestBody Tcc tcc) {
        return service.salvar(tcc);
    }

    // DELETE /tccs/{id} (Tarefa: Criar Remoção)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.remover(id);
    }

    // PUT /tccs/{id} (Tarefa: Atualizar dados)
    @PutMapping("/{id}")
    public Tcc atualizar(@PathVariable Long id, @RequestBody Tcc tcc) {
        service.buscarOuFalhar(id); // Garante que o TCC existe
        tcc.setId(id);
        return service.salvar(tcc);
    }

    @PatchMapping("/{id}")
public Tcc atualizarParcial(@PathVariable Long id, @RequestBody Map<String, Object> campos) {
    
    // 1. Busca o TCC atual ou retorna 404
    Tcc tccAtual = service.buscarOuFalhar(id);
    
    // 2. Para cada campo enviado no JSON, atualiza apenas ele no objeto
    campos.forEach((nome, valor) -> {
        Field field = ReflectionUtils.findField(Tcc.class, nome);
        if (field != null) {
            field.setAccessible(true);
            ReflectionUtils.setField(field, tccAtual, valor);
        }
    });
    
    // 3. Salva as alterações
    return service.salvar(tccAtual);
}
}
