# MADHV Solar Energy

## Current State
Full solar energy website with Hero, ProductShowcase, SolarCalculator (Gujarat PGVCL), Services, WhyChooseUs, Testimonials, Contact, Footer sections.

## Requested Changes (Diff)

### Add
- **Location Detection**: Auto-detect user's GPS location and show nearest PGVCL city match for the calculator
- **Solar System Finder/Search**: Search tool where users can find suitable solar system packages by location, roof size, or bill amount
- **Camera Feature (Site Survey)**: Camera-based site survey tool — user takes a photo of their roof/location, captures it as part of a solar installation plan
- **Plan Maker with Picture**: After camera capture, generate a simple solar installation plan card showing: captured photo, recommended system size, cost estimate, and contact CTA — downloadable as a plan summary

### Modify
- SolarCalculator: Pre-fill city when location is detected
- App.tsx: Add new SiteSurvey component

### Remove
- Nothing removed

## Implementation Plan
1. Create `LocationDetector` utility hook using browser Geolocation API to detect coordinates and match to nearest Gujarat PGVCL city
2. Create `SiteSurvey` component with:
   - Step 1: Location detection (GPS button) + city display
   - Step 2: Camera capture of roof/site using `useCamera` hook
   - Step 3: Enter monthly bill or system size
   - Step 4: Show Solar Plan card with captured photo + system recommendation + cost estimate
   - Download plan as image/printable card
3. Add `SiteSurvey` section to App.tsx between SolarCalculator and Services
