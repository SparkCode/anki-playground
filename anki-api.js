/**
 * A module for interacting with Anki through the AnkiConnect API
 */

const http = require('http');

class AnkiApi {
  constructor(host = '127.0.0.1', port = 8765, delayBetweenCalls = 1000) {
    this.host = host;
    this.port = port;
    this.delayBetweenCalls = delayBetweenCalls; // Delay in milliseconds
    this.lastCallTime = 0;
  }
  
  /**
   * Creates a delay between API calls
   * @returns {Promise<void>}
   */
  async delay() {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    const delayMs = this.delayBetweenCalls; // Already in milliseconds
    
    if (this.lastCallTime && timeSinceLastCall < delayMs) {
      const remainingDelay = delayMs - timeSinceLastCall;
      console.log(`Waiting ${remainingDelay} ms before next API call...`);
      await new Promise(resolve => setTimeout(resolve, remainingDelay));
    }
    
    this.lastCallTime = Date.now();
  }

  /**
   * Makes a request to the Anki Connect API
   * @param {string} action - The action to perform
   * @param {Object} params - Parameters for the action
   * @param {number} version - API version to use
   * @returns {Promise<Object>} - The response from the API
   */
  async invoke(action, params = {}, version = 6) {
    // Apply the delay before making the API call
    await this.delay();
    
    console.log(`Making API call: ${action}`);
    
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({ action, version, params });
      
      const options = {
        hostname: this.host,
        port: this.port,
        path: '/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.error) {
              reject(new Error(response.error));
            } else {
              resolve(response.result);
            }
          } catch (e) {
            reject(new Error(`Failed to parse response: ${e.message}`));
          }
        });
      });

      req.on('error', (e) => {
        reject(new Error(`Failed to connect to Anki: ${e.message}`));
      });

      req.write(payload);
      req.end();
    });
  }

  /**
   * Check if AnkiConnect is available and get its version
   * @returns {Promise<number>} - The version of AnkiConnect
   */
  async getVersion() {
    return this.invoke('version');
  }

  /**
   * Gets the currently displayed card in Anki GUI
   * @returns {Promise<Object>} - The current card details
   */
  async getCurrentCard() {
    return this.invoke('guiCurrentCard');
  }
  
  /**
   * Gets all decks
   * @returns {Promise<string[]>} - List of all deck names
   */
  async getDecks() {
    return this.invoke('deckNames');
  }
  
  /**
   * Gets all note types (models)
   * @returns {Promise<string[]>} - List of all model names
   */
  async getModels() {
    return this.invoke('modelNames');
  }
  
  /**
   * Get notes by query
   * @param {string} query - The search query
   * @returns {Promise<number[]>} - List of note IDs matching the query
   */
  async findNotes(query) {
    return this.invoke('findNotes', { query });
  }
  
  /**
   * Gets note info by ID
   * @param {number} noteId - The note ID
   * @returns {Promise<Object>} - Note information
   */
  async getNoteInfo(noteId) {
    return this.invoke('notesInfo', { notes: [noteId] }).then(res => res[0]);
  }
  
  /**
   * Adds a new note
   * @param {string} deckName - The deck name
   * @param {string} modelName - The model name
   * @param {Object} fields - The fields for the note
   * @param {string[]} tags - Tags for the note
   * @returns {Promise<number>} - The ID of the new note
   */
  async addNote(deckName, modelName, fields, tags = []) {
    const note = {
      deckName,
      modelName,
      fields,
      tags
    };
    return this.invoke('addNote', { note });
  }
  
  /**
   * Update an existing note
   * @param {number} id - The note ID
   * @param {Object} fields - The fields to update
   * @param {string[]} tags - Tags for the note
   * @returns {Promise<null>} - Empty response on success
   */
  async updateNote(id, fields, tags = null) {
    const params = { id, fields };
    if (tags !== null) {
      params.tags = tags;
    }
    return this.invoke('updateNoteFields', params);
  }
  
  /**
   * Suspend cards by ID
   * @param {number[]} cards - Array of card IDs to suspend
   * @returns {Promise<boolean>} - Success status
   */
  async suspendCards(cards) {
    return this.invoke('suspend', { cards });
  }
  
  /**
   * Unsuspend cards by ID
   * @param {number[]} cards - Array of card IDs to unsuspend
   * @returns {Promise<boolean>} - Success status
   */
  async unsuspendCards(cards) {
    return this.invoke('unsuspend', { cards });
  }
  
  /**
   * Browse to a specific query in Anki
   * @param {string} query - The search query
   * @returns {Promise<number[]>} - List of note IDs that were opened in the browser
   */
  async guiBrowse(query) {
    return this.invoke('guiBrowse', { query });
  }
  
  /**
   * Get card information
   * @param {number[]} cards - Array of card IDs
   * @returns {Promise<Object[]>} - Card information
   */
  async cardsInfo(cards) {
    return this.invoke('cardsInfo', { cards });
  }
  
  /**
   * Get a list of card IDs for a specific deck
   * @param {string} deck - The deck name
   * @returns {Promise<number[]>} - List of card IDs
   */
  async findCardsByDeck(deck) {
    return this.invoke('findCards', { query: `deck:"${deck}"` });
  }
  
  /**
   * Execute multiple actions in one request
   * @param {Array<{action: string, params: Object}>} actions - List of actions to perform
   * @returns {Promise<Array>} - List of results
   */
  async multi(actions) {
    const requests = actions.map(({ action, params = {} }) => ({
      action,
      params
    }));
    return this.invoke('multi', { actions: requests });
  }
  
  /**
   * Add cards through Anki GUI
   * @param {Object} note - The note to add
   * @param {string} note.deckName - The deck name
   * @param {string} note.modelName - The model name
   * @param {Object} note.fields - The fields for the note
   * @param {string[]} [note.tags=[]] - Tags for the note
   * @param {Array<{url: string, filename: string, fields: string[]}>} [note.picture=[]] - Pictures to attach to the note
   * @returns {Promise<number>} - The ID of the new note
   */
  async guiAddCards(note) {
    return this.invoke('guiAddCards', { note });
  }
}

module.exports = AnkiApi;
