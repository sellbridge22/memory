# System Error Visual Specification v3.0 (PELS & Timer Integration)

## 🎯 Goal
The UI must not merely display data; it must simulate a critical, structural system failure to drive urgency and perceived necessity for the service purchase.

## 🎨 Core Aesthetic
Cinematic Industrial Drama / Glitch Terminal Interface
**Primary Colors:** `#FF0033` (Alert), `#00FFFF` (Info), Background: `#0A0A14`

## ✨ Global Elements & Animation Specs

### 1. Data Noise Layer (Always On)
*   **Type:** Subtle, low-frequency animated grid pattern overlaying the entire viewport.
*   **Animation:** Constant, slow panning/flickering to suggest constant data processing and monitoring.
*   **Function:** Establishes an ambient state of 'High Surveillance.'

### 2. PELS Trigger Glitch (Data Failure Simulation)
*   **Trigger Condition:** PELS value exceeds $100 or increases by $>5\%$ within a single minute.
*   **Effect Sequence:**
    1.  **Stutter:** Global jitter applied to the numbers/containers for 3 frames.
    2.  **Chromatic Aberration:** Red and Cyan channels split on the displayed number, then rapidly snap back together (0.1s loop).
    3.  **Text Flash:** The PELS value text itself flashes `#FF0033` at a rate of 12Hz for one second.

### 3. System Overload Modal (`[SYSTEM FAILURE]`)
*   **Trigger Condition:** Timer reaches the critical threshold (e.g., 12 hours remaining) OR user inactivity causes an estimated loss spike.
*   **Visual Transition:** Not a fade-in. Must be preceded by a full-screen, red/cyan glitch burst effect and accompanying loud power fluctuation sound cue.
*   **Content Hierarchy:**
    *   **Top (Dominant):** "SYSTEM FAILURE" (Massive Neon Red Typography)
    *   **Middle:** "STRUCTURAL DEFECTION DETECTED." (Academic Warning Text, Pulsating)
    *   **Bottom (Actionable):** PELS readout and Call-to-Action button.

## 🛠️ Technical Implementation Notes for Developer
*   All animations must be optimized for GPU rendering performance. Avoid computationally heavy filters unless absolutely necessary for the 'System Error' effect.
*   Use CSS keyframe animation and Intersection Observer API for efficient trigger handling rather than simple `setInterval` checks alone.