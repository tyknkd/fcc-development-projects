const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

// Create UK to US spelling dictionary
const britishToAmericanSpelling = Object.fromEntries(Object.entries(americanToBritishSpelling).map((entry) => entry.reverse()));

// Create UK to US titles dictionary
const britishToAmericanTitles = Object.fromEntries(Object.entries(americanToBritishTitles).map((entry) => entry.reverse()));

class Translator {
  translate(input) {
    // Handle errors
    if (!input) { return { error: 'No input' }; }
    if (!input.locale) { return { error: 'Required field(s) missing' }; }
    if (input.locale !== 'american-to-british'
      && input.locale !== 'british-to-american') { return { error: 'Invalid value for locale field' }; }
    if (!input.text) { return { error: 'Required field(s) missing' }; }
    if (input.text.length === 0) { return { error: 'No text to translate' }; }

    // Set dictionaries, time RegEx, time replacement string
    let dictionaries, timeRegEx, timeReplacement;
    if (input.locale === 'american-to-british') {
      dictionaries = [americanOnly, americanToBritishSpelling, americanToBritishTitles];
      timeRegEx = /([0-9]||[0-9]{2})(\:)([0-9]{2})/;
      timeReplacement = '<span class="highlight">$1.$3</span>';
    } else {
      dictionaries = [britishOnly, britishToAmericanSpelling, britishToAmericanTitles];
      timeRegEx = /([0-9]||[0-9]{2})(\.)([0-9]{2})/;
      timeReplacement = '<span class="highlight">$1:$3</span>';
    }

    let transatlantic = true;
    let translation = input.text;

    // Translate times
    if (timeRegEx.test(translation)) {
      transatlantic = false;
      translation = translation.replace(timeRegEx, timeReplacement);
    }

    // Translate words
    for (let dictionary of dictionaries) {
      for (let entry in dictionary) {
        // TODO: Edit regex to match only words followed by space or punctuation
        const entryRegEx = new RegExp(entry, 'gi');
        if (entryRegEx.test(translation)) {
          transatlantic = false;
          let replacement = dictionary[entry];
          translation = translation.replace(entryRegEx, (match) => {
            // If first letter is capitalized
            if (/^[A-Z]/.test(match)) {
              replacement = dictionary[entry].charAt(0).toUpperCase() + dictionary[entry].slice(1);
            }
            return `<span class="highlight">${replacement}</span>`;
          });
        }
      }
    }

    if (transatlantic) {
      return { text: input.text, translation: 'Everything looks good to me!' };
    } else {
      return { text: input.text, translation: translation };
    }
  }
}

module.exports = { Translator };