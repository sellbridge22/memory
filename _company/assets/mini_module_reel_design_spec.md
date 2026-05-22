# Mini-Module Reels Design Specification (v1.0)
## 1. Overview
*   **Goal:** Communicate the structured process of Diagnosis $\to$ Failure Detection $\to$ Solution Necessity.
*   **Format:** 9:16 Aspect Ratio (Vertical Video).
*   **Aesthetic:** Cinematic Industrial Drama / System Overload.

## 2. Color Palette & Usage
*   **Primary Alert (Danger):** `#FF0033` (Neon Red) - Use for failure states, warnings, and CTA focus points.
*   **Secondary Info (System):** `#00FFFF` (Cyan Blue) - Use for normal data display, stable metrics, and system grid lines.
*   **Base:** `#1A1A2E` (Deep Navy/Black) - Background color.

## 3. Key Components & Specifications
### A. Context Drain Bar (Continuous Element)
*   **Location:** Top edge of the screen (Fixed position).
*   **Initial State:** Cyan Blue, full width (e.g., `width: 100vw; height: 4px;`).
*   **Animation Spec:** Slow decay rate (`linear-timing` function recommended). Must loop continuously throughout Step 1 & 2.
*   **Critical Trigger:** When the bar drops below 30% width, it must change color to `#FF0033` and trigger a subtle screen flicker effect.

### B. PFC Index Meter (Interactive Element)
*   **Location:** Mid-screen, slightly off-center. Gauge/Dial style.
*   **Initial State:** Visible only during Step 2. Initial value should be high (e.g., 75%).
*   **Animation Spec:** Must have a 'micro-vibration' or 'jitter' effect applied to the gauge face, simulating instability.
*   **Critical Trigger:** When the needle crosses the threshold line, the meter must flash red (`#FF0033`) and emit a visible digital ripple effect.

### C. [SYSTEM OVERLOAD] Modal (Full-Screen Overlay)
*   **Trigger:** Step 2 begins.
*   **Visuals:** Semi-transparent black overlay with intense noise/static pattern applied.
*   **Text Animation:** "WARNING: Structural Defect Detected" must appear using a character-by-character, flickering neon red text effect (8Hz Blink Rate).

### D. [SERVICE REQUIRED] Modal (Final CTA)
*   **Trigger:** Step 3 conclusion.
*   **Visuals:** Deep black background with heavy red saturation filter applied.
*   **Text Animation:** "SYSTEM FAILURE" must appear in massive, impactful typography, accompanied by a final, powerful glitch flash sequence.
*   **CTA Button:** Must be the only brightly colored element (e.g., Cyan Blue outline on a Red background) to direct focus.

## 4. Transition Specifications
1.  **Step 1 $\to$ Step 2:** Triggered by Context Drain Bar hitting a low point OR PFC Index exceeding threshold. **Effect:** Strong Glitch Stutter filter applied instantly across the entire screen (Red/Blue Noise burst).
2.  **Step 2 $\to$ Step 3:** The system stabilizes, the noise clears rapidly. **Effect:** A clean 'Digital Wipe' or 'Scan Line' transition that sweeps the screen, revealing the final, controlled CTA screen.