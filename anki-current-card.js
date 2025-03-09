#!/usr/bin/env node

/**
 * A simple script to get the current card displayed in Anki using its local API
 * Using a 1-second delay between API calls
 */

const AnkiApi = require('./anki-api');

/**
 * Gets the currently displayed card in Anki
 */
async function getCurrentCard() {
  try {
    // Create API instance with a 1-second delay
    const anki = new AnkiApi('127.0.0.1', 8765, 1000);
    
    // First, check if Anki is running
    const version = await anki.getVersion();
    console.log('Connected to Anki, version:', version);
    
    // Get the current card
    const card = await anki.getCurrentCard();
    
    if (!card) {
      console.log('No card is currently displayed in Anki');
      return;
    }
    
    console.log('\nCurrent Card:');
    console.log('-----------------------------------');
    console.log(`Card ID: ${card.cardId}`);
    console.log(`Note ID: ${card.noteId}`);
    console.log(`Question: ${card.question.replace(/<[^>]*>/g, '')}`); // Remove HTML tags
    console.log(`Answer: ${card.answer.replace(/<[^>]*>/g, '')}`); // Remove HTML tags
    console.log(`Deck: ${card.deckName}`);
    console.log(`Model: ${card.modelName}`);
    console.log('-----------------------------------');
    
    console.log('\nFields:');
    for (const [fieldName, fieldValue] of Object.entries(card.fields)) {
      console.log(`${fieldName}: ${fieldValue.value.replace(/<[^>]*>/g, '')}`);
    }
  } catch (error) {
    console.error('Failed to get current card:', error.message);
    console.error('Make sure Anki is running and has the AnkiConnect add-on installed');
    console.error('AnkiConnect can be installed from https://ankiweb.net/shared/info/2055492159');
  }
}

// Check if AnkiConnect is available and get the current card
getCurrentCard();
