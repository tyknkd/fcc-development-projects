const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

// Concatenate americanOnly and americanToBritishSpelling
const americanDict = {...americanOnly, ...americanToBritishSpelling};

// TODO: Concatenate britishOnly to americanToBritishSpelling with keys/values reversed
const britishDict = {...britishOnly, ...americanToBritishSpelling};

const natural = require('natural');
const tokenizer = new natural.WordPunctTokenizer();

class Translator {
  translate(input) {
    if (input) {
      if (input.locale) {
        if (input.locale === 'american-to-british' 
        || input.locale === 'british-to-american') {
          if (input.text) {
            if (input.text.length === 0) {
                return { error: 'No text to translate' };
            }
            let transatlantic = true;
            const american = input.locale === 'american-to-british' ? true : false;
            
            // TODO: Search for and translate any times
            let text = input.text;
            if (american) {
                const time = /([0-9]||[0-9]{2})(\:)([0-9]{2})/;
                if (time.test(text)) {
                    transatlantic = false;
                    // Replace : with .
                }
            } else {
                const time = /([0-9]||[0-9]{2})(\.)([0-9]{2})/;
                if (time.test(text)) {
                    transatlantic = false;
                    // Replace . with :
                }
            }
            // Tokenize text
            const tokens = tokenizer.tokenize(text);

            let dictionary = britishDict;
            if (american) {
              dictionary = americanDict;
            }
            // For each token
            for (let i = 0; i < tokens.length; i++) {
                // Skip numbers and punctuation
                if (/[A-Za-z]/.test(tokens[i])) {
                    const capitalized = /^[A-Z]/.test(tokens[i]) ? true : false;
                    const word = tokens[i].toLowerCase();
                    // Search through dictionaries in lower case
                    for (let entry in dictionary) {
                        if (word === entry) {
                            if (capitalized) {
                                // Capitalize first letter of entry
                                entry;
                            }
                            tokens[i] = `<span class="highlight">${entry}</span>`;
                        }
                    }
                    // Handle titles (e.g., 'mr.')
                    // If match, replace with translation 
                    // wrapped with <span class="highlight"></span> tags    
                }
            } 
            if (transatlantic) {
              return { text: input.text, translation: 'Everything looks good to me!'};
            } else {
              return { text: input.text, translation: tokens.join('') };
            }            
          } else {
            return { error: 'Required field(s) missing'};
          }
        } else {
            return { error: 'Invalid value for locale field' };
        }
      } else {
          return { error: 'Required field(s) missing'};
      }
    } else {
        return { error: 'No input'};
    }
  }
}

module.exports = { Translator };