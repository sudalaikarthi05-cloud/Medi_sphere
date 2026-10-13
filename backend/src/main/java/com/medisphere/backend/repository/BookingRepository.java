package com.medisphere.backend.repository;

import com.medisphere.backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByOwnerEmailAndIsDeleted(String ownerEmail, int isDeleted);
    List<Booking> findByPatientIdAndIsDeleted(String patientId, int isDeleted);
    List<Booking> findByIsDeleted(int isDeleted);
    Optional<Booking> findByIdAndIsDeleted(String id, int isDeleted);
    long countByOwnerEmailAndIsDeleted(String ownerEmail, int isDeleted);
}