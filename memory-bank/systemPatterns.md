# System Patterns: Anki API Tools

## Architecture Overview
The Anki API Tools project follows a simple module-based architecture with a core class that encapsulates all API communication, combined with utility scripts that leverage this core module.

## Core Components

### 1. AnkiApi Class (`anki-api.js`)
This is the central class that encapsulates all interaction with AnkiConnect:

```
┌───────────────────────────────────────┐
│               AnkiApi                 │
├───────────────────────────────────────┤
│ - host: string                        │
│ - port: number                        │
│ - delayBetweenCalls: number           │
│ - lastCallTime: number                │
├───────────────────────────────────────┤
│ + invoke(action, params, version)     │ ────┐
│ + delay()                             │     │
│ + getVersion()                        │     │
│ + getCurrentCard()                    │     │  HTTP Requests
│ + getDecks()                          │     │     to
│ + getModels()                         │     │  AnkiConnect
│ + findNotes(query)                    │     │
│ + getNoteInfo(noteId)                 │     │
│ + addNote(deckName, modelName,        │     ▼
│           fields, tags)               │  ┌─────────────┐
│ + updateNote(id, fields, tags)        │  │ AnkiConnect │
│ + suspendCards(cards)                 │  │    API      │
│ + unsuspendCards(cards)               │  └─────────────┘
│ + guiBrowse(query)                    │
│ + cardsInfo(cards)                    │
│ + findCardsByDeck(deck)               │
│ + multi(actions)                      │
└───────────────────────────────────────┘
```

### 2. Utility Scripts
Standalone scripts that use the AnkiApi class:

* `anki-current-card.js`: Simple script focused on getting current card info
* `example.js`: Demonstrates various API functions based on command-line arguments

## Key Design Patterns

### 1. Module Pattern
The project uses Node.js modules pattern, with `anki-api.js` exporting the AnkiApi class for use by other scripts.

### 2. Promise-Based API
All API methods return Promises, allowing for:
* Asynchronous operation
* Clean error handling
* Ability to use async/await syntax
* Chaining of operations

### 3. Rate Limiting / Throttling
A key pattern is the implementation of a delay mechanism to prevent overloading Anki:
```javascript
async delay() {
  const now = Date.now();
  const timeSinceLastCall = now - this.lastCallTime;
  const delayMs = this.delayBetweenCalls;
  
  if (this.lastCallTime && timeSinceLastCall < delayMs) {
    const remainingDelay = delayMs - timeSinceLastCall;
    await new Promise(resolve => setTimeout(resolve, remainingDelay));
  }
  
  this.lastCallTime = Date.now();
}
```

### 4. Facade Pattern
The AnkiApi class acts as a facade, providing a simplified interface to the more complex AnkiConnect API. It handles JSON formatting, HTTP requests, error handling, and response parsing.

### 5. Command-Line Interface Pattern
The example.js script implements a simple command-line interface pattern, parsing arguments to determine which functionality to demonstrate:
```javascript
const args = process.argv.slice(2);
if (args.length === 0 || args.includes('current')) {
  await displayCurrentCard();
}
```

## Data Flow

1. **Script Initialization**: User runs a script that imports the AnkiApi module
2. **API Instance Creation**: The script creates an instance of AnkiApi with appropriate configuration
3. **Method Invocation**: The script calls methods on the AnkiApi instance
4. **Delay Application**: Before each API call, the delay method ensures proper throttling
5. **HTTP Request**: The invoke method sends an HTTP request to AnkiConnect
6. **Response Processing**: The response is parsed and returned as a Promise resolution
7. **Result Handling**: The script handles the API result (logging, further processing, etc.)

## Error Handling Strategy

The project implements consistent error handling:

1. All API calls are wrapped in try/catch blocks
2. Errors are logged with descriptive messages
3. When AnkiConnect is unavailable, helpful troubleshooting information is provided
4. HTTP and parsing errors are properly captured and reported
