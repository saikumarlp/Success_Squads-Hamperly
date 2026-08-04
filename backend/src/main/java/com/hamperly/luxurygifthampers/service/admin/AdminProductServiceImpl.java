package com.hamperly.luxurygifthampers.service.admin;

import com.hamperly.luxurygifthampers.dto.ProductDTO;
import com.hamperly.luxurygifthampers.dto.admin.AdminProductRequest;
import com.hamperly.luxurygifthampers.entity.Category;
import com.hamperly.luxurygifthampers.entity.Product;
import com.hamperly.luxurygifthampers.entity.ProductImage;
import com.hamperly.luxurygifthampers.repository.CategoryRepository;
import com.hamperly.luxurygifthampers.repository.ProductImageRepository;
import com.hamperly.luxurygifthampers.repository.admin.AdminProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminProductServiceImpl implements AdminProductService {

    @Autowired
    private AdminProductRepository adminProductRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ProductDTO> searchProducts(String search, Long categoryId, Pageable pageable) {
        String query = (search == null || search.trim().isEmpty()) ? null : search.trim();
        return adminProductRepository.searchProducts(query, categoryId, pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = adminProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        return mapToDTO(product);
    }

    @Override
    @Transactional
    public ProductDTO addProduct(AdminProductRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Category ID: " + request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .category(category)
                .build();

        Product savedProduct = adminProductRepository.save(product);

        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            ProductImage pImage = ProductImage.builder()
                    .product(savedProduct)
                    .imageUrl(request.getImageUrl().trim())
                    .build();
            productImageRepository.save(pImage);
        }

        return mapToDTO(savedProduct);
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Long id, AdminProductRequest request) {
        Product product = adminProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Category ID: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(category);

        Product savedProduct = adminProductRepository.save(product);

        // Update image url
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) {
            ProductImage pImage = productImageRepository.findByProductId(id)
                    .orElse(ProductImage.builder().product(savedProduct).build());
            pImage.setImageUrl(request.getImageUrl().trim());
            productImageRepository.save(pImage);
        }

        return mapToDTO(savedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        if (!adminProductRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        adminProductRepository.deleteById(id);
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
