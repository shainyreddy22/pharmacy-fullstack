package com.pharmacy.pharmacy_backend.controller;

import com.pharmacy.pharmacy_backend.model.Sale;
import com.pharmacy.pharmacy_backend.model.SalesItem;
import com.pharmacy.pharmacy_backend.service.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales")
public class SaleController {

    private final SaleService service;

    public SaleController(SaleService service) {
        this.service = service;
    }

    @PostMapping
    public Sale createSale(@RequestBody SaleRequest request) {
        return service.createSale(request.getSale(), request.getItems());
    }

    @GetMapping
    public List<Sale> getSales() {
        return service.getAllSales();
    }
}

class SaleRequest {

    private Sale sale;
    private List<SalesItem> items;

    public Sale getSale() {
        return sale;
    }

    public void setSale(Sale sale) {
        this.sale = sale;
    }

    public List<SalesItem> getItems() {
        return items;
    }

    public void setItems(List<SalesItem> items) {
        this.items = items;
    }
}

