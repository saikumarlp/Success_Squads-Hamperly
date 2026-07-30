package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.ProductDTO;
import com.hamperly.luxurygifthampers.entity.Category;
import com.hamperly.luxurygifthampers.entity.Product;
import com.hamperly.luxurygifthampers.entity.ProductImage;
import com.hamperly.luxurygifthampers.repository.CategoryRepository;
import com.hamperly.luxurygifthampers.repository.ProductImageRepository;
import com.hamperly.luxurygifthampers.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));
        return mapToDTO(product);
    }

    private ProductDTO mapToDTO(Product product) {
        String imageUrl = productImageRepository.findByProductId(product.getId())
                .map(ProductImage::getImageUrl)
                .orElse("");

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getCategoryName())
                .imageUrl(imageUrl)
                .build();
    }
}
