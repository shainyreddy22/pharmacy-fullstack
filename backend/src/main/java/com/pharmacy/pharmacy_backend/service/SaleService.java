package com.pharmacy.pharmacy_backend.service;

import com.pharmacy.pharmacy_backend.model.Medicine;
import com.pharmacy.pharmacy_backend.model.Sale;
import com.pharmacy.pharmacy_backend.model.SalesItem;
import com.pharmacy.pharmacy_backend.repository.MedicineRepository;
import com.pharmacy.pharmacy_backend.repository.SaleRepository;
import com.pharmacy.pharmacy_backend.repository.SalesItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleService {

    private final SaleRepository saleRepository;
    private final SalesItemRepository itemRepository;
    private final MedicineRepository medicineRepository;

    public SaleService(SaleRepository saleRepository,
                       SalesItemRepository itemRepository,
                       MedicineRepository medicineRepository) {
        this.saleRepository = saleRepository;
        this.itemRepository = itemRepository;
        this.medicineRepository = medicineRepository;
    }

    public Sale createSale(Sale sale, List<SalesItem> items) {

        Sale savedSale = saleRepository.save(sale);

        for (SalesItem item : items) {

            item.setSaleId(savedSale.getId());
            itemRepository.save(item);

            Medicine med = medicineRepository.findById(item.getMedicineId()).orElse(null);

            if (med != null) {
                med.setQuantity(med.getQuantity() - item.getQuantity());
                medicineRepository.save(med);
            }
        }

        return savedSale;
    }

    public List<Sale> getAllSales() {
        return saleRepository.findAll();
    }
}

