package com.pharmacy.pharmacy_backend.service;

import com.pharmacy.pharmacy_backend.model.Supplier;
import com.pharmacy.pharmacy_backend.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository repository;

    public SupplierService(SupplierRepository repository) {
        this.repository = repository;
    }

    public Supplier addSupplier(Supplier supplier) {
        return repository.save(supplier);
    }

    public List<Supplier> getAllSuppliers() {
        return repository.findAll();
    }

    public void deleteSupplier(Long id) {
        repository.deleteById(id);
    }
}

