package com.hamperly.luxurygifthampers.repository;

import com.hamperly.luxurygifthampers.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
