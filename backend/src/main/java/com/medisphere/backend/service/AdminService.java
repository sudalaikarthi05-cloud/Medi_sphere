package com.medisphere.backend.service;

import com.medisphere.backend.dto.AdminUserDetails;
import com.medisphere.backend.dto.UserDto;
import com.medisphere.backend.exception.ResourceNotFoundException;
import com.medisphere.backend.model.Booking;
import com.medisphere.backend.model.Patient;
import com.medisphere.backend.model.User;
import com.medisphere.backend.repository.BookingRepository;
import com.medisphere.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PatientService patientService;
    private final BookingService bookingService;
    private final BookingRepository bookingRepository;

    public AdminService(UserRepository userRepository,
                        PatientService patientService,
                        BookingService bookingService,
                        BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.patientService = patientService;
        this.bookingService = bookingService;
        this.bookingRepository = bookingRepository;
    }

    public List<UserDto> listUsers() {
        return userRepository.findAll().stream().map(this::toDto).toList();
    }

    private UserDto toDto(User user) {
        UserDto dto = new UserDto();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setJoinedDate(user.getCreatedAt());
        dto.setPatientCount(patientService.countPatientsByOwner(user.getEmail()));
        dto.setBookingCount(bookingRepository.countByOwnerEmailAndIsDeleted(user.getEmail(), 0));
        return dto;
    }

    public AdminUserDetails getUserDetails(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("User " + email + " was not found."));
        List<Patient> patients = patientService.getPatientsByOwner(user.getEmail());
        List<Booking> bookings = bookingService.getBookingsByOwner(user.getEmail());
        return new AdminUserDetails(patients, bookings);
    }

    public List<Patient> getAllPatients(String search, String condition, String status, String risk, String owner) {
        return patientService.getAllPatientsForAdmin(search, condition, status, risk, owner);
    }

    public long countActivePatients() {
        return patientService.countActivePatientsForAdmin();
    }

    public List<Booking> getAllBookings(String search, String status, String owner) {
        return bookingService.getAllBookingsForAdmin(search, status, owner);
    }
}