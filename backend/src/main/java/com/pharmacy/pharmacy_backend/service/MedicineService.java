package com.pharmacy.pharmacy_backend.service;

import com.pharmacy.pharmacy_backend.model.Medicine;
import com.pharmacy.pharmacy_backend.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository repository;

    public Medicine addMedicine(Medicine medicine) {
        return repository.save(medicine);
    }

    public List<Medicine> getAllMedicines() {
        return repository.findAll();
    }

    public Optional<Medicine> getMedicineById(Long id) {
        return repository.findById(id);
    }

    public void deleteMedicine(Long id) {
        repository.deleteById(id);
    }
}

