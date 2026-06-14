<!--
Sync Impact Report
- Version change: unset → 1.0.0
- Modified principles: added clean code and basic interface principles
- Added sections: Interface Constraints, Development Workflow
- Removed sections: none
- Templates requiring review: .specify/templates/plan-template.md ✅, .specify/templates/spec-template.md ✅, .specify/templates/tasks-template.md ✅
- Follow-up TODOs: none
-->

# Todo Project Constitution

## Core Principles

### I. Clear, minimal code
Code must be easy to read, with direct structure, simple names, and no hidden behavior. Every function and module must do one thing and avoid unnecessary nesting or indirection.

### II. Basic, explicit interfaces
Every public contract must be small, stable, and easy to understand. Input, output, and error handling must be explicit, with minimal required parameters and clear return values.

### III. Practical correctness by simplicity
Correctness is achieved through simple design and explicit behavior rather than through automation or complex abstractions. Choose the simplest implementation that fully satisfies the requirement.

### IV. No mandatory automated tests
This project prioritizes manual validation, clarity, and straightforward interfaces over mandatory automated test enforcement. Automated tests may be added later only when they reduce overall complexity.

### V. Review through examples
Quality gates rely on clear examples and usage notes. Code changes must include a brief example or explanation showing how the interface is intended to be used and why it is correct.

## Interface Constraints
Public interfaces MUST remain basic and self-contained. Avoid rich configuration objects unless they clearly reduce complexity. Defaults must work without extra setup and interface surface area must stay small.

## Development Workflow
Work in small, self-contained changes. Manual review of code and examples is preferred over broad test suites. Use consistent naming, keep implementation and interface changes limited, and document behavior in code or adjacent examples.

## Governance
This constitution defines project standards for clean code and simple interfaces. Amendments require a clear rationale, an explicit example of the intended improvement, and approval from the project maintainer or team lead.

- Code reviews must verify that interfaces remain simple and that code changes keep complexity low.
- New features must preserve the existing public interface style or explain why a change is needed.
- Automation is not a default requirement; it may be introduced only when it reduces overall complexity and improves clarity.

**Version**: 1.0.0 | **Ratified**: 2026-06-14 | **Last Amended**: 2026-06-14
