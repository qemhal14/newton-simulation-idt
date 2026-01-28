# Newton’s 3rd Law: Interactive Physics Simulation

An interactive, web-based simulation developed to support conceptual understanding of Newton’s Third Law of Motion. This project visualizes "Action and Reaction" through both contact and non-contact force scenarios.

---

## 🚀 Project Overview

* **Purpose:** Support learning outcomes for the textbook *Connecting to Disciplinary Ideas in Physics*.
* **Version:** 1.0
* **Release Date:** January 27, 2026
* **Target Audience:** Secondary education students and physics educators.

### 🧪 Simulation Scope
1.  **Example 1 (Contact Force):** A horizontal hammer striking a nail into a wooden surface.
2.  **Example 2 (Non-Contact Force):** The mutual gravitational pull between a textured Earth and Moon.

---

## 🛠 Technical Architecture

| Category | Technology |
| :--- | :--- |
| **Framework** | **React** (v18.x) + **TypeScript** |
| **Build Tool** | **Rsbuild** (Rspack-based) |
| **UI Library** | **Material UI (MUI)** v5 |
| **Rendering** | **HTML5 Canvas API** |
| **Deployment** | **Netlify** |

---

## ⚙️ Functional Requirements

### 🖥 Global UI & Navigation
* **Header:** Toggle switch to navigate between scenarios.
* **Layout:** Split-screen design with a **Control Panel** (Left) and **Interactive Canvas** (Right).
* **Educational Overlay:** Floating info button revealing core physics concepts.

### 🔨 Scenario A: Contact Force (Hammer & Nail)
* **Objective:** Visualize that forces are equal and opposite upon physical impact.
* **Visuals:** Horizontal hammer profile with textured wooden handle.
* **Physics Logic:**
    * **Force Calculation:** Simplified impulse approximation ($F \propto m \cdot v$).
    * **Impact Phase:** Simultaneous display of $F_{Hammer \to Nail}$ (Red) and $F_{Nail \to Hammer}$ (Blue).
    * **UX:** 2-second "Impact Freeze" to allow students to verify data.

### 🌍 Scenario B: Non-Contact Force (Earth & Moon)
* **Objective:** Visualize symmetry in field-based forces regardless of mass difference.
* **Visuals:** Procedurally textured Earth (oceans/continents) and Moon (craters).
* **Physics Logic:**
    * **Formula:** Dynamic scaling based on $F \propto \frac{m_1 m_2}{r^2}$.
    * **Behavior:** Real-time updates to vector arrows as users adjust mass or distance.

---

## 🎨 UX & Accessibility
* **Responsiveness:** Flexbox-based layout that adapts to various screen widths.
* **High Contrast:** Red/Blue vector colors for clear distinction of action/reaction pairs.
* **User Guidance:** Clear labeling and intuitive control sliders.

---

## ⚠️ Assumptions & Constraints
* **Physics Simplification:** Forces are scaled for visual clarity rather than strict astronomical/mechanical units.
* **Browser Support:** Optimized for modern browsers (Chrome, Edge, Safari) with HTML5 Canvas support.

---

## 📦 Installation & Deployment

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Local Development:**
    ```bash
    npm run start
    ```
3.  **Build for Production:**
    ```bash
    npm run build
    ```
