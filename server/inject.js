import * as ArriveJS from "./libs/arive/arrive.js"
import { Game } from "./libs/sudoku-solver/main.js";

const SQUARE_COUNT = 3;
const SQUARE_ROW_COUNT = SQUARE_COUNT;
const SQUARE_COL_COUNT = SQUARE_COUNT;
const SQUARE_CELL_COUNT = SQUARE_ROW_COUNT * SQUARE_COL_COUNT;
const SUDOKU_ROW_COUNT = SQUARE_ROW_COUNT * SQUARE_COUNT;
const SUDOKU_COL_COUNT = SQUARE_COL_COUNT * SQUARE_COUNT;

const ONE_SECOND = 1000;
const MATCH_DURATION = 11 * ONE_SECOND;

const ENABLED_ITEM_STYLE = "";
const DISABLED_ITEM_STYLE = "opacity: 0.5; cursor: default;";

let startButtonEnabled = true;
let stopButtonEnabled = false;
let timeoutID = null; 

function positionForIndex(index) {
  return {
    row: Math.trunc((index % SQUARE_CELL_COUNT) / SQUARE_COL_COUNT),
    column: (index % SQUARE_CELL_COUNT) % SQUARE_COL_COUNT,
  }
}

function offset(index) {
  return {
    row: Math.trunc(index / (SQUARE_CELL_COUNT * SQUARE_COUNT)) * SQUARE_COL_COUNT,
    column: (Math.trunc(index / SQUARE_CELL_COUNT) % SQUARE_COL_COUNT) * SQUARE_ROW_COUNT,
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Inserts start and stop buttons in the top menu.
// The button callbacks are also implemented in here.
function sudokuCallback() {
  const topMenu = document.querySelector(".top_menu");
  if (topMenu != null) {
    const menuList = document.createElement("div");
    menuList.className = "top_menu_list";
  
    const intervalCallback = () => {
      const array = new Array(SUDOKU_ROW_COUNT);
      for (let row = 0; row < SUDOKU_ROW_COUNT; ++row) {
        array[row] = new Array(SUDOKU_COL_COUNT).fill(0);
      }
      
      const cells = document.querySelectorAll(".sudoku .cell");
      const keys = document.querySelectorAll(".keyboard .key_num");
      for (let idx = 0; idx < SUDOKU_ROW_COUNT * SUDOKU_COL_COUNT; ++idx) {
        if (cells[idx].className.includes("correct") && cells[idx].className.includes("locked")) {
          const rcOffset = offset(idx);
          const rcFromIndex = positionForIndex(idx);
          const position = {
            row: rcOffset.row + rcFromIndex.row, 
            column: rcOffset.column + rcFromIndex.column,
          };
          array[position.row][position.column] = Number(cells[idx].textContent);
        }
      }
      const game = new Game(array);
      const solved = game.solve();
      console.info(solved);

      for (let idx = 0; idx < SUDOKU_ROW_COUNT * SUDOKU_COL_COUNT; ++idx) {
        if (!cells[idx].className.includes("locked")) {
          const rcOffset = offset(idx);
          const rcFromIndex = positionForIndex(idx);
          const position = {
            row: rcOffset.row + rcFromIndex.row, 
            column: rcOffset.column + rcFromIndex.column,
          };
          cells[idx].click();
          const value = solved[position.row][position.column];
          if (value) {
            keys[value - 1].click();
          }
        }
      }

      timeoutID = setTimeout(intervalCallback, MATCH_DURATION);
    };
    const startButtonCallback = () => {
      if (startButtonEnabled) {
        startButton.style.cssText = DISABLED_ITEM_STYLE;
        startButtonEnabled = false;
        stopButton.style.cssText = ENABLED_ITEM_STYLE;
        stopButtonEnabled = true;
  
        intervalCallback();
      }
    };

    const startButton = document.createElement("div");
    startButton.innerHTML = `<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <g id="SVGRepo_bgCarrier" stroke-width="0"/> <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/> <g id="SVGRepo_iconCarrier"> <path d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z" stroke="#000000" stroke-width="2" stroke-linejoin="round"/> </g> </svg>`;
    startButton.className = "top_menu_item";
    startButton.style.cssText = startButtonEnabled ? ENABLED_ITEM_STYLE : DISABLED_ITEM_STYLE;
    startButton.onclick = startButtonCallback;
    menuList.appendChild(startButton);
  
    const stopButtonCallback = () => {
      if (stopButtonEnabled) {
        startButton.style.cssText = ENABLED_ITEM_STYLE;
        startButtonEnabled = true;
        stopButton.style.cssText = DISABLED_ITEM_STYLE;
        stopButtonEnabled = false;

        clearTimeout(timeoutID);
      }
    };

    const stopButton = document.createElement("div");
    stopButton.innerHTML = `<svg width="20px" height="20px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M17 3.42004H7C4.79086 3.42004 3 5.2109 3 7.42004V17.42C3 19.6292 4.79086 21.42 7 21.42H17C19.2091 21.42 21 19.6292 21 17.42V7.42004C21 5.2109 19.2091 3.42004 17 3.42004Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>`
    stopButton.className = "top_menu_item";
    stopButton.style.cssText = stopButtonEnabled ? ENABLED_ITEM_STYLE : DISABLED_ITEM_STYLE;
    stopButton.onclick = stopButtonCallback;
    menuList.appendChild(stopButton);
  
    const list = document.querySelector(".top_menu .top_menu_list");
    if (list) {
      list.after(menuList);
    } else {
      topMenu.appendChild(menuList);
    }
  }
}
document.arrive(".sudoku", sudokuCallback);

// Presses the button "Новая игра", when player won.
const modalContainerCallback = (modalContainer) => {
  const modalHeaderCallback = (modalHeader) => {
    modalContainer.unbindArrive(".modal .modal-container .modal_header", modalHeaderCallback);
    if (modalHeader.textContent === "Победа") {
      const button = document.querySelector(".modal .modal-container button");
      button.click();
    }
  };
  document.arrive(".modal .modal-container .modal_header", modalHeaderCallback);
};
document.arrive(".modal .modal-container", modalContainerCallback);

// Presses the button "Новая игра", when spinner is shown.
const spinnerCallback = (spinner) => {
  const modalHeaderCallback = (modalHeader) => {
    document.unbindArrive(".modal .modal-container .modal_header", modalHeaderCallback);
    if (modalHeader.textContent === "Игра") {
      const button = document.querySelector(".modal .modal-container button");
      button.click();
    }
  };
  document.arrive(".modal .modal-container .modal_header", modalHeaderCallback);

  const modalShadow = document.querySelector(".modal .modal-shadow");
  modalShadow.click();

  sleep(300);

  const difficultyButton = document.querySelector(".top_menu .top_menu_list .top_menu_item")
  difficultyButton.click();
};
document.arrive(".modal .modal-container .spinner", spinnerCallback);
