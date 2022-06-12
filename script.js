window.onload = () => {
    const getBank = new Promise(resolve => {
        // resolves with country&capitals json data
        Data.get(resolve);
    })
        .then((data) => {
            window.localStorage.setItem("data", JSON.stringify(data));
            const flashcardContent = Data.parse();
            Client.updateFlashcards(flashcardContent);
        })
}

class Data {
    static get(_resolve) {
        /* return json of countries and their capitals */
        const xhr = new XMLHttpRequest();
        const url = "https://raw.githubusercontent.com/ChryslerChris/jsons/main/flashcards/countriesAndCapitals.json";

        xhr.responseType = 'json';
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                // checks to see if the request has finished
                _resolve(xhr.response);
            }
        }

        xhr.open('GET', url);
        xhr.send();
    }

    static parse(data=JSON.parse(window.localStorage.getItem("data"))) {
        /* returns a dict of countries and their capitals, with a length of amount */
        if (typeof data === "undefined" || data === null) {window.location.reload()}; // refresh the page so that data is requested again
      
        const countriesAndCapitals = [];
        for (let i = 0; i < 9; i++) { // get 9 flashcards
            let _cont = false;
            while (!_cont) {
                let randomIndex = Math.floor(Math.random() * data.length);
                if (!countriesAndCapitals.includes(data[randomIndex])) {
                    countriesAndCapitals.push(data[randomIndex]);
                    _cont = true;
                }
            }
        }
        return countriesAndCapitals;
    }
}

class Client {
    static updateFlashcards(flashcards=null) {
        if (flashcards === null) {flashcards = Data.parse()}

        const flashcardIds = this.getDOMflashcardIds();

        flashcards.forEach((flashcard, i) => {
            // replace front flashcards with new country names and back flashcards with corresponding capital names
            flashcardIds[i][0].textContent = flashcard.country;
            flashcardIds[i][1].textContent = flashcard.city;
        })
    }

    static getDOMflashcardIds() {
        // each item in the returned list will be a nested array with 2 elements; [0] is front of card [1] is back of card
        let DOMflashcardIds = [];
        const frontCards = document.querySelectorAll(".front");
        const backCards = document.querySelectorAll(".back");
        for (let i=0;i<frontCards.length;i++) {
            DOMflashcardIds.push([frontCards[i], backCards[i]])
        }
        return DOMflashcardIds;
    }
}

/* Handle Ctrl+Q shortcut for loading new flashcards */

window._CTRL = false;

document.body.addEventListener("keydown", (event) => {
  if (event.keyCode === 17 && !window._CTRL) window._CTRL = true;
});

document.body.addEventListener('keyup', (event) => {
  if (event.keyCode === 17 && window._CTRL) window._CTRL = false;
});

document.body.addEventListener('keypress', (event) => {
  // Q
  if (event.keyCode === 17)
    Client.updateFlashcards();
});