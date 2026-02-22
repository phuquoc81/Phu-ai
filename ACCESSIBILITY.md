# Accessibility Policy

**Version:** 1.0.0  
**Last Updated:** 2026-02-22  
**Service:** Phu-ai Web Application  
**Standard:** WCAG 2.1 Level AA  

---

## Table of Contents

1. [Commitment to Accessibility](#commitment-to-accessibility)
2. [Standards We Follow](#standards-we-follow)
3. [Current Accessibility Status](#current-accessibility-status)
4. [Accessibility Features](#accessibility-features)
5. [Known Issues and Limitations](#known-issues-and-limitations)
6. [Testing and Evaluation](#testing-and-evaluation)
7. [Feedback and Contact](#feedback-and-contact)
8. [Formal Complaints](#formal-complaints)
9. [Development Guidelines](#development-guidelines)

---

## 1. Commitment to Accessibility

Phu-ai is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply relevant accessibility standards.

We believe that everyone, regardless of ability, should be able to use our Service. Our goal is to meet or exceed WCAG 2.1 Level AA standards.

---

## 2. Standards We Follow

### WCAG 2.1 (Web Content Accessibility Guidelines)

We aim to conform to [WCAG 2.1](https://www.w3.org/TR/WCAG21/) published by the W3C. WCAG defines requirements for designers and developers to improve accessibility for people with disabilities.

**The four core principles (POUR):**

| Principle      | Description                                                           |
| -------------- | --------------------------------------------------------------------- |
| **Perceivable**    | Information must be presentable in ways users can perceive         |
| **Operable**       | Interface components must be operable                              |
| **Understandable** | Information and UI operation must be understandable                |
| **Robust**         | Content must be robust enough for assistive technologies           |

### Other Standards

- **Section 508** (US Federal Standard) – Referenced for public sector users
- **EN 301 549** (European Accessibility Standard) – For EU users
- **ADA** (Americans with Disabilities Act) – General accessibility principles

---

## 3. Current Accessibility Status

**Target Conformance Level:** WCAG 2.1 Level AA  
**Current Status:** 🟡 Working Toward Full Compliance  

### Conformance Summary

| WCAG 2.1 Criterion                                      | Level | Status        |
| ------------------------------------------------------- | ----- | ------------- |
| 1.1.1 Non-text Content                                  | A     | ✅ Pass        |
| 1.2.1 Audio-only and Video-only (Prerecorded)           | A     | ✅ N/A         |
| 1.2.2 Captions (Prerecorded)                            | A     | ✅ N/A         |
| 1.2.3 Audio Description or Media Alternative            | A     | ✅ N/A         |
| 1.3.1 Info and Relationships                            | A     | ✅ Pass        |
| 1.3.2 Meaningful Sequence                               | A     | ✅ Pass        |
| 1.3.3 Sensory Characteristics                           | A     | ✅ Pass        |
| 1.4.1 Use of Color                                      | A     | ✅ Pass        |
| 1.4.2 Audio Control                                     | A     | ✅ N/A         |
| 2.1.1 Keyboard                                          | A     | ✅ Pass        |
| 2.1.2 No Keyboard Trap                                  | A     | ✅ Pass        |
| 2.2.1 Timing Adjustable                                 | A     | ✅ Pass        |
| 2.2.2 Pause, Stop, Hide                                 | A     | ✅ Pass        |
| 2.3.1 Three Flashes or Below Threshold                  | A     | ✅ Pass        |
| 2.4.1 Bypass Blocks                                     | A     | ✅ Pass        |
| 2.4.2 Page Titled                                       | A     | ✅ Pass        |
| 2.4.3 Focus Order                                       | A     | ✅ Pass        |
| 2.4.4 Link Purpose (In Context)                         | A     | ✅ Pass        |
| 3.1.1 Language of Page                                  | A     | ✅ Pass        |
| 3.2.1 On Focus                                          | A     | ✅ Pass        |
| 3.2.2 On Input                                          | A     | ✅ Pass        |
| 3.3.1 Error Identification                              | A     | ✅ Pass        |
| 3.3.2 Labels or Instructions                            | A     | ✅ Pass        |
| 4.1.1 Parsing                                           | A     | ✅ Pass        |
| 4.1.2 Name, Role, Value                                 | A     | ✅ Pass        |
| 1.4.3 Contrast (Minimum)                                | AA    | ✅ Pass        |
| 1.4.4 Resize Text                                       | AA    | ✅ Pass        |
| 1.4.5 Images of Text                                    | AA    | ✅ Pass        |
| 1.4.10 Reflow                                           | AA    | 🟡 In Progress |
| 1.4.11 Non-text Contrast                                | AA    | ✅ Pass        |
| 1.4.12 Text Spacing                                     | AA    | ✅ Pass        |
| 1.4.13 Content on Hover or Focus                        | AA    | ✅ Pass        |
| 2.4.5 Multiple Ways                                     | AA    | ✅ Pass        |
| 2.4.6 Headings and Labels                               | AA    | ✅ Pass        |
| 2.4.7 Focus Visible                                     | AA    | ✅ Pass        |
| 3.1.2 Language of Parts                                 | AA    | ✅ Pass        |
| 3.2.3 Consistent Navigation                             | AA    | ✅ Pass        |
| 3.2.4 Consistent Identification                         | AA    | ✅ Pass        |
| 3.3.3 Error Suggestion                                  | AA    | ✅ Pass        |
| 3.3.4 Error Prevention (Legal, Financial, Data)         | AA    | ✅ Pass        |
| 4.1.3 Status Messages                                   | AA    | 🟡 In Progress |

---

## 4. Accessibility Features

The following accessibility features are currently implemented:

### Keyboard Navigation
- All interactive elements are accessible via keyboard
- Tab order follows logical reading order
- Skip navigation links provided
- Keyboard shortcuts for common actions

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and roles where needed
- Descriptive alt text for images
- Form labels properly associated with inputs

### Visual Design
- Minimum 4.5:1 contrast ratio for normal text (WCAG AA)
- Minimum 3:1 contrast ratio for large text
- No content conveys meaning through color alone
- Text can be resized up to 200% without loss of content

### Motor Accessibility
- Large clickable/tappable targets (minimum 44x44px)
- No time-limited interactions
- No content that requires precise mouse movements

### Cognitive Accessibility
- Clear and simple language
- Consistent navigation and layout
- Clear error messages with recovery suggestions
- No auto-playing audio or video

---

## 5. Known Issues and Limitations

| Issue                                           | Severity | Target Fix Date  |
| ----------------------------------------------- | -------- | ---------------- |
| Reflow at 320px viewport needs improvement      | Medium   | Q2 2026          |
| Some status messages lack ARIA live regions     | Low      | Q2 2026          |

We are actively working to resolve these issues. If you encounter accessibility issues not listed here, please report them (see [Feedback and Contact](#feedback-and-contact)).

---

## 6. Testing and Evaluation

### Automated Testing
- axe-core accessibility scanner integrated into CI pipeline
- Lighthouse accessibility audits on key pages
- HTML validation using W3C Validator

### Manual Testing
- Keyboard navigation testing
- Screen reader testing with:
  - NVDA (Windows)
  - JAWS (Windows)
  - VoiceOver (macOS/iOS)
  - TalkBack (Android)

### User Testing
- Periodic testing with users with disabilities
- Feedback incorporated into development cycle

---

## 7. Feedback and Contact

We welcome feedback on the accessibility of the Phu-ai Service. If you experience accessibility barriers:

1. **Report an Issue**: https://github.com/phuquoc81/Phu-ai/issues (label: "accessibility")
2. **GitHub:** [@phuquoc81](https://github.com/phuquoc81)

We aim to respond to accessibility feedback within **5 business days** and to resolve accessibility issues within **30 days** where technically feasible.

---

## 8. Formal Complaints

If you are not satisfied with our response to your accessibility concern, you may escalate to relevant accessibility enforcement authorities in your jurisdiction:

- **US**: US Department of Justice ADA Information Line: 1-800-514-0301
- **EU**: Your national equality body or accessibility authority
- **UK**: Equality Advisory and Support Service (EASS)

---

## 9. Development Guidelines

### For Developers Contributing to Phu-ai

All contributors must follow these accessibility guidelines:

#### HTML Structure
- Use semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<footer>`, etc.)
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Provide meaningful `alt` text for all images
- Use `<label>` elements for all form inputs

#### ARIA Usage
- Use ARIA only when HTML semantics are insufficient
- Test ARIA implementations with actual screen readers
- Follow ARIA Authoring Practices Guide (APG)

#### Color and Contrast
- Verify color contrast using tools like WebAIM Contrast Checker
- Never use color alone to convey information
- Test designs in grayscale

#### Interactive Elements
- Ensure all custom controls have keyboard support
- Implement visible focus indicators
- Provide text alternatives for icon-only buttons

#### Testing
- Run automated accessibility tests before submitting PRs
- Test with keyboard navigation
- Test with at least one screen reader

---

## Version History

| Version | Date       | Changes                              |
| ------- | ---------- | ------------------------------------ |
| 1.0.0   | 2026-02-22 | Initial accessibility policy created |
