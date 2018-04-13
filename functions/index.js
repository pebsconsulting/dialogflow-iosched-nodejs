// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const functions = require('firebase-functions');
const {dialogflow} = require('actions-on-google');
const {
  getPhase,
} = require('./utils');
const {
  prompt,
  fallback,
  goodbye,
  noInput,
} = require('./prompts/utils');

const app = dialogflow({
  debug: true,
  init: () => ({
    data: {
      fallbackCount: 0,
      noInputResponses: [],
      fallbackResponses: [],
    },
  }),
});

app.middleware((conv) => {
  conv.currentTime = Date.now();
  conv.phase = getPhase(conv.currentTime);
  conv.isRepeat = conv.phase === getPhase(conv.user.last.seen) ?
    'repeat' : 'firstTime';
  if (conv.intent !== 'fallback') {
    conv.data.fallbackCount = 0;
  }
});

app.intent('welcome', prompt);

app.intent('date', prompt);

app.intent('keynote', prompt);

app.intent('codelabs', prompt);

app.intent('appReview', prompt);

app.intent('food', prompt);

app.intent('swag', prompt);

app.intent('afterParty', prompt);

app.intent('watchRemotely', prompt);

app.intent('announcements', prompt);

app.intent('lostAndFound', prompt);

app.intent('whatToWear', prompt);

app.intent('goodbye', goodbye);

app.intent('cancel', goodbye);

app.intent('no-input', noInput);

app.intent('fallback', fallback);

app.fallback(fallback);

exports.googleio = functions.https.onRequest(app);
