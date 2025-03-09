/**
 * Example script for directly opening the Anki UI with card content
 * This can be used from the browser console or as a standalone script
 */

// Example card content following the expected format with front and back parts
const exampleCardContent = `
==front part==
Example Vocabulary Word
- [noun] definition goes here
==front part==

==bottom part==
## Example Usage
- Example sentence 1
- Example sentence 2

## Notes
- Additional information
- Mnemonic device
==bottom part==
`;

/**
 * Function to open Anki UI with card content
 * This requires the anki-card-generator app to be running
 * @param {string} content - Formatted card content with front and back parts
 */
function openAnkiCard(content) {
  if (typeof window.openAnkiCardUI === 'function') {
    window.openAnkiCardUI(content);
  } else {
    console.error('openAnkiCardUI function not available. Make sure the Anki Card Generator app is running.');
    alert('openAnkiCardUI function not available. Make sure the Anki Card Generator app is running.');
  }
}

// Usage examples:

// 1. Open Anki UI directly with the example content
// openAnkiCard(exampleCardContent);

// 2. Using when receiving content from another source
// function processReceivedContent(receivedContent) {
//   // Format the content according to the expected format if needed
//   const formattedContent = `
//     ==front part==
//     ${receivedContent.front || ''}
//     ==front part==
//     
//     ==bottom part==
//     ${receivedContent.back || ''}
//     ==bottom part==
//   `;
//   
//   openAnkiCard(formattedContent);
// }

console.log('Anki Direct UI script loaded. Use openAnkiCard() to open the Anki UI with content.');
