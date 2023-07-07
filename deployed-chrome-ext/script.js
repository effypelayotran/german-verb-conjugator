/* Saving text */
let paragraphs = document.getElementsByTagName('p');
let giantText = '';

for (elt of paragraphs) {
  elt.style.backgroundColor = '#F4C2C2';
  giantText += elt.textContent + ' ';
}

console.log(giantText);


// let allText = document.body.innerText;
// console.log(allText);

fetch("https://us-central1-marine-compass-391323.cloudfunctions.net/postagger-2?text=" + encodeURIComponent(giantText))
    .then(response => response.json())
    .then(data => {
        console.log(data.result); // Log the result key and value
    })
    .catch(error => {
        console.error(error); // Log any errors
    });
