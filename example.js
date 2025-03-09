#!/usr/bin/env node

const AnkiApi = require('./anki-api');

// Create an instance of the API with a 1-second delay between calls
const anki = new AnkiApi('127.0.0.1', 8765, 1000);

// Print information about the current card
async function displayCurrentCard() {
  try {
    // Check if AnkiConnect is available
    const version = await anki.getVersion();
    console.log(`Connected to AnkiConnect v${version}`);
    
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
    
    // Also show some extra card info
    const cardInfo = await anki.cardsInfo([card.cardId]);
    
    if (cardInfo && cardInfo.length > 0) {
      const info = cardInfo[0];
      console.log('\nExtra Card Info:');
      console.log(`Due: ${info.due}`);
      console.log(`Interval: ${info.interval} days`);
      console.log(`Ease: ${info.factor / 10}%`);
      console.log(`Reviews: ${info.reps}`);
      console.log(`Lapses: ${info.lapses}`);
      console.log(`Queue: ${info.queue} (${getQueueDescription(info.queue)})`);
    }
  } catch (error) {
    console.error('Failed to get current card:', error.message);
    console.error('Make sure Anki is running and has the AnkiConnect add-on installed');
    console.error('AnkiConnect can be installed from https://ankiweb.net/shared/info/2055492159');
  }
}

// Get a description of the queue type
function getQueueDescription(queue) {
  switch (queue) {
    case 0: return 'New';
    case 1: return 'Learning';
    case 2: return 'Review';
    case 3: return 'Day Learning';
    case -1: return 'Suspended';
    case -2: return 'Buried';
    case -3: return 'User Buried';
    default: return 'Unknown';
  }
}

// Example of listing all decks
async function listDecks() {
  try {
    const decks = await anki.getDecks();
    console.log('\nAvailable Decks:');
    decks.forEach(deck => console.log(`- ${deck}`));
  } catch (error) {
    console.error('Failed to list decks:', error.message);
  }
}

// Example of listing all note types (models)
async function listModels() {
  try {
    const models = await anki.getModels();
    console.log('\nAvailable Note Types:');
    models.forEach(model => console.log(`- ${model}`));
  } catch (error) {
    console.error('Failed to list note types:', error.message);
  }
}

// Example of adding a new card through the Anki GUI
async function addClozeCard() {
  try {
    const note = {
      deckName: "Default",
      modelName: "Cloze",
      fields: {
        Text: "The capital of Romania is {{c1::Bucharest}}",
        Extra: "Romania is a country in Europe"
      },
      tags: [
        "countries"
      ],
      picture: [{
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/EU-Romania.svg/285px-EU-Romania.svg.png",
        filename: "romania.png",
        fields: [
          "Extra"
        ]
      }]
    };
    
    console.log('\nAdding a new Cloze card to Anki...');
    const result = await anki.guiAddCards(note);
    console.log('Card added successfully! Note ID:', result);
  } catch (error) {
    console.error('Failed to add card:', error.message);
  }
}

// Run the examples based on command line arguments
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('current')) {
    await displayCurrentCard();
  }
  
  if (args.length === 0 || args.includes('decks')) {
    await listDecks();
  }
  
  if (args.length === 0 || args.includes('models')) {
    await listModels();
  }
  
  if (args.includes('add')) {
    await addClozeCard();
  }
}

// Call the main function
main().catch(console.error);
