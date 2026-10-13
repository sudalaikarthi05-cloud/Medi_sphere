package com.medisphere.backend.service;

import com.medisphere.backend.dto.BookingRequest;
import com.medisphere.backend.exception.ResourceNotFoundException;
import com.medisphere.backend.model.Booking;
import com.medisphere.backend.repository.BookingRepository;
import com.medisphere.backend.security.AccessControlService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final AccessControlService accessControlService;
    private final PatientService patientService;

    public BookingService(BookingRepository bookingRepository,
                          AccessControlService accessControlService,
                          PatientService patientService) {
        this.bookingRepository = bookingRepository;
        this.accessControlService = accessControlService;
        this.patientService = patientService;
    }

    /** A booking may only be created for a patient the caller can access. */
    public Booking createBooking(BookingRequest request) {
        // Throws 404 if the patient does not exist or is not owned by the caller.
        patientService.getPatientById(request.getPatientId());

        Booking booking = new Booking();
        booking.setPatientId(request.getPatientId());
        booking.setOwnerEmail(accessControlService.currentEmail());
        booking.setDoctor(request.getDoctor());
        booking.setDepartment(request.getDepartment());
        booking.setAppointmentDateTime(request.getAppointmentDateTime());
        booking.setReason(request.getReason());
        booking.setStatus(request.getStatus() != null && !request.getStatus().isBlank() ? request.getStatus() : "Scheduled");
        booking.setIsDeleted(0);
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsForCurrentUser() {
        List<Booking> bookings;
        if (accessControlService.isAdmin()) {
            bookings = new ArrayList<>(bookingRepository.findByIsDeleted(0));
        } else {
            bookings = new ArrayList<>(bookingRepository.findByOwnerEmailAndIsDeleted(accessControlService.currentEmail(), 0));
        }
        bookings.sort(Comparator.comparing(Booking::getAppointmentDateTime,
                Comparator.nullsLast(Comparator.naturalOrder())));
        return bookings;
    }

    public List<Booking> getBookingsByOwner(String email) {
        List<Booking> result = new ArrayList<>();
        result.addAll(bookingRepository.findByOwnerEmailAndIsDeleted(email.toLowerCase(), 0));
        result.addAll(bookingRepository.findByOwnerEmailAndIsDeleted(email.toLowerCase(), 1));
        return result;
    }

    public long countBookingsByOwner(String email) {
        return bookingRepository.countByOwnerEmailAndIsDeleted(email.toLowerCase(), 0);
    }

    public Booking cancelBooking(String id) {
        Booking booking = bookingRepository.findByIdAndIsDeleted(id, 0)
                .orElseThrow(() -> new ResourceNotFoundException("Booking " + id + " was not found."));
        if (!accessControlService.isAdmin()) {
            String email = accessControlService.currentEmail();
            if (booking.getOwnerEmail() == null || !booking.getOwnerEmail().equalsIgnoreCase(email)) {
                throw new ResourceNotFoundException("Booking " + id + " was not found.");
            }
        }
        booking.setStatus("Cancelled");
        booking.setIsDeleted(1);
        return bookingRepository.save(booking);
    }

    /** Admin read-only view across every user. */
    public List<Booking> getAllBookingsForAdmin(String search, String status, String owner) {
        List<Booking> bookings = new ArrayList<>();
        bookings.addAll(bookingRepository.findByIsDeleted(0));
        bookings.addAll(bookingRepository.findByIsDeleted(1));

        if (owner != null && !owner.isBlank()) {
            String needle = owner.toLowerCase();
            bookings = bookings.stream()
                    .filter(b -> b.getOwnerEmail() != null && b.getOwnerEmail().contains(needle))
                    .collect(Collectors.toList());
        }
        if (search != null && !search.isBlank()) {
            String needle = search.trim().toLowerCase();
            bookings = bookings.stream().filter(b ->
                    (b.getPatientId() != null && b.getPatientId().toLowerCase().contains(needle)) ||
                    (b.getDoctor() != null && b.getDoctor().toLowerCase().contains(needle)) ||
                    (b.getDepartment() != null && b.getDepartment().toLowerCase().contains(needle)) ||
                    (b.getOwnerEmail() != null && b.getOwnerEmail().contains(needle)) ||
                    (b.getReason() != null && b.getReason().toLowerCase().contains(needle))
            ).collect(Collectors.toList());
        }
        if (status != null && !status.isBlank()) {
            bookings = bookings.stream()
                    .filter(b -> b.getStatus() != null && b.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }
        return bookings;
    }
}