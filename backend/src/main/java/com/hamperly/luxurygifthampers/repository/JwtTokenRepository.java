package com.hamperly.luxurygifthampers.repository;

import com.hamperly.luxurygifthampers.entity.JwtToken;
import com.hamperly.luxurygifthampers.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JwtTokenRepository extends JpaRepository<JwtToken, Long> {
    List<JwtToken> findByUser(User user);
    Optional<JwtToken> findByToken(String token);
}
