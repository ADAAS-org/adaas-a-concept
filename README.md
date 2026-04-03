<img align="left" style="margin-right:40px; margin-bottom:80px;" width="200" height="200" src="https://raw.githubusercontent.com/ADAAS-org/adaas-a-concept/main/docs/a-concept-logo.png" alt="A-Concept Logo">

# A-Concept

**A paradigm shift for software development in the age of AI and [Industry 5.0](https://research-and-innovation.ec.europa.eu/research-area/industrial-research-and-innovation/industry-50_en).**

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![Version](https://img.shields.io/npm/v/@adaas/a-concept)
![Downloads](https://img.shields.io/npm/dm/@adaas/a-concept)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

<br clear="left"/>

---

## Table of Contents

1. [Overview](#overview)
2. [Core Principles](#core-principles)
3. [Getting Started](#getting-started)
4. [Challenges We Solve](#challenges-we-solve)
5. [Performance](#performance)
6. [About the Team](#about-the-team)
7. [License](#license)

---

## Overview

A-Concept is a modern framework built by the ADAAS R&D team to redefine how software is designed and developed in the Industry 5.0 era. It is three things in one:

**The A-Concept Paradigm** — an architectural framework designed to permanently close the gap between software design and actual implementation. Architecture and code are treated as a single artifact, not two separate concerns that drift apart over time.

**The A-Concept Framework** — a software development toolkit that brings the paradigm to life with tools, APIs, and integrations that work across any platform or domain.

**The A-Concept Ecosystem** — a suite of AI-prepared components, libraries, and modules designed to ensure AI-generated code is not only functional but architecturally sound.

---

## Core Principles

### Tools, Not Rules

A-Concept does not dictate how you build. It offers composable primitives that give you flexibility to innovate across platforms, while AI-ready modules accelerate development without sacrificing quality.

### Results Over Ritual

SCRUM was designed for a different era. A-Concept takes a leaner approach — eliminating unnecessary process overhead, simplifying collaboration for solo engineers and lean teams alike, and focusing effort on code that ships rather than ceremonies that don't.

### Architecture and Code as One

The persistent disconnect between high-level design and day-to-day implementation is one of the industry's oldest problems. A-Concept solves it by merging the two into a single self-documenting workflow. Architecture stays synchronised with code automatically — giving developers, architects, and stakeholders a single source of truth at all times.

---

## Getting Started

Install the package:

```bash
cd /your/project/location
npm install @adaas/a-concept
```

Create a concept:

```typescript
import { A_Concept } from '@adaas/a-concept';

const concept = new A_Concept({
    name: 'my-concept'
});
```

Extend it with fragments and containers:

```typescript
import { A_Concept, A_Config, A_ConfigLoader } from '@adaas/a-concept';

(async () => {
    const concept = new A_Concept({
        name: 'test-simple',
        fragments: [
            new A_Config({
                variables: ['CONFIG_VERBOSE'],
                defaults: {
                    'CONFIG_VERBOSE': true
                }
            })
        ],
        containers: [
            new A_ConfigLoader({
                components: [
                    ENVConfigReader
                ]
            })
        ]
    });

    await concept.start();
})();
```

---

## Challenges We Solve

### AI Hallucinations and Incorrect Code Outputs

AI code generation tools produce plausible-looking but architecturally flawed output. Without boundaries, AI contributions drift from the intended design.

A-Concept provides self-documenting primitives and well-defined structural contracts that constrain AI to operate within the correct architectural context — making generated code both functional and sound.

### The Gap Between Design and Implementation

Documentation becomes outdated the moment it is written. Architecture diagrams and the actual codebase diverge within weeks, leaving teams navigating an increasingly unreliable map.

A-Concept merges design and implementation into a single process. The framework's self-documenting capabilities keep architecture permanently synchronised with code, providing clarity for developers and stakeholders without any manual upkeep.

### Scaling and Long-term Evolution

As products grow, technical debt compounds. Most frameworks provide no structural answer to this — teams are left to manage accumulating complexity by hand.

A-Concept is built for long-term evolution. Its modular design allows products to adapt, pivot, and scale without compromising the integrity of the underlying architecture.

### Role Fragmentation and Burnout

Developers are routinely expected to operate across every level of abstraction simultaneously — from low-level performance work to high-level product decisions. The result is burnout and consistently suboptimal output at every level.

A-Concept separates concerns clearly: specialists optimise performance, product-focused engineers drive outcomes, and AI handles routine tasks. Each role operates in its natural domain.

### Outdated Development Methodologies

SCRUM and Waterfall were created for a world without AI, remote-first teams, or continuous deployment. They are ritual-heavy, slow to adapt, and poorly matched to modern development realities.

A-Concept promotes a streamlined approach — leaner processes, AI-assisted execution, and a clear focus on shipping results rather than attending standups.

---

## Performance

Benchmarks measure the core `A_Feature` primitive that underlies every component operation in the engine. All results are from a Node.js environment on standard developer hardware.

### Construction

| Benchmark | ops/sec | mean (ms) | ± % | samples |
|-----------|--------:|----------:|----:|--------:|
| new A_Feature (from component) | 65,413 | 0.0153 | ±11.86% | 47 |
| new A_Feature (from template, 1 step) | 34,465 | 0.0290 | ±19.72% | 32 |
| new A_Feature (from template, 5 steps) | 18,255 | 0.0548 | ±22.42% | 61 |

Construction from a component reference is the fastest path at ~0.015ms per instance. Template-based construction adds parsing overhead — roughly 2× for a single step and 3.6× for five steps.

### Sync Execution

| Benchmark | ops/sec | mean (ms) | ± % | samples |
|-----------|--------:|----------:|----:|--------:|
| call feature (1 sync step) | 53,673 | 0.0186 | ±4.55% | 84 |
| call feature (3 sync extensions) | 58,663 | 0.0170 | ±2.52% | 89 |
| call feature (5 sync extensions) | 35,000 | 0.0286 | ±5.29% | 84 |

Sync execution is stable up to 3 extensions with virtually no overhead over a single step. At 5 extensions the cost rises to ~0.029ms — still well within a single 16.6ms frame budget.

### Full Lifecycle (construct + execute)

| Benchmark | ops/sec | mean (ms) | ± % | samples |
|-----------|--------:|----------:|----:|--------:|
| construct + process (1 step) | 50,865 | 0.0197 | ±11.32% | 71 |
| construct + process (3 extensions) | 56,259 | 0.0178 | ±1.53% | 90 |

The full construct-and-execute lifecycle costs ~0.02ms for both 1 and 3 extensions. The lower variance on the 3-extension run suggests the engine reaches a more stable execution path with multiple extensions.

### Inheritance Impact

| Benchmark | ops/sec | mean (ms) | ± % | samples |
|-----------|--------:|----------:|----:|--------:|
| construct + process (base class) | 89,174 | 0.0112 | ±3.17% | 84 |
| construct + process (1-level child) | 65,307 | 0.0153 | ±1.57% | 91 |
| construct + process (2-level grandchild) | 61,470 | 0.0163 | ±2.57% | 88 |

Each inheritance level adds ~0.004ms. This cost is fixed and does not compound with further depth, making inheritance chains predictable.

### Summary

| Operation | mean (ms) | ops per 60fps frame |
|-----------|----------:|--------------------:|
| Fastest construction | 0.011ms | ~1,500 |
| Template construction (5 steps) | 0.055ms | ~300 |
| Full lifecycle (3 extensions) | 0.018ms | ~900 |
| 2-level inheritance | 0.016ms | ~1,000 |

All operations complete well within a single 16.6ms frame budget.

---

## About the Team

The [ADAAS R&D](https://adaas.org) team is made up of engineers and architects who have lived through decades of evolving software practices. We built A-Concept out of genuine frustration with tools and methodologies that stopped serving developers — and a conviction that the industry deserves something better.

---

## License

This project is licensed under the [Apache License 2.0](LICENSE).

© 2025 ADAAS YAZILIM LİMİTED ŞİRKETİ. All rights reserved.  
All original code and concepts are the intellectual property of ADAAS YAZILIM LİMİTED ŞİRKETİ.
