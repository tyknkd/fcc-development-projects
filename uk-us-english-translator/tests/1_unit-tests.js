const chai = require('chai');
const assert = chai.assert;

const { Translator } = require('../components/translator.js');

suite('Unit Tests', () => {
  const translator = new Translator();

  suite('US to UK Translation', () => {
    const locale = 'american-to-british';
    const testCases = [
      {
        text: 'Mangoes are my favorite fruit.',
        translation: 'Mangoes are my <span class="highlight">favourite</span> fruit.'
      },
      {
        text: 'I ate yogurt for breakfast.',
        translation: 'I ate <span class="highlight">yoghurt</span> for breakfast.'
      },
      {
        text: "We had a party at my friend's condo.",
        translation: `We had a party at my friend's <span class="highlight">flat</span>.`
      },
      {
        text: 'Can you toss this in the trashcan for me?',
        translation: 'Can you toss this in the <span class="highlight">bin</span> for me?'
      },
      {
        text: 'The parking lot was full.',
        translation: 'The <span class="highlight">car park</span> was full.'
      },
      {
        text: 'Like a high tech Rube Goldberg machine.',
        translation: 'Like a high tech <span class="highlight">Heath Robinson device</span>.'
      },
      {
        text: 'To play hooky means to skip class or work.',
        translation: 'To <span class="highlight">bunk off</span> means to skip class or work.'
      },
      {
        text: 'No Mr. Bond, I expect you to die.',
        translation: 'No <span class="highlight">Mr</span> Bond, I expect you to die.'
      },
      {
        text: 'Dr. Grosh will see you now.',
        translation: '<span class="highlight">Dr</span> Grosh will see you now.'
      },
      {
        text: 'Lunch is at 12:15 today.',
        translation: 'Lunch is at <span class="highlight">12.15</span> today.'
      }
    ];

    for (const testCase of testCases) {
      test(testCase.text, () => {
        const input = { text: testCase.text, locale: locale };
        const result = translator.translate(input);
        assert.property(result, 'text');
        assert.equal(result.text, testCase.text);
        assert.property(result, 'translation');
        assert.equal(result.translation, testCase.translation);
      });
    }
  });

  suite('UK to US Translation', () => {
    const locale = 'british-to-american';
    const testCases = [
      {
        text: 'We watched the footie match for a while.',
        translation: 'We watched the <span class="highlight">soccer</span> match for a while.'
      },
      {
        text: 'Paracetamol takes up to an hour to work.',
        translation: '<span class="highlight">Tylenol</span> takes up to an hour to work.'
      },
      {
        text: 'First, caramelise the onions.',
        translation: 'First, <span class="highlight">caramelize</span> the onions.'
      },
      {
        text: 'I spent the bank holiday at the funfair.',
        translation: 'I spent the <span class="highlight">public holiday</span> at the <span class="highlight">carnival</span>.'
      },
      {
        text: 'I had a bicky then went to the chippy.',
        translation: 'I had a <span class="highlight">cookie</span> then went to the <span class="highlight">fish-and-chip shop</span>.'
      },
      {
        text: "I've just got bits and bobs in my bum bag.",
        translation: `I've just got <span class="highlight">odds and ends</span> in my <span class="highlight">fanny pack</span>.`
      },
      {
        text: 'The car boot sale at Boxted Airfield was called off.',
        translation: 'The <span class="highlight">swap meet</span> at Boxted Airfield was called off.'
      },
      {
        text: 'Have you met Mrs Kalyani?',
        translation: 'Have you met <span class="highlight">Mrs.</span> Kalyani?'
      },
      {
        text: "Prof Joyner of King's College, London.",
        translation: `<span class="highlight">Prof.</span> Joyner of King's College, London.`
      },
      {
        text: 'Tea time is usually around 4 or 4.30.',
        translation: 'Tea time is usually around 4 or <span class="highlight">4:30</span>.'
      }
    ];

    for (const testCase of testCases) {
      test(testCase.text, () => {
        const input = { text: testCase.text, locale: locale };
        const result = translator.translate(input);
        assert.property(result, 'text');
        assert.equal(result.text, testCase.text);
        assert.property(result, 'translation');
        assert.equal(result.translation, testCase.translation);
      });
    }
  });

  suite('Highlight Translation Tests', () => {
    const locale = 'american-to-british';
    const testCases = [
      {
        text: 'Mangoes are my favorite fruit.',
        locale: 'american-to-british',
        translation: 'Mangoes are my <span class="highlight">favourite</span> fruit.'
      },
      {
        text: 'I ate yogurt for breakfast.',
        locale: 'american-to-british',
        translation: 'I ate <span class="highlight">yoghurt</span> for breakfast.'
      },
      {
        text: 'We watched the footie match for a while.',
        locale: 'british-to-american',
        translation: 'We watched the <span class="highlight">soccer</span> match for a while.'
      },
      {
        text: 'Paracetamol takes up to an hour to work.',
        locale: 'british-to-american',
        translation: '<span class="highlight">Tylenol</span> takes up to an hour to work.'
      }
    ];

    for (const testCase of testCases) {
      test(testCase.text, () => {
        const input = { text: testCase.text, locale: testCase.locale };
        const result = translator.translate(input);
        assert.property(result, 'text');
        assert.equal(result.text, testCase.text);
        assert.property(result, 'translation');
        assert.equal(result.translation, testCase.translation);
      });
    }
  });
});
