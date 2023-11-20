const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');

suite('Unit Tests', () => {
  // Translate Mangoes are my favorite fruit. to British English
  // Mangoes are my <span class="highlight">favourite</span> fruit.

  // Translate I ate yogurt for breakfast. to British English
  // I ate <span class="highlight">yoghurt</span> for breakfast.

  // Translate We had a party at my friend's condo. to British English
  // We had a party at my friend's <span class="highlight">flat</span>.

  // Translate Can you toss this in the trashcan for me? to British English
  // Can you toss this in the <span class="highlight">bin</span> for me?

  // Translate The parking lot was full. to British English
  // The <span class="highlight">car park</span> was full.

  // Translate Like a high tech Rube Goldberg machine. to British English
  // Like a high tech <span class="highlight">Heath Robinson</span> device.

  // Translate To play hooky means to skip class or work. to British English
  // To <span class="highlight">bunk off</span> means to skip class or work.

  // Translate No Mr. Bond, I expect you to die. to British English
  // No <span class="highlight">Mr</span> Bond, I expect you to die.

  // Translate Dr. Grosh will see you now. to British English
  // <span class="highlight">Dr</span> Grosh will see you now.

  // Translate Lunch is at 12:15 today. to British English
  // Lunch is at <span class="highlight">12.15</span> today.

  // Translate We watched the footie match for a while. to American English
  // We watched the <span class="highlight">soccer</span> match for a while.

  // Translate Paracetamol takes up to an hour to work. to American English
  // <span class="highlight">Tylenol</span> takes up to an hour to work.

  // Translate First, caramelise the onions. to American English
  // First, <span class="highlight">caramelize</span> the onions.

  // Translate I spent the bank holiday at the funfair. to American English
  // I spent the <span class="highlight">public holiday</span> at the <span class="highlight">carnival</span>.

  // Translate I had a bicky then went to the chippy. to American English
  // I had a <span class="highlight">cookie</span> then went to the <span class="highlight">fish-and-chip shop</span>.

  // Translate I've just got bits and bobs in my bum bag. to American English
  // I've just got <span class="highlight">odds and ends</span> in my <span class="highlight">fanny pack</span>.

  // Translate The car boot sale at Boxted Airfield was called off. to American English
  // The <span class="highlight">swap meet</span> at Boxted Airfield was called off.

  // Translate Have you met Mrs Kalyani? to American English
  // Have you met <span class="highlight">Mrs.</span> Kalyani?

  // Translate Prof Joyner of King's College, London. to American English
  // <span class="highlight">Prof.</span> Joyner of King's College, London.

  // Translate Tea time is usually around 4 or 4.30. to American English
  // Tea time is usually around 4 or <span class="highlight">4:30</span>.

  // Highlight translation in Mangoes are my favorite fruit.
  // Mangoes are my <span class="highlight">favourite</span> fruit.

  // Highlight translation in I ate yogurt for breakfast.
  // I ate <span class="highlight">yoghurt</span> for breakfast.

  // Highlight translation in We watched the footie match for a while.
  // We watched the <span class="highlight">soccer</span> match for a while.

  // Highlight translation in Paracetamol takes up to an hour to work.
  // <span class="highlight">Tylenol</span> takes up to an hour to work.

});
