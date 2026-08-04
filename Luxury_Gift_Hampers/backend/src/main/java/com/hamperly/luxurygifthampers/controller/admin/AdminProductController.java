package com.hamperly.luxurygifthampers.controller.admin;

import com.hamperly.luxurygifthampers.dto.ProductDTO;
import com.hamperly.luxurygifthampers.dto.admin.AdminProductRequest;
import com.hamperly.luxurygifthampers.service.admin.AdminProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/products")
public class AdminProductController {

    @Autowired
    private AdminProductService adminProductService;

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "categoryId", required = false) Long categoryId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {
        
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(adminProductService.searchProducts(search, categoryId, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(adminProductService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody AdminProductRequest request) {
        return new ResponseEntity<>(adminProductService.addProduct(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable("id") Long id, @Valid @RequestBody AdminProductRequest request) {
        return ResponseEntity.ok(adminProductService.updateProduct(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") Long id) {
        adminProductService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
