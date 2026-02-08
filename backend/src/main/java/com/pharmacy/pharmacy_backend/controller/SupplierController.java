package com.pharmacy.pharmacy_backend.controller;

import com.pharmacy.pharmacy_backend.model.Supplier;
import com.pharmacy.pharmacy_backend.service.SupplierService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService service;

    public SupplierController(SupplierService service) {
        this.service = service;
    }

    // ADD SUPPLIER
    @PostMapping
    public Supplier addSupplier(@RequestBody Supplier supplier) {
        return service.addSupplier(supplier);
    }

    // GET ALL SUPPLIERS
    @GetMapping
    public List<Supplier> getSuppliers() {
        return service.getAllSuppliers();
    }

    // GET SUPPLIER BY ID
    @GetMapping("/{id}")
    public Optional<Supplier> getSupplierById(@PathVariable Long id) {
        return service.getAllSuppliers()
                .stream()
                .filter(s -> s.getId().equals(id))
                .findFirst();
    }

    // UPDATE SUPPLIER
    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        supplier.setId(id);
        return service.addSupplier(supplier);
    }

    // DELETE SUPPLIER
    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Long id) {
        service.deleteSupplier(id);
    }
}
