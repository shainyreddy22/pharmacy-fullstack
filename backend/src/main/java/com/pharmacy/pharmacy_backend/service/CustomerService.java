package com.pharmacy.pharmacy_backend.service;

import com.pharmacy.pharmacy_backend.model.Customer;
import com.pharmacy.pharmacy_backend.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public Customer addCustomer(Customer customer) {
        return repository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    public void deleteCustomer(Long id) {
        repository.deleteById(id);
    }
}
