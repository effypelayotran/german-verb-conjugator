/* Save ALL text, this includes the ones that are in titles/menus/captions and 
don't fall under the paragraph 'p' tag. */
// let allText = document.body.innerText;
// console.log(allText);


/* Fetch word+translation+tense+ conjugation tables for each verb on the page*/
// fetch("https://us-central1-marine-compass-391323.cloudfunctions.net/search-firestore-db?text=" + encodeURIComponent(allText))
//     .then(response => response.json())
//     .then(data => {
//         console.log(data.result); // Log the result key and value
//     })
//     .catch(error => {
//         console.error(error); // Log any errors
//     });


/* Save paragraph text on page */
let paragraphs = document.getElementsByTagName('p');
let giantText = '';
for (elt of paragraphs) {
  giantText += elt.textContent + ' ';
}
console.log("giantText STARTS HERE")
console.log(giantText);

/* Fetch the list of verbs from the postagger-2 cloud function.
THIS VERSION OF THE CODE WORKS. IT SUCCESSFULLY HIGHLIGHTS VERBS ON THE PAGE */
fetch("https://us-central1-marine-compass-391323.cloudfunctions.net/postagger-2?text=" + encodeURIComponent(giantText))
    .then(response => response.json())
    .then(verbsData => {
        console.log(verbsData.result); // Log the list of verbs

        // Highlight the detected verbs on the webpage
        const verbs = verbsData.result;
        verbs.forEach(verb => {
            const regex = new RegExp(`\\b${verb}\\b`, "gi");
            const matches = giantText.match(regex);
            if (matches) {
                matches.forEach(match => {
                    document.body.innerHTML = document.body.innerHTML.replace(
                        match,
                        `<span style="background-color: pink">${match}</span>`
                    );
                });
            }
        });
    })
    .catch(error => {
        console.error(error); // Log any errors
    });



/* Scartch Paper Code */
// let paragraphs = document.getElementsByTagName('p');
// let giantText = '';
// for (elt of paragraphs) {
//   elt.style.backgroundColor = '#F4C2C2';
//   giantText += elt.textContent + ' ';
// }
// console.log("giantText STARTS HERE")
// console.log(giantText);

