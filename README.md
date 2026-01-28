Functional Specification: Newton’s 3rd Law Interactive Simulation
Project Name: Physics Simulation Development (Newton's 3rd Law)
Version: 1.0
Date: January 27, 2026

1. Project Overview
1.1 Purpose
The objective of this project is to develop an interactive web-based simulation to support the learning outcomes of the textbook Connecting to Disciplinary Ideas in Physics. The simulation visualizes Newton’s Third Law of Motion ("Action and Reaction") through two distinct scenarios: contact forces and non-contact (field) forces.
1.2 Target Audience
Primary: Secondary education students studying introductory physics.
Secondary: Teachers demonstrating force interactions in a classroom setting.
1.3 Scope
The simulation includes two interactive labs:
Example 1 (Contact Force): A hammer striking a nail.
Example 2 (Non-Contact Force): The gravitational interaction between the Earth and the Moon.

2. Technical Architecture
2.1 Tech Stack
Core Framework: React (v18.x) with TypeScript.
Build Tool: Rsbuild (as defined in package.json).
UI Framework: Material UI (MUI) v5.
Rendering Engine: HTML5 Canvas API (for high-performance animation).
Icons: Material UI Icons (@mui/icons-material).
2.2 Integration
The simulation is designed as a self-contained component (NewtonLab.tsx) that can be embedded into the Elice.io learning platform (LXP/LMS) or run in a standalone environment like StackBlitz.

3. Functional Requirements
3.1 Global UI & Navigation
Header: Displays the simulation title and a toggle switch to navigate between "Example 1: Contact Force" and "Example 2: Non-Contact Force".
Layout: Split-screen design.
Left Panel: Control inputs (sliders, buttons) and instructions.
Right Panel: Interactive visualization canvas.
Educational Overlay: A floating info button that reveals key physics concepts (e.g., "Forces always come in pairs").

3.2 Scenario A: Contact Force (Hammer & Nail)
Objective: Visualize that when object A (hammer) exerts force on object B (nail), object B exerts an equal and opposite force on object A.
3.2.1 Visual Design
Setting: A wooden surface with a nail partially inserted.
Objects:
Hammer: Drawn horizontally (side profile) with a wooden handle and metal head.
Nail: Metallic grey vertical cylinder.
Animation: The hammer moves vertically downward to strike the nail head.
3.2.2 User Inputs (Controls)
Hammer Mass ($m$): Slider range [1kg – 10kg].
Swing Velocity ($v$): Slider range [1m/s – 10m/s].
Action Buttons:
Strike: Initiates the animation sequence. Disabled during animation.
Reset: Returns hammer and nail to initial positions.
3.2.3 Interaction Logic
Idle Phase: Hammer hovers above the nail.
Strike Phase: Upon clicking "Strike", the hammer accelerates downward.
Impact Phase:
Hammer hits nail.
Nail is driven into the "ground" (depth calculated based on force).
Force Visualization: Two vector arrows appear simultaneously:
$F_{Hammer \to Nail}$ (Red arrow, pointing down).
$F_{Nail \to Hammer}$ (Blue arrow, pointing up).
Hold Duration: The impact state freezes for 2 seconds to allow students to read the force values.
Return Phase: Hammer retracts to the starting position.
3.2.4 Data Output
Real-time display of Force Magnitude (Newtons).
Visual confirmation that $F_{Action} = F_{Reaction}$.

3.3 Scenario B: Non-Contact Force (Earth & Moon)
Objective: Visualize that gravitational force is mutual and equal, regardless of the difference in mass between two bodies.
3.3.1 Visual Design
Setting: Deep space background with starfield.
Objects:
Earth: Procedurally textured sphere (blue oceans, green landmasses, atmosphere glow).
Moon: Procedurally textured sphere (grey surface, craters).
Animation: The Moon orbits the Earth continuously.
3.3.2 User Inputs (Controls)
Earth Mass ($M_1$): Slider range [1 – 10 arbitrary units].
Moon Mass ($M_2$): Slider range [1 – 10 arbitrary units].
Distance ($r$): Slider range [120px – 300px].
3.3.3 Interaction Logic
Real-time Updates: Changing sliders immediately affects the visual size of the planets and the length of the force vectors.
Force Visualization:
Two vector arrows connect the centers of the bodies.
Arrows scale dynamically based on the Inverse Square Law formula: $F \propto \frac{m_1 m_2}{r^2}$.
Arrow lengths are clamped to prevent visual clutter but always remain equal to each other.

4. User Experience (UX) Design
4.1 Responsiveness
The simulation utilizes a flexbox layout to adapt to different screen widths.
On smaller screens, the control panel stacks vertically above the canvas.
4.2 Accessibility
Color Contrast: Force vectors use high-contrast colors (Red/Blue) against the background.
Clear Labeling: All sliders and buttons have descriptive text labels.
Feedback: "Toast" alerts guide the user (e.g., "Click STRIKE to start experiment").

5. Assumptions & Constraints
Physics Simplification:
The "Force" in Scenario 1 is calculated using a simplified impulse approximation ($F \propto mv$) for visualization purposes, rather than a strict rigid-body collision simulation.
The "Gravity" in Scenario 2 is scaled for screen pixels, not real-world astronomical units.
Browser Support: Modern browsers (Chrome, Edge, Firefox, Safari) supporting HTML5 Canvas.

