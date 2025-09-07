#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const patterns = {
  'flower-of-life': {
    color: '#4A90E2',
    generate: () => {
      const circles = [
        { cx: 100, cy: 100, r: 30 },
        { cx: 126, cy: 85, r: 30 },
        { cx: 126, cy: 115, r: 30 },
        { cx: 100, cy: 130, r: 30 },
        { cx: 74, cy: 115, r: 30 },
        { cx: 74, cy: 85, r: 30 }
      ];
      return circles.map(c => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="none" stroke="#4A90E2" stroke-width="2"/>`).join('\n  ');
    }
  },
  'seed-of-life': {
    color: '#32CD32',
    generate: () => {
      const circles = [
        { cx: 100, cy: 100, r: 25 },
        { cx: 122, cy: 87, r: 25 },
        { cx: 122, cy: 113, r: 25 },
        { cx: 100, cy: 125, r: 25 },
        { cx: 78, cy: 113, r: 25 },
        { cx: 78, cy: 87, r: 25 },
        { cx: 100, cy: 75, r: 25 }
      ];
      return circles.map(c => `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="none" stroke="#32CD32" stroke-width="2"/>`).join('\n  ');
    }
  },
  'vesica-piscis': {
    color: '#00CED1',
    generate: () => `<circle cx="85" cy="100" r="40" fill="none" stroke="#00CED1" stroke-width="3"/>
  <circle cx="115" cy="100" r="40" fill="none" stroke="#00CED1" stroke-width="3"/>`
  },
  'pentagram': {
    color: '#DC143C',
    generate: () => `<path d="M100,40 L123,92 L180,92 L137,127 L149,180 L100,150 L51,180 L63,127 L20,92 L77,92 Z" fill="none" stroke="#DC143C" stroke-width="3"/>`
  },
  'hexagram': {
    color: '#4169E1',
    generate: () => `<path d="M100,50 L130,100 L100,150 L70,100 Z" fill="none" stroke="#4169E1" stroke-width="3"/>
  <path d="M70,75 L130,75 L130,125 L70,125 Z" fill="none" stroke="#4169E1" stroke-width="3"/>`
  },
  'golden-spiral': {
    color: '#FFD700',
    generate: () => `<path d="M100,100 Q110,90 120,95 Q135,100 140,115 Q145,140 125,150 Q90,160 75,135 Q60,100 85,80 Q120,60 155,85 Q190,120 170,165" fill="none" stroke="#FFD700" stroke-width="3"/>`
  },
  'metatrons-cube': {
    color: '#8A2BE2',
    generate: () => {
      const positions = [
        [100, 100], [130, 85], [70, 85], [115, 115], [85, 115],
        [145, 100], [55, 100], [130, 130], [70, 130], [160, 85], [40, 85], [160, 115], [40, 115]
      ];
      const circles = positions.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="none" stroke="#8A2BE2" stroke-width="2"/>`);
      const lines = positions.slice(1).map(([x, y]) => `<line x1="100" y1="100" x2="${x}" y2="${y}" stroke="#8A2BE2" stroke-width="1"/>`);
      return [...circles, ...lines].join('\n  ');
    }
  },
  'sri-yantra': {
    color: '#FF1493',
    generate: () => {
      const triangles = [];
      for (let i = 0; i < 9; i++) {
        const size = 20 + i * 8;
        const rotation = i % 2 === 0 ? 0 : 180;
        const points = rotation === 0 
          ? `100,${100-size} ${100-size*0.866},${100+size*0.5} ${100+size*0.866},${100+size*0.5}`
          : `100,${100+size} ${100-size*0.866},${100-size*0.5} ${100+size*0.866},${100-size*0.5}`;
        triangles.push(`<polygon points="${points}" fill="none" stroke="#FF1493" stroke-width="2"/>`);
      }
      return triangles.join('\n  ');
    }
  },
  'mandala': {
    color: '#FF6347',
    generate: () => {
      const elements = [];
      for (let ring = 1; ring <= 3; ring++) {
        const radius = ring * 25;
        const petals = ring * 6;
        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * Math.PI * 2;
          const x = 100 + Math.cos(angle) * radius;
          const y = 100 + Math.sin(angle) * radius;
          elements.push(`<circle cx="${x}" cy="${y}" r="${8 - ring}" fill="none" stroke="#FF6347" stroke-width="2"/>`);
        }
      }
      return elements.join('\n  ');
    }
  },
  'tree-of-life': {
    color: '#228B22',
    generate: () => {
      const sephirot = [
        [100, 60], [100, 140], [80, 80], [120, 80], [80, 100], [120, 100],
        [80, 120], [120, 120], [100, 90], [100, 110]
      ];
      const circles = sephirot.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="none" stroke="#228B22" stroke-width="2"/>`);
      const connections = [[0,8], [8,2], [2,4], [4,6], [6,9], [9,7], [7,5], [5,3], [3,8], [8,9]];
      const lines = connections.map(([a, b]) => 
        `<line x1="${sephirot[a][0]}" y1="${sephirot[a][1]}" x2="${sephirot[b][0]}" y2="${sephirot[b][1]}" stroke="#228B22" stroke-width="1"/>`
      );
      return [...circles, ...lines].join('\n  ');
    }
  }
};

function generateSVG(patternName, content) {
  return `<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  ${content}
</svg>`;
}

function generateAllImages() {
  const docsDir = path.join(__dirname, '..', 'docs', 'images');
  
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  Object.entries(patterns).forEach(([name, pattern]) => {
    const content = pattern.generate();
    const svg = generateSVG(name, content);
    const filePath = path.join(docsDir, `${name}.svg`);
    
    fs.writeFileSync(filePath, svg);
    console.log(`Generated: ${name}.svg`);
  });
  
  console.log('All pattern images generated successfully!');
}

if (require.main === module) {
  generateAllImages();
}

module.exports = { generateAllImages, patterns };