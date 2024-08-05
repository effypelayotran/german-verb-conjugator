# German Verb Conjugator Script
- This web script (script.js) can be injected into a browser, as a browser extension.
- Upon doing so, it will take the text of a web page the user visits, searches through the text to identify the verbs, highlights said verbs, and logs a JSON of all the conjugated forms of each verb on the page, into the console.
- I wrote two main Google Cloud Functions (GCF) to execute the above functionality:
  1) The first cloud function uses Spacy pipeline trained on German news and media text were used to identity the verbs (via the Parts-Of-Speech tagging component) and this Cloud Functions response is then sent back to the local script.
  2) The second cloud function queries the found verbs within a Firestore databse I designed, and return the related conjugations of found verbs to the script.
- I designed and loaded a Firestore NoSQL (document based) database that stores about 510,000 German verbs, their infinitive forms, translations, and conjugation type (e.g. future perfect, imperative, singular or plural use cases, masculine or feminine use cases). There was no avaialable German Verb API on the market, so I wrote a Python script that scrapes this data from cooljugator.com and migrates it into my Firestore database.
- See script.js to see this web script in action!
