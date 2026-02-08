package com.pharmacy.pharmacy_backend.controller;
import com.pharmacy.pharmacy_backend.model.Medicine;
import com.pharmacy.pharmacy_backend.model.Sale;
import com.pharmacy.pharmacy_backend.repository.MedicineRepository;
import com.pharmacy.pharmacy_backend.repository.SaleRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final MedicineRepository medicineRepository;
    private final SaleRepository saleRepository;

    public DashboardController(MedicineRepository medicineRepository,
                               SaleRepository saleRepository) {
        this.medicineRepository = medicineRepository;
        this.saleRepository = saleRepository;
    }

    @GetMapping("/total-medicines")
    public long getTotalMedicines() {
        return medicineRepository.count();
    }

    @GetMapping("/total-sales")
    public long getTotalSales() {
        return saleRepository.count();
    }

    @GetMapping("/low-stock")
    public List<Medicine> getLowStockMedicines() {
        return medicineRepository.findAll()
                .stream()
                .filter(m -> m.getQuantity() < 10)
                .toList();
    }

    @GetMapping("/recent-sales")
    public List<Sale> getRecentSales() {
        return saleRepository.findAll()
                .stream()
                .limit(5)
                .toList();
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary() {

        Map<String, Object> map = new HashMap<>();

        map.put("totalMedicines", medicineRepository.count());
        map.put("totalSales", saleRepository.count());

        double totalRevenue = saleRepository.findAll()
                .stream()
                .mapToDouble(Sale::getTotalAmount)
                .sum();

        map.put("totalRevenue", totalRevenue);

        return map;
    }
}

