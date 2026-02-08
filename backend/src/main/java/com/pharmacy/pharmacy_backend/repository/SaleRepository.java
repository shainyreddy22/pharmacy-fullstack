package com.pharmacy.pharmacy_backend.repository;

import com.pharmacy.pharmacy_backend.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}
