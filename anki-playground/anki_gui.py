#!/usr/bin/env python3
"""
Python script for directly opening the Anki UI with card content
 
Usage:
  python anki_gui.py "Front content" "Back content"
   
Example:
  python anki_gui.py "Vocabulary word" "Definition and examples"
"""

import json
import sys
import urllib.request
import os

# Constants
API_URL = 'http://127.0.0.1:8765'
API_VERSION = 6

def invoke_anki_connect(action, params=None):
    """
    Make a request to the AnkiConnect API
    
    Args:
        action (str): The action to perform
        params (dict, optional): Parameters for the action
        
    Returns:
        dict: The response from the API
    """
    if params is None:
        params = {}
        
    payload = {
        'action': action,
        'version': API_VERSION,
        'params': params
    }
    
    try:
        req = urllib.request.Request(API_URL, json.dumps(payload).encode('utf-8'))
        req.add_header('Content-Type', 'application/json')
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        
        if data.get('error'):
            raise Exception(data.get('error'))
            
        return data.get('result')
    except urllib.error.URLError as e:
        if hasattr(e, 'reason') and 'Connection refused' in str(e.reason):
            raise Exception('Could not connect to Anki. Please make sure Anki is running and AnkiConnect is installed.')
        raise e

def test_connection():
    """
    Test connection to Anki
    
    Returns:
        bool: True if connection is successful
    """
    try:
        version = invoke_anki_connect('version')
        return version >= API_VERSION
    except Exception:
        return False

def get_decks():
    """
    Get all available decks from Anki
    
    Returns:
        list: Array of deck names
    """
    return invoke_anki_connect('deckNames')

def gui_add_cards(deck_name, front, back):
    """
    Open Anki's Add Cards dialog with prefilled content
    
    Args:
        deck_name (str): The name of the deck
        front (str): Front content of the card
        back (str): Back content of the card
    
    Returns:
        int: The ID of the note that would be created
    """
    note = {
        'deckName': deck_name,
        'modelName': 'Basic',
        'fields': {
            'Front': front,
            'Back': back
        },
        'tags': ['anki-card-generator']
    }
    
    return invoke_anki_connect('guiAddCards', {'note': note})

def main():
    """
    Main function
    """
    # Get command line arguments
    if len(sys.argv) < 3:
        print('Error: Please provide both front and back content for the card.')
        print('Usage: python anki_gui.py "Front content" "Back content"')
        sys.exit(1)
    
    front_content = sys.argv[1]
    back_content = sys.argv[2]
    
    try:
        # Test connection to Anki
        print('Testing connection to Anki...')
        connected = test_connection()
        
        if not connected:
            print('Error: Could not connect to Anki. Please make sure:')
            print('  1. Anki is running')
            print('  2. AnkiConnect add-on is installed (add-on code: 2055492159)')
            print('  3. You\'ve restarted Anki after installing the add-on')
            sys.exit(1)
        
        # Get all decks
        print('Getting available decks...')
        decks = get_decks()
        
        if not decks or len(decks) == 0:
            print('Error: No decks available in Anki. Please create a deck first.')
            sys.exit(1)
        
        # Use the first deck by default, or let user specify
        deck_name = os.environ.get('ANKI_DECK', decks[0])
        print(f'Using deck: {deck_name}')
        
        # Open Anki UI with card content
        print('Opening Anki UI with card content...')
        gui_add_cards(deck_name, front_content, back_content)
        
        print('Success! Anki UI should now be open with your card content.')
    except Exception as e:
        print(f'Error: {str(e)}')
        sys.exit(1)

if __name__ == '__main__':
    main()
