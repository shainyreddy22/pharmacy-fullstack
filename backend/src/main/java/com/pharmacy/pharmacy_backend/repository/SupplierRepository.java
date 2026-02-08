package com.pharmacy.pharmacy_backend.repository;

import com.pharmacy.pharmacy_backend.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
}

