'use strict';

const { Translator } = require('../components/translator.js');

module.exports = function(app) {

  const translator = new Translator();

  app.route('/api/translate').post((req, res) => {
    console.log(req.body);
    const { text, locale } = req.body;
    res.json(translator.translate({ text: text, locale: locale }));
  });
};
