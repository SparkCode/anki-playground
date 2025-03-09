# Product Context: Anki API Tools

## What is Anki?
Anki is a popular spaced repetition flashcard program that helps users efficiently memorize information. It uses an algorithm to schedule card reviews at optimal intervals based on the user's self-reported recall difficulty.

## Problem Being Solved
While Anki provides a robust GUI for creating and reviewing flashcards, there are scenarios where users need programmatic access:

1. **Automation**: Users with large collections of flashcards need ways to automate card creation, modification, and organization
2. **Integration**: Developers want to connect Anki with other tools and services
3. **Analysis**: Users who want to analyze their learning data beyond Anki's built-in statistics
4. **Customization**: Power users who want custom workflows not supported by the standard interface

## AnkiConnect Bridge
AnkiConnect is an Anki add-on that exposes Anki's functionality via a local HTTP API. This allows external programs to interact with Anki. Our tools build upon this foundation to provide a more developer-friendly interface.

## How It Works
1. **Prerequisite Setup**:
   - Users must have Anki installed and running
   - The AnkiConnect add-on must be installed (code: `2055492159`)

2. **Connection Mechanism**:
   - Our tools connect to AnkiConnect's HTTP API (default: `127.0.0.1:8765`)
   - Requests are sent as JSON objects with `action`, `params`, and `version` properties
   - AnkiConnect executes the requested action and returns the results

3. **API Throttling**:
   - To prevent overwhelming Anki, a 1-second delay is enforced between API calls
   - This ensures Anki remains responsive during batch operations

## User Experience Goals
1. **Simplicity**: Provide a clean, intuitive API that abstracts away the complexity of direct HTTP communication
2. **Reliability**: Ensure stable interaction with Anki without causing crashes or performance issues
3. **Comprehensive Coverage**: Support all major AnkiConnect operations
4. **Flexibility**: Allow for both simple usage (via helper scripts) and advanced integration (via the module)

## Key Use Cases
1. **Retrieving Current Card**: Get details about the card currently being reviewed
2. **Deck Management**: List, create, and modify decks
3. **Note Management**: Add, update, and search notes
4. **Card State Control**: Suspend/unsuspend cards, adjust scheduling
5. **Bulk Operations**: Perform multiple actions efficiently with request batching
