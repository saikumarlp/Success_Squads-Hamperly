package com.hamperly.luxurygifthampers.service.admin;

import com.hamperly.luxurygifthampers.dto.ProductDTO;
import com.hamperly.luxurygifthampers.dto.admin.AdminProductRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminProductService {
    Page<ProductDTO> searchProducts(String search, Long categoryId, Pageable pageable);
    ProductDTO getProductById(Long id);
    ProductDTO addProduct(AdminProductRequest request);
    ProductDTO updateProduct(Long id, AdminProductRequest request);
    void deleteProduct(Long id);
}
