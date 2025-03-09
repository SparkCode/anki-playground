# Anki Playground

A collection of Anki tools, utilities and applications to enhance your flashcard creation and learning experience.

## Repository Structure

This repository contains multiple Anki-related tools:

- **anki-card-generator/**: A React application for generating Anki flashcards with AI assistance
- **anki-api.js**: JavaScript utilities for interacting with the Anki Connect API
- **anki-current-card.js**: Utility to work with the currently displayed card in Anki
- **anki-playground/**: Additional Anki utilities, including:
  - **anki-cli.js**: Command-line interface for Anki operations
  - **anki-direct-ui.js**: Direct UI interactions with Anki
  - **anki_gui.py**: Python-based GUI tools for Anki

## Getting Started

### Prerequisites

- [Anki](https://apps.ankiweb.net/) installed
- [AnkiConnect](https://ankiweb.net/shared/info/2055492159) add-on installed
- Node.js and npm for JavaScript utilities
- Python 3.x for Python utilities

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/username/anki-playground.git
   cd anki-playground
   ```

2. Install dependencies:
   ```
   npm install
   ```

### Running the Anki Card Generator App

```
npm start
```

This will start the React application at http://localhost:3000

## Features

- **AI-Assisted Card Creation**: Generate flashcards using AI models
- **Direct Anki Integration**: Add cards directly to your Anki decks
- **Command-line Tools**: Manage Anki from the terminal
- **Python Utilities**: Additional Python-based Anki tools

## Documentation

- [Card Generator Documentation](./anki-card-generator/README.md)
- [CORS Fix Information](./anki-card-generator/CORS-FIX.md)
- [Direct Connection Setup](./anki-card-generator/DIRECT-CONNECTION.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
