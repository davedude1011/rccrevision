export const mathJaxConfig = {
    tex: {
      inlineMath: [
        ['$', '$'],       // Supports $...$ for inline math
        ['\\(', '\\)'],   // Supports \( ... \) for inline math
      ],
      displayMath: [
        ['$$', '$$'],     // Supports $$...$$ for display math
        ['\\[', '\\]'],   // Supports \[ ... \] for display math
      ],
    },
    svg: {
      fontCache: 'global' // Ensures the fonts are cached across different equations
    },
  };