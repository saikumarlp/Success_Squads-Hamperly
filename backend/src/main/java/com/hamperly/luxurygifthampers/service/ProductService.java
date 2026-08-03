package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.entity.Category;
import com.hamperly.luxurygifthampers.dto.ProductDTO;

import java.util.List;

public interface ProductService {
    List<Category> getAllCategories();
    List<ProductDTO> getAllProducts();
    List<ProductDTO> getProductsByCategory(Long categoryId);
    ProductDTO getProductById(Long productId);
}
