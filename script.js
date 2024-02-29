/***
 *
 *
 * PART 1 ---- SIMPLE POSTAG VERB/AUX HIGHLIGHTING
 * main verbs = orange
 * auxiliary and adp = yellow <--- not yet implemented
 *
 *
 */
// Collect text content from all <p> elements on the page
let paragraphs = document.getElementsByTagName("p");
let paragraphText = "";
for (const elt of paragraphs) {
  paragraphText += elt.textContent + " ";
}
console.log("Running ConjugateThisDict...");
console.log("ParagraphText: ", paragraphText);

// Fetch the list of verbs from the postagger-2 cloud function.
fetch(
  "https://us-central1-marine-compass-391323.cloudfunctions.net/postagger-2?text=" +
    encodeURIComponent(paragraphText)
)
  .then((response) => response.json())
  .then((verbsData) => {
    console.log("Detected AUX/VERBS: ", verbsData.result); // Log the list of verbs

    // Highlight the detected verbs on the webpage
    const verbs = verbsData.result;
    verbs.forEach((verb) => {
      const regex = new RegExp(`\\b${verb}\\b`, "gi");
      const matches = paragraphText.match(regex);
      if (matches) {
        matches.forEach((match) => {
          document.body.innerHTML = document.body.innerHTML.replace(
            match,
            `<span style="background-color: pink">${match}</span>`
          );
        });
      }
    });
  })
  .catch((error) => {
    console.error("Error: ", error); // Log any errors
  });

/***
 *
 *
 * PART 2: Fetching list of verbpairdicts
 * NOTE: verbs like "warte" aren't being recognized here. This is where
 * the discrepancy is coming from.
 *
 *
 *  */
let global_list_of_verbpairdict = [];

// Function to fetch list_of_verbpairdicts from the Flask cloud function
async function fetchData(paragraphText) {
  try {
    const encodedText = encodeURIComponent(paragraphText);
    const response = await fetch(
      `https://us-central1-marine-compass-391323.cloudfunctions.net/postag_text2?megatext=${encodedText}`
    );
    const data = await response.json();
    return data.result; // Extract the 'result' key from the JSON response
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
}

// Call the function to fetch data and save the result to the global variable
async function fetchDataAndSave(paragraphText) {
  try {
    const result = await fetchData(paragraphText);
    global_list_of_verbpairdict = result;
  } catch (error) {
    console.error("Error: ", error);
  }
}

fetchDataAndSave(paragraphText);

/***
 *
 *
 * PART 3: Getting smaller detailed svp_dict for each verbpairdict
 * If there is no match for lemma_to_search, conjugation_tables = None.
 *
 *
 */

const megadict = [];

async function fetchDataGeneral(url, params) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${url}?${queryString}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return null;
  }
}

// Function to fetch data for single verbpairdict
async function fetchVerbPairDictData(verbpairdict) {
  const { verb, aux_list, prefix, verb_morph, verb_lemma } = verbpairdict;
  const params = {
    verb: verb,
    len_aux_list: aux_list.length,
    aux_list1: aux_list[0],
    aux_list2: aux_list.length === 2 ? aux_list[1] : undefined,
    prefix: prefix,
    verb_morph: verb_morph,
    verb_lemma: verb_lemma,
  };

  const url =
    "https://us-central1-marine-compass-391323.cloudfunctions.net/process_verbpairdict2";

  try {
    const result = await fetchDataGeneral(url, params);

    // Only push the result into megadict if main_verb is not "AUXisMain"
    if (verb !== "AUXisMain") {
      megadict.push({ main_verb: verb, svp_dict: result });
    }

    // Loop through each aux_verb in the aux_list and add it to the megadict array
    for (const aux_verb of aux_list) {
      // Ignore if the aux_verb is 'None'
      if (aux_verb !== "None") {
        megadict.push({ aux_verb: aux_verb, svp_dict: result });
      }
    }
  } catch (error) {
    console.error("Error fetching data for verbpairdict:", verbpairdict, error);
  }
}

async function processListOfVerbPairDicts(list_of_verbpairdicts) {
  console.log("Fetching svp_dicts .....");
  const promises = list_of_verbpairdicts.map(fetchVerbPairDictData);
  await Promise.all(promises);
  console.log("All svp_dicts fetched.");
}

async function main() {
  await fetchDataAndSave(paragraphText);
  await processListOfVerbPairDicts(global_list_of_verbpairdict);

  // Pairs each highlighted word in Part 1 to its verbpairdict data
  // Note: But what about words like "sind" that appear multiple times in text.
  // but with different use cases each time? This won't work because
  // the keys need to be unique. I want there to be as many key-value pairs
  // in Global Megadict as there are in the list of all verbpairdicts.

  /* Try a different data structure for this, maybe just maintain the list
    of highlighted verbs from Part1 but make it into a touple. Hashmap is not 
    as necessary here because you're not "search" ing for a specific value, you're
    just displaying all the values equally at the end of the day.*/
  console.log("Global List of SVP: ", global_list_of_verbpairdict);
  console.log("Global Megadict: ", megadict);
}

main();
