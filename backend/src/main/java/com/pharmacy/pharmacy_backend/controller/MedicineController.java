package com.pharmacy.pharmacy_backend.controller;

import org.springframework.web.bind.annotation.*;
import com.pharmacy.pharmacy_backend.model.Medicine;
import com.pharmacy.pharmacy_backend.service.MedicineService;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    @Autowired
    private MedicineService service;

    // ADD MEDICINE
    @PostMapping
    public Medicine addMedicine(@RequestBody Medicine medicine) {
        return service.addMedicine(medicine);
    }

    // GET ALL MEDICINES
    @GetMapping
    public List<Medicine> getAllMedicines() {
        return service.getAllMedicines();
    }

    // GET MEDICINE BY ID  (NEW)
    @GetMapping("/{id}")
    public Optional<Medicine> getMedicineById(@PathVariable Long id) {
        return service.getMedicineById(id);
    }

    // UPDATE MEDICINE (NEW)
    @PutMapping("/{id}")
    public Medicine updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine) {
        medicine.setId(id);
        return service.addMedicine(medicine);
    }

    // DELETE MEDICINE
    @DeleteMapping("/{id}")
    public String deleteMedicine(@PathVariable Long id) {
        service.deleteMedicine(id);
        return "Medicine deleted successfully";
    }
}


