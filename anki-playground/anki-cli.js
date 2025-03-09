#!/usr/bin/env node
/**
 * Command-line script for directly opening the Anki UI with card content
 * 
 * Usage:
 *   node anki-cli.js "Front content" "Back content"
 *   
 * Example:
 *   node anki-cli.js "Vocabulary word" "Definition and examples"
 */

const fetch = require('node-fetch');

// Constants
const API_URL = 'http://127.0.0.1:8765';
const API_VERSION = 6;

/**
 * Make a request to the AnkiConnect API
 * @param {string} action - The action to perform
 * @param {Object} params - Parameters for the action
 * @returns {Promise<any>} - The response from the API
 */
async function invokeAnkiConnect(action, params = {}) {
  const payload = {
    action,
    version: API_VERSION,
    params
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.result;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Could not connect to Anki. Please make sure Anki is running and AnkiConnect is installed.');
    }
    throw error;
  }
}

/**
 * Test connection to Anki
 * @returns {Promise<boolean>} - True if connection is successful
 */
async function testConnection() {
  try {
    const version = await invokeAnkiConnect('version');
    return version >= API_VERSION;
  } catch (error) {
    return false;
  }
}

/**
 * Get all available decks from Anki
 * @returns {Promise<string[]>} - Array of deck names
 */
async function getDecks() {
  return invokeAnkiConnect('deckNames');
}

/**
 * Open Anki's Add Cards dialog with prefilled content
 * @param {string} deckName - The name of the deck
 * @param {string} front - Front content of the card
 * @param {string} back - Back content of the card
 * @returns {Promise<number>} - The ID of the note that would be created
 */
async function guiAddCards(deckName, front, back) {
  const note = {
    deckName,
    modelName: 'Basic',
    fields: {
      Front: front,
      Back: back
    },
    tags: ['anki-card-generator']
  };
  
  return invokeAnkiConnect('guiAddCards', { note });
}

/**
 * Main function
 */
async function main() {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('Error: Please provide both front and back content for the card.');
    console.log('Usage: node anki-cli.js "Front content" "Back content"');
    process.exit(1);
  }
  
  const frontContent = args[0];
  const backContent = args[1];
  
  try {
    // Test connection to Anki
    console.log('Testing connection to Anki...');
    const connected = await testConnection();
    
    if (!connected) {
      console.error('Error: Could not connect to Anki. Please make sure:');
      console.error('  1. Anki is running');
      console.error('  2. AnkiConnect add-on is installed (add-on code: 2055492159)');
      console.error('  3. You\'ve restarted Anki after installing the add-on');
      process.exit(1);
    }
    
    // Get all decks
    console.log('Getting available decks...');
    const decks = await getDecks();
    
    if (!decks || decks.length === 0) {
      console.error('Error: No decks available in Anki. Please create a deck first.');
      process.exit(1);
    }
    
    // Use the first deck by default, or let user specify
    const deckName = process.env.ANKI_DECK || decks[0];
    console.log(`Using deck: ${deckName}`);
    
    // Open Anki UI with card content
    console.log('Opening Anki UI with card content...');
    await guiAddCards(deckName, frontContent, backContent);
    
    console.log('Success! Anki UI should now be open with your card content.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main();
