//http://jservice.io/

// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];

/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
  //asking for 100 different category ids so we can pick from them randomly - only need 6
  const result = await axios.get(
    `https://jservice.io/api/categories?count=100`
  );
  let catIds = result.data.map((cat) => cat.id);
  const listOfRandomCatIds = []; // ['catId1', 'catId2', 'catId3']

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * catIds.length);
    const randomCatId = catIds[randomIndex];
    catIds.splice(randomIndex, 1);
    listOfRandomCatIds.push(randomCatId);
  }
  // console.log("listOfRandomCatIds", listOfRandomCatIds);
  return listOfRandomCatIds;
}
function checkIfCatIdIsRandom(listOfRandomCatIds, randomCatId) {
  for (let catId of listOfRandomCatIds) {
    if (catId === randomCatId) {
      return false;
    }
  }
  return true;
}

//

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
// retreive the title category? and the clues that go along with it?
async function getCategory(listOfRandomCatIds) {
  let response = await axios.get(
    `https://jservice.io/api/category?id=${listOfRandomCatIds}`
  );
  let cat = response.data;
  let allClues = cat.clues;
  let randomClues = _.sampleSize(allClues, listOfRandomCatIds);
  let clues = randomClues.map((c) => ({
    question: c.question,
    answer: c.answer,
    showing: null,
  }));
  // console.log("getCategory(listOfRandomCatIds)", { title: cat.title, clues });
  return { title: cat.title, clues };
}
//why is listOfRandomCatIds undefined
getCategory();

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

// let table = document.querySelector("#jeopardyTable");
// let columm = getCategory();

//argument or paramaters
function fillTable(gameData) {
  const headRow = document.createElement("tr");
  const tableHeading = document.querySelector("thead");

  const tableRows = [];
  for (let i = 0; i < 5; i++) {
    const row = document.createElement("tr");
    tableRows.push(row);
  }

  for (let cat in gameData) {
    const headCell = document.createElement("th");
    //using a variable to link into an object
    headCell.innerHTML = gameData[cat].title;
    headRow.appendChild(headCell);
    tableHeading.appendChild(headRow);
    for (let i = 0; i < tableRows.length; i++) {
      const cell = document.createElement("td");
      const tableBody = document.querySelector("tbody");
      cell.dataQuestion = gameData[cat].clues[i].question;
      cell.dataAnswer = gameData[cat].clues[i].answer;
      cell.innerHTML = "?";
      cell.addEventListener("click", () => {
        handleClueClick(cell);
      });
      tableRows[i].appendChild(cell);
      tableBody.appendChild(tableRows[i]);
    }
  }
}
fillTable();

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClueClick(cell) {
  if (cell.innerHTML === "?") {
    cell.innerHTML = cell.dataQuestion;
  } else if (cell.innerHTML === cell.dataQuestion) {
    cell.innerHTML = cell.dataAnswer;
  }
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  const gameData = {};
  const randomIds = await getCategoryIds();
  for (let id of randomIds) {
    gameData[id] = await getCategory(id);
  }
  fillTable(gameData);
  // console.log("gamedata ", gameData);
}

/** On click of start / restart button, set up game. */

// TODO

const restartBtn = document.getElementById("restartBtn");
restartBtn.addEventListener("click", async function () {
  let newGame = document.querySelector("#jeopardyTable");
  newGame.innerHTML = setupAndStart();
  await setupAndStart();
});

/** On page load, add event handler for clicking clues */
window.onload =
  ("load",
  function () {
    return setupAndStart();
  });
// TODO
