package com.medisphere.backend.kafka;

import com.medisphere.backend.model.Vital;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@EnableScheduling
public class DemoEventGenerator {

    private static final Logger log = LoggerFactory.getLogger(DemoEventGenerator.class);
    private final VitalEventProducer producer;
    private final Random random = new Random();

    public DemoEventGenerator(VitalEventProducer producer) {
        this.producer = producer;
    }

    public Vital generateSimulatedTelemetry(String patientId) {
        // Generate realistic physiological variations around baseline
        int hr = 68 + random.nextInt(14); // 68-81 bpm
        int sys = 120 + random.nextInt(16); // 120-135 mmHg
        int dia = 78 + random.nextInt(8); // 78-85 mmHg
        double spo2 = 97.0 + (random.nextDouble() * 2.0); // 97-99%
        double temp = 98.2 + (random.nextDouble() * 0.6); // 98.2-98.8 °F

        Vital v = new Vital(patientId, hr, sys, dia, Math.round(spo2 * 10.0) / 10.0, Math.round(temp * 10.0) / 10.0);
        producer.publishVitalUpdate(v);
        return v;
    }
}
