package com.hamperly.luxurygifthampers.repository.admin;

import com.hamperly.luxurygifthampers.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminUserRepository extends JpaRepository<User, Long> {
    
    @Query("SELECT u FROM User u WHERE :search IS NULL OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "u.mobileNumber LIKE CONCAT('%', :search, '%')")
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);
}
