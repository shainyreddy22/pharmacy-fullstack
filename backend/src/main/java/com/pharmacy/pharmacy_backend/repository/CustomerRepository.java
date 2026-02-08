package com.pharmacy.pharmacy_backend.repository;

import com.pharmacy.pharmacy_backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}

