module.exports = {
  bot: {
    prefix: '!',
    colors: {
      primary: 0x3498db,
      success: 0x2ecc71,
      error: 0xe74c3c,
      warning: 0xf39c12,
      info: 0x9b59b6,
      welcome: 0x00ff00
    }
  },
  
  welcome: {
    defaultChannelNames: ['welcome', 'general', 'lobby', 'main'],
    serverRules: [
      '📝 Be respectful to all members',
      '🚫 No spam, harassment, or offensive content',
      '💬 Keep conversations in appropriate channels',
      '🎯 Stay on topic in each channel',
      '🔇 No excessive use of caps or mentions',
      '🤝 Help maintain a friendly community environment'
    ]
  },

  education: {
    scheduleHour: 9, // 9 AM
    categories: {
      programming: {
        channelNames: ['programming', 'coding', 'dev', 'development'],
        terms: [
          {
            term: "Algorithm",
            definition: "A step-by-step procedure for solving a problem or completing a task.",
            example: "Sorting algorithms like QuickSort arrange data in order.",
            category: "Fundamentals"
          },
          {
            term: "API (Application Programming Interface)",
            definition: "A set of protocols and tools for building software applications.",
            example: "REST APIs allow different applications to communicate over HTTP.",
            category: "Web Development"
          },
          {
            term: "Recursion",
            definition: "A programming technique where a function calls itself to solve smaller instances of the same problem.",
            example: "Calculating factorial: factorial(5) = 5 * factorial(4)",
            category: "Programming Concepts"
          },
          {
            term: "Variable",
            definition: "A storage location with an associated name that contains data.",
            example: "let age = 25; // 'age' is a variable storing the value 25",
            category: "Fundamentals"
          },
          {
            term: "Function",
            definition: "A reusable block of code that performs a specific task.",
            example: "function greet(name) { return 'Hello, ' + name; }",
            category: "Programming Concepts"
          }
        ]
      },
      science: {
        channelNames: ['science', 'physics', 'chemistry', 'biology'],
        terms: [
          {
            term: "Photosynthesis",
            definition: "The process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen.",
            example: "6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂",
            category: "Biology"
          },
          {
            term: "Quantum Entanglement",
            definition: "A phenomenon where particles become connected and instantly affect each other regardless of distance.",
            example: "When measuring one entangled particle's spin, the other's spin is instantly determined.",
            category: "Physics"
          },
          {
            term: "Mitosis",
            definition: "The process of cell division that results in two identical daughter cells.",
            example: "Skin cells reproduce through mitosis to replace damaged tissue.",
            category: "Biology"
          },
          {
            term: "Newton's First Law",
            definition: "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force.",
            example: "A hockey puck sliding on ice continues moving until friction stops it.",
            category: "Physics"
          }
        ]
      },
      general: {
        channelNames: ['general', 'education', 'learning', 'study'],
        terms: [
          {
            term: "Critical Thinking",
            definition: "The objective analysis and evaluation of an issue to form a judgment.",
            example: "Questioning assumptions, analyzing evidence, and considering multiple perspectives.",
            category: "Study Skills"
          },
          {
            term: "Mnemonic Device",
            definition: "A memory aid technique that helps in information retention and retrieval.",
            example: "ROY G. BIV for remembering rainbow colors: Red, Orange, Yellow, Green, Blue, Indigo, Violet.",
            category: "Learning Techniques"
          },
          {
            term: "Active Learning",
            definition: "A learning approach that involves actively engaging with material rather than passively receiving information.",
            example: "Taking notes, asking questions, and discussing concepts with others.",
            category: "Study Skills"
          },
          {
            term: "Spaced Repetition",
            definition: "A learning technique that involves reviewing information at increasing intervals.",
            example: "Review new vocabulary after 1 day, then 3 days, then 1 week, then 2 weeks.",
            category: "Learning Techniques"
          }
        ]
      },
      mathematics: {
        channelNames: ['math', 'mathematics', 'calculus', 'algebra'],
        terms: [
          {
            term: "Derivative",
            definition: "A measure of how a function changes as its input changes.",
            example: "The derivative of f(x) = x² is f'(x) = 2x",
            category: "Calculus"
          },
          {
            term: "Prime Number",
            definition: "A natural number greater than 1 that has no positive divisors other than 1 and itself.",
            example: "2, 3, 5, 7, 11, 13 are the first six prime numbers.",
            category: "Number Theory"
          },
          {
            term: "Pythagorean Theorem",
            definition: "In a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.",
            example: "a² + b² = c² where c is the hypotenuse",
            category: "Geometry"
          }
        ]
      }
    }
  }
};