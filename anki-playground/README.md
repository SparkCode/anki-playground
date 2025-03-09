# Anki Card Creation Tools

A collection of tools for creating Anki cards through the Anki UI.

## Prerequisites

Before using these tools, make sure you have:

1. [Anki](https://apps.ankiweb.net/) installed and running
2. [AnkiConnect](https://ankiweb.net/shared/info/2055492159) add-on installed (code: 2055492159)
3. At least one deck created in Anki

## Tools

This repository includes multiple ways to open the Anki card creation UI with pre-filled content:

### 1. Anki Card Generator Web App

The `anki-card-generator` web application provides a full UI for generating and creating Anki cards:

```bash
cd anki-card-generator
npm install
npm start
```

Open http://localhost:3000 in your browser.

The app now includes two ways to create cards:
- **Create Card** - Directly creates a card in Anki without showing the Anki UI
- **Open in Anki UI** - Opens the Anki Add Cards dialog with prefilled content

### 2. Command Line Tools

#### JavaScript (Node.js)

```bash
# Install dependencies (only needed once)
npm install node-fetch

# Run the script
node anki-cli.js "Front content" "Back content"
```

#### Python

```bash
# No dependencies needed
python anki_gui.py "Front content" "Back content"
```

You can specify a deck by setting the `ANKI_DECK` environment variable:

```bash
# For Node.js
ANKI_DECK="MyDeck" node anki-cli.js "Front content" "Back content"

# For Python
ANKI_DECK="MyDeck" python anki_gui.py "Front content" "Back content"
```

### 3. Browser Integration

When the web app is running, you can directly call the `openAnkiCardUI` function from any JavaScript environment:

```javascript
// Include the script in your HTML
// <script src="anki-direct-ui.js"></script>

// Example card content with front and back parts
const cardContent = `
==front part==
Vocabulary word
==front part==

==bottom part==
Definition and examples
==bottom part==
`;

// Open Anki UI with the card content
openAnkiCard(cardContent);
```

## AnkiConnect API

These tools use the [AnkiConnect API](https://foosoft.net/projects/anki-connect/) to communicate with Anki. The specific endpoint used is `guiAddCards`, which opens the Anki Add Cards dialog with prefilled content.

## Troubleshooting

If you encounter issues:

1. Ensure Anki is running
2. Verify AnkiConnect is installed and working
3. Check the console for error messages
4. Make sure you're using the correct format for card content (with front and back parts)
