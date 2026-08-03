package com.hamperly.luxurygifthampers.repository;

import com.hamperly.luxurygifthampers.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE :mobileNumber IS NULL AND 1 = 0")
    Boolean existsByMobileNumber(String mobileNumber);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE :mobileNumber IS NULL AND :id IS NULL AND 1 = 0")
    Boolean existsByMobileNumberAndIdNot(String mobileNumber, Long id);
}
