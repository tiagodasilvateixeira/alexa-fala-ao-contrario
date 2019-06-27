const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
      const speechText = 'Oi, diga uma palavra que eu vou repeti-la ao contrário!';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('Olá!', speechText)
        .getResponse();
    }
  };

  const FalarAoContrarioIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'FalarAoContrarioIntent';
    },
    handle(handlerInput) {
      var palavra = Alexa.getSlotValue(handlerInput.requestEnvelope, 'palavra');
      var palavraAoContrario = palavra.split('').reverse().join('');

      const speechText = 'Ficou assim: ' + palavraAoContrario;
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('Dúvida', speechText)
        .getResponse();
    }
  };

  const HelpIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
      const speechText = 'Você tem que me pedir para falar uma coisa ao contrário';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withSimpleCard('Está com dúvida?', speechText)
        .getResponse();
    }
  };

  const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'IntentRequest'
        && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
          || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      const speechText = 'Até logo!';
  
      return handlerInput.responseBuilder
        .speak(speechText)
        .withSimpleCard('Cancelar consulta', speechText)
        .getResponse();
    }
  };

  const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder.getResponse();
    }
  };

  const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
  
      return handlerInput.responseBuilder
        .speak('Não estou entendendo, é só dizer uma palavra')
        .reprompt('Desculpe, acho que sou burrinha, pode tentar outra?')
        .getResponse();
    },
  };

let skill;

exports.handler = async function (event, context) {
  console.log(`REQUEST++++${JSON.stringify(event)}`);
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        FalarAoContrarioIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  const response = await skill.invoke(event, context);
  console.log(`RESPONSE++++${JSON.stringify(response)}`);

  return response;
};