# Medisphere Cognitive Twin: TensorFlow Federated (TFF) Architecture

## Overview
This module implements a privacy-preserving clinical machine learning architecture using **TensorFlow Federated (TFF)** principles and the **Federated Averaging (FedAvg)** aggregation algorithm.

```
                  ┌──────────────────────┐
                  │ Global Model Weights │
                  └──────────┬───────────┘
                             │ Distributes global parameters
        ┌────────────────────┼────────────────────┐
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  Hospital A   │    │  Hospital B   │    │  Hospital C   │
│ Metro General │    │ St. Jude Med  │    │ Valley Health │
│ (Private PHI) │    │ (Private PHI) │    │ (Private PHI) │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │ Local gradients    │ Local gradients    │ Local gradients
        └────────────────────┼────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Federated Averaging  │
                  │ (FedAvg Aggregation) │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │ Risk Scoring &       │
                  │ Decision Support     │
                  └──────────────────────┘
```

## Privacy & Clinical Safeguards
1. **Zero Raw PHI Transfer**: Protected Health Information (PHI) never leaves individual hospital environments.
2. **Federated Averaging**:
   $$W_{t+1} = \sum_{k=1}^K \frac{n_k}{N} W_{t+1}^k$$
3. **Decision Support Labeling**: All generated risk metrics include mandatory clinical disclaimers clarifying that outputs are decision-support insights, not medically validated diagnoses.

## Running the Simulation
```bash
python federated_risk_model.py
```
Or start the standalone HTTP microservice:
```bash
python service.py
```
