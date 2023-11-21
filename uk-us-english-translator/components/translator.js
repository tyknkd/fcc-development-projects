const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

// Concatenate americanOnly and americanToBritishSpelling dictionaries
const americanDict = {...americanOnly, ...americanToBritishSpelling};

// Create UK to US spelling dictionary
const britishToAmericanSpelling =  Object.fromEntries(Object.entries(americanToBritishSpelling).map((entry) => entry.reverse()));

// Create UK to US titles dictionary
const britishToAmericanTitles = Object.fromEntries(Object.entries(americanToBritishTitles).map((entry) => entry.reverse()));

// Concatenate with britishOnly dictionary
const britishDict = {...britishOnly, ...britishToAmericanSpelling, ...britishToAmericanTitles};

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
            
            // Search for and translate any time substrings
            let text = input.text;
            const time = american ? /([0-9]||[0-9]{2})(\:)([0-9]{2})/g : /([0-9]||[0-9]{2})(\.)([0-9]{2})/g;
            const replace = american ? '<span class="highlight">$1.$3</span>' : '<span class="highlight">$1:$3</span>';
            if (time.test(text)) {
                transatlantic = false;
                // Replace . with :
                text = text.replace(time, '<span class="highlight">$1:$3</span>');
            }

            // Tokenize text
            const tokens = tokenizer.tokenize(text);

            // Translate non-transatlantic words using dictionary
            const dictionary = american ? americanDict : britishDict;
            
            // For each token
            for (let i = 0; i < tokens.length; i++) {
              // Skip numbers and punctuation
              if (/[A-Za-z]/.test(tokens[i])) {
                const capitalized = /^[A-Z]/.test(tokens[i]) ? true : false;
                const word = tokens[i].toLowerCase();

                // Search through dictionaries in lower case
                for (let entry in dictionary) {
                  if (word === entry) {
                    transatlantic = false;
                    if (capitalized) {
                      // Capitalize first letter of entry
                      entry = entry.charAt(0).toUpperCase() + entry.slice(1);
                    }
                    tokens[i] = `<span class="highlight">${entry}</span>`;
                  }
                }
                if (american) {
                  // Translate American titles
                  for (let entry in britishToAmericanTitles) {
                    if (word === entry) {
                      // Delete following period
                      tokens[i+1] = ' ';
                    }
                  }
                }
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