# Geometry Video Generator

Generates sacred geometry videos from text-based inputs designed for concert backdrops.

## Features

- **10 Sacred Geometry Patterns**: Flower of Life, Seed of Life, Metatron's Cube, Sri Yantra, Vesica Piscis, Tree of Life, Golden Spiral, Mandala, Hexagram, Pentagram
- **Dynamic Animations**: Rotation, scaling, distortion, and color cycling
- **Smooth Transitions**: 8-second pattern duration with 4-second crossfades
- **Boundary Behaviors**: Bounce, wrap, or fade at screen edges
- **Responsive Design**: Patterns scale to fill screen optimally

## Quick Start

```bash
./run.sh all    # Run tests and build
./run.sh dev    # Start development server
```

## Documentation

- [Pattern Gallery](docs/patterns.md) - Visual guide to all sacred geometry patterns
- [API Reference](docs/api.md) - Technical documentation

## Architecture

```
src/
├── core/           # Core utilities (params, themes, hash)
├── renderer/       # Rendering engine
│   ├── patterns/   # Individual pattern implementations
│   └── boundaries/ # Edge behavior handling
└── ui/            # User interface components
```

## Pattern System

Each pattern is implemented as a self-contained module with:
- **Movement algorithms** for organic motion
- **Color palettes** with dynamic hue shifting  
- **Distortion effects** for visual interest
- **Boundary behaviors** for screen edge handling

See [Pattern Gallery](docs/patterns.md) for visual examples of each pattern.

## Codebase Generation

This codebase is generated via ChatGPT Agent based development.