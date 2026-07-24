package com.hamperly.luxurygifthampers.repository;

import com.hamperly.luxurygifthampers.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Boolean existsByMobileNumber(String mobileNumber);
    Boolean existsByMobileNumberAndIdNot(String mobileNumber, Long id);
}
