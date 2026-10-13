package com.medisphere.backend.repository;

import com.medisphere.backend.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {
    List<Patient> findByIsDeleted(int isDeleted);
    Optional<Patient> findByIdAndIsDeleted(String id, int isDeleted);
    List<Patient> findByOwnerEmailAndIsDeleted(String ownerEmail, int isDeleted);
    Optional<Patient> findByIdAndOwnerEmailAndIsDeleted(String id, String ownerEmail, int isDeleted);
    long countByOwnerEmailAndIsDeleted(String ownerEmail, int isDeleted);
    boolean existsByOwnerEmailAndIsDeleted(String ownerEmail, int isDeleted);
}