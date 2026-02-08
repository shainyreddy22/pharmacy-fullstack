package com.pharmacy.pharmacy_backend.repository;

import com.pharmacy.pharmacy_backend.model.SalesItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesItemRepository extends JpaRepository<SalesItem, Long> {
}

