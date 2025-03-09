# Technical Context: Anki API Tools

## Technologies Used

### Core Technologies
- **Node.js**: Runtime environment for executing JavaScript code server-side
- **HTTP Module**: Native Node.js module for making HTTP requests to AnkiConnect
- **JSON**: Used for data exchange with the AnkiConnect API
- **Promises**: Used for handling asynchronous operations

### Development Tools
- **GitHub**: Version control and project hosting
- **JavaScript (ES6+)**: Modern JavaScript features including async/await, classes, and arrow functions
- **JSDoc**: Documentation comments for describing methods and parameters

## Dependencies

### Runtime Dependencies
- **None**: The project deliberately uses only built-in Node.js modules to minimize dependencies

### External Systems
- **Anki**: The flashcard application that must be running with AnkiConnect installed
- **AnkiConnect Add-on**: Must be installed in Anki (code: `2055492159`)

## Technical Constraints

### API Limitations
- **AnkiConnect Must Be Running**: Scripts will fail if Anki with AnkiConnect is not active
- **Local Operation Only**: By default, only works with locally running Anki instances
- **Rate Limited**: Implementation enforces a 1-second delay between API calls

### Security Considerations
- **Local Network Only**: AnkiConnect exposes an HTTP server, which should only be accessible on the local machine
- **No Authentication**: AnkiConnect doesn't provide authentication mechanisms by default
- **Potential Data Loss**: Incorrect API usage could lead to unexpected modification of Anki data

## Implementation Details

### API Request Format
Requests to AnkiConnect follow this format:
```json
{
  "action": "actionName",
  "version": 6,
  "params": {
    "param1": "value1",
    "param2": "value2"
  }
}
```

### API Response Format
Responses from AnkiConnect follow this format:
```json
{
  "result": resultData,
  "error": null
}
```

Or in case of error:
```json
{
  "result": null,
  "error": "Error message"
}
```

### AnkiConnect API Version
The project uses version 6 of the AnkiConnect API, which is specified in each request.

### Card and Note Structure
- **Cards**: The items shown during review, containing a question and answer
- **Notes**: The underlying data storage unit that can generate multiple cards
- **Fields**: Named data elements within a note (e.g., "Front", "Back", "Example")
- **Decks**: Collections of cards organized for study

## Development Setup

### Prerequisites
1. Install Node.js (v12 or higher recommended)
2. Install Anki from https://apps.ankiweb.net/
3. Install AnkiConnect add-on in Anki (code: `2055492159`)

### Running the Scripts
1. Clone or download the repository
2. Ensure Anki is running with AnkiConnect installed
3. Execute the scripts using Node.js:
   ```bash
   node anki-current-card.js
   ```
   Or with executable permission:
   ```bash
   chmod +x anki-current-card.js
   ./anki-current-card.js
   ```

### Customization Points
- **Host and Port**: Can be customized when creating the AnkiApi instance
- **Delay Duration**: Can be adjusted from the default 1000ms
- **Error Handling**: Can be extended with custom error handling logic

## Troubleshooting Common Issues

1. **Connection Refused**: Ensure Anki is running and AnkiConnect is installed
2. **Timeout Errors**: Check if a script is making too many API calls without proper delays
3. **Parsing Errors**: May indicate incompatible AnkiConnect version or malformed data
4. **Missing Data**: Cards/notes must exist in Anki to be retrieved
