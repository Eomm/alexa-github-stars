'use strict';
/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const GitHub = require('./utils/github-info');

const github = new GitHub(process.env.GITHUB_API_TOKEN);

const FollowerCountHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest'
      || (request.type === 'IntentRequest'
        && request.intent.name === 'FollowerCountIntent');
  },
  handle(handlerInput) {
    const user = handlerInput.requestEnvelope.request.intent.slots.gitUser;
    if (!user) {
      console.log('Slots', handlerInput.requestEnvelope.request.intent.slots);
    }
    
    // TODO fall back
    const search = user ? user.value : 'eomm';
    console.log('User is', user);
    return github.getFollowersCount(search)
      .then((count) => {
        const speechOutput = `${search} ha ${count} follower`;
        return handlerInput.responseBuilder
          .speak(speechOutput)
          // .withSimpleCard(SKILL_NAME, randomFact)
          .getResponse();
      })
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('aiuto')
      .reprompt('aiuto')
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('stop')
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Mi dispiace, ho sbagliato qualcosa.')
      .reprompt('Mi dispiace, ho sbagliato qualcosa.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    FollowerCountHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
