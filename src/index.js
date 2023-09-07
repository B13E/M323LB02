// Importiert hyperscript-helpers, diff, patch und virtual-dom/create-element. 
import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// Definiert die genutzten html Elemente.
const { div, button, input, p, br } = hh(h);

// Definiert die Aktionen die der Benutzer machen kann.
const MESSAGES = {
  QUESTION_CHANGE: "QUESTION_CHANGE",
  ANSWER_CHANGE: "ANSWER_CHANGE",
  ADD_CARD: "ADD_CARD",
  TOGGLE_ANSWER: "TOGGLE_ANSWER",
  DELETE_CARD: "DELETE_CARD",
  EDIT_CARD: "EDIT_CARD",
  RATE_CARD: "RATE_CARD"
};

// Erstellt die Ansicht des Benutzer und sagt welche Aktion nach einer Eingabe ausgeführt werden soll.
function createView(dispatch, model) {
  return div({}, [
    div([
      input({
        type: "text",
        placeholder: "Frage eingeben",
        value: model.question,
        oninput: event => dispatch({ type: MESSAGES.QUESTION_CHANGE, value: event.target.value }),
        style: { marginRight: '10px' }
      }),
      input({
        type: "text",
        placeholder: "Antwort eingeben",
        value: model.answer,
        oninput: event => dispatch({ type: MESSAGES.ANSWER_CHANGE, value: event.target.value }),
        style: { marginRight: '10px' }
      }),
      button({ onclick: () => dispatch({ type: MESSAGES.ADD_CARD }) }, "✅")
    ]),
    ...model.cards.map((card, index) => 
      div({ 
        key: index,
        style: {
          backgroundColor: 'lightyellow',
          width: '60%',
          wordWrap: 'break-word',
          position: 'relative',
          margin: '10px',
          padding: '10px'
        }
      }, [
        p({
          style: {
            position: 'absolute',
            top: '5px',
            right: '5px'
          }
        }, [
          button({
            onclick: () => dispatch({ type: MESSAGES.EDIT_CARD, index }),
          }, "✏️"),
          " ",
          button({
            onclick: () => dispatch({ type: MESSAGES.DELETE_CARD, index }),
          }, "❌")
        ]),
        p({ }, "Frage"),
        p({}, card.question),
        br({}),
        button({
          onclick: () => dispatch({ type: MESSAGES.TOGGLE_ANSWER, index }),
        }, card.showAnswer ? "Antwort verbergen" : "Antwort anzeigen"),
        card.showAnswer ? p({}, card.answer) : null,
        card.showAnswer ? br({}) : null,
        card.showAnswer ? div({}, [
          "Bewertung: ",
          button({ onclick: () => dispatch({ type: MESSAGES.RATE_CARD, index, rating: 0 }) }, "🟥"),
          " ",
          button({ onclick: () => dispatch({ type: MESSAGES.RATE_CARD, index, rating: 1 }) }, "🟨"),
          " ",
          button({ onclick: () => dispatch({ type: MESSAGES.RATE_CARD, index, rating: 2 }) }, "🟩")
        ]) : null  
      ])           
    )       
  ]);
}

// Diese Funktion aktualisiert die Daten der App, basierend auf den Aktionen des Nutzers.
function updateModel(message, model) {
  switch (message.type) {
    case MESSAGES.QUESTION_CHANGE:
      return { ...model, question: message.value };
    case MESSAGES.ANSWER_CHANGE:
      return { ...model, answer: message.value };
    case MESSAGES.ADD_CARD:
      return { 
        ...model, 
        cards: [...model.cards, { question: model.question, answer: model.answer, showAnswer: false, rating: 0 }],
        question: "",
        answer: ""
      };
    case MESSAGES.TOGGLE_ANSWER:
      const updatedCards = [...model.cards];
      updatedCards[message.index].showAnswer = !updatedCards[message.index].showAnswer;
      return { ...model, cards: updatedCards };
    case MESSAGES.DELETE_CARD:
      return { ...model, cards: model.cards.filter((_, index) => index !== message.index) };
    case MESSAGES.EDIT_CARD:
      const cardToEdit = model.cards[message.index];
      return {
        ...model,
        question: cardToEdit.question,
        answer: cardToEdit.answer,
        cards: model.cards.filter((_, index) => index !== message.index)
      };
    case MESSAGES.RATE_CARD:
      const ratedCards = [...model.cards];
      ratedCards[message.index].rating += message.rating;
      return { ...model, cards: ratedCards };
    default:
      return model;
  }
}

// Diese Funktion startet die App
function runApp(initModel, updateModel, createView, rootElement) {
  let model = initModel;
  let currentView = createView(dispatch, model);
  let rootNode = createElement(currentView);
  rootElement.appendChild(rootNode);

// Aktualisiert die Daten nach einer Aktion des Benutzers
  function dispatch(message) {
    model = updateModel(message, model);
    const updatedView = createView(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// Werte beim Start der Anwendung
const initModel = {
  question: "",
  answer: "",
  cards: [],
};

// Der Stammknoten der Anwendung (das div mit id="app" in index.html)
const rootElement = document.getElementById("app");

// Startet die Anwendung
runApp(initModel, updateModel, createView, rootElement);
