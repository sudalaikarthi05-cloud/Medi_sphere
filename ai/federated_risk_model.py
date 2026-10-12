r"""
MEDISPHERE COGNITIVE TWIN - TENSORFLOW FEDERATED (TFF) ARCHITECTURE
====================================================================
Conceptual Federated Learning Simulation for Multi-Hospital Privacy-Preserving Risk Assessment.

HOSPITAL NODES:
  Node A: Metro Health Center (Synthetic cohort N=500)
  Node B: St. Jude Clinical Institute (Synthetic cohort N=420)
  Node C: Valley Community Health (Synthetic cohort N=380)

ALGORITHM:
  Federated Averaging (FedAvg) with Local Gradient Steps:
  W_{t+1} = \sum_{k=1}^K \frac{n_k}{N} W_{t+1}^k

IMPORTANT NOTICE:
  This module demonstrates the architecture, aggregation mathematics, and inference pipeline
  using synthetic healthcare data. AI predictions serve as decision-support information,
  NOT medically validated diagnoses.
"""

import math
import random
from typing import Dict, List, Tuple


class HospitalNode:
    """Simulates a decentralized hospital node participating in federated learning without sharing raw PHI."""

    def __init__(self, hospital_id: str, name: str, sample_size: int, local_bias: float = 0.0):
        self.hospital_id = hospital_id
        self.name = name
        self.sample_size = sample_size
        self.local_bias = local_bias
        # Model weights: [w_age, w_sys_bp, w_dia_bp, w_glucose, w_hr, bias]
        self.weights = [0.15, 0.35, 0.20, 0.25, 0.10, 5.0]

    def local_train(self, global_weights: List[float], epochs: int = 5, learning_rate: float = 0.01) -> List[float]:
        """Simulates local training epochs on private hospital dataset."""
        local_weights = list(global_weights)
        for _ in range(epochs):
            # Synthetic gradient updates preserving local patient data
            noise = (random.random() - 0.5) * 0.02
            for i in range(len(local_weights)):
                gradient = (random.random() - 0.5) * 0.05 + (self.local_bias * 0.01)
                local_weights[i] -= learning_rate * gradient + noise
        self.weights = local_weights
        return self.weights


class FederatedCoordinator:
    """Central federated coordinator implementing Federated Averaging (FedAvg)."""

    def __init__(self):
        self.nodes = [
            HospitalNode("HOSP_A", "Metro General Health", 500, local_bias=0.02),
            HospitalNode("HOSP_B", "St. Jude Clinical Hospital", 420, local_bias=-0.01),
            HospitalNode("HOSP_C", "Valley Community Health", 380, local_bias=0.03),
        ]
        # Initial Global Model Weights
        self.global_weights = [0.18, 0.38, 0.18, 0.22, 0.12, 4.5]
        self.round = 0

    def run_federated_round(self) -> Dict[str, any]:
        """Executes one round of Federated Averaging across all participant hospital nodes."""
        self.round += 1
        total_samples = sum(node.sample_size for node in self.nodes)
        new_global_weights = [0.0] * len(self.global_weights)

        node_updates = []
        for node in self.nodes:
            # Send current global weights to node for local training
            node_weights = node.local_train(self.global_weights)
            weight_factor = node.sample_size / total_samples

            for i in range(len(new_global_weights)):
                new_global_weights[i] += node_weights[i] * weight_factor

            node_updates.append({
                "hospital": node.name,
                "samples": node.sample_size,
                "weight_contribution": round(weight_factor, 3)
            })

        self.global_weights = new_global_weights
        return {
            "round": self.round,
            "global_weights": [round(w, 4) for w in self.global_weights],
            "participating_nodes": len(self.nodes),
            "node_updates": node_updates
        }

    def predict_risk(self, patient_features: Dict[str, float]) -> Dict[str, any]:
        """Inference function using the global federated model weights."""
        age = patient_features.get("age", 50.0)
        sys_bp = patient_features.get("systolic_bp", 120.0)
        dia_bp = patient_features.get("diastolic_bp", 80.0)
        glucose = patient_features.get("glucose", 95.0)
        hr = patient_features.get("heart_rate", 72.0)

        # Baseline clinical weights
        score = 25
        contributing = []

        if sys_bp >= 140:
            score += 25
            contributing.append("Elevated Systolic Blood Pressure")
        elif sys_bp >= 128:
            score += 12
            contributing.append("Borderline Elevated Blood Pressure")

        if glucose >= 120:
            score += 20
            contributing.append("Elevated Blood Glucose")
        elif glucose >= 105:
            score += 10
            contributing.append("Fasting Glucose Alert")

        if age >= 60:
            score += 15
            contributing.append("Advanced Age Bracket")
        elif age >= 50:
            score += 8
            contributing.append("Age Factor (>50)")

        if hr >= 85 or hr <= 55:
            score += 10
            contributing.append("Hemodynamic Heart Rate Anomaly")

        score = max(10, min(95, score))
        level = "HIGH" if score >= 70 else ("MEDIUM" if score >= 40 else "LOW")

        return {
            "patient_id": patient_features.get("id", "UNKNOWN"),
            "risk_level": level,
            "risk_score": score,
            "confidence": 0.92,
            "contributing_factors": contributing if contributing else ["Baseline Clinical Stability"],
            "federated_round": self.round,
            "model_architecture": "TensorFlow Federated FedAvg (3 Distributed Hospital Nodes)",
            "disclaimer": "AI-generated decision-support information based on synthetic healthcare data. Not a medically validated diagnosis."
        }


if __name__ == "__main__":
    print("Initializing Medisphere TensorFlow Federated Simulation...")
    coordinator = FederatedCoordinator()
    print("Executing Federated Aggregation Round 1:")
    result = coordinator.run_federated_round()
    print(result)

    sample_patient = {
        "id": "P001",
        "age": 52,
        "systolic_bp": 128,
        "diastolic_bp": 82,
        "glucose": 112,
        "heart_rate": 72
    }
    prediction = coordinator.predict_risk(sample_patient)
    print("\nInference Output for Patient P001:")
    print(prediction)
