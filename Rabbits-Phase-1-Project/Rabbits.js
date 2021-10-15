let inputObj = {
}; 
let matchArr = []; 
let collection = document.getElementsByTagName('select');
let domesticStr = "Based on your input, it sounds like you are looking at a domestic rabbit that's been abandoned and is at risk. Please try reaching out to an animal rescue local to your area to see if they can determine and get it to safety."
let wildStr = `It sounds like you're looking at a wild rabbit. Here are some that matched your input so that you can compare and determine!`
let maybeEither = `It sounds like you're looking at a wild rabbit, but it's difficult to confirm based on the data provided. Here are some wild rabbits that match your input so that you can compare. If you think it's domestic, please try reaching out to an animal rescue local to your area to see if they can help determine and get it to safety.`
function errorMessage()  {   //why does this only work up here and not down with other functions?  
   if (Object.keys(inputObj).length < 7 ) { //try e.target here to get length of collection
      console.log("Please make sure you complete all the fields."); 
   }
   else {
         eliminators(inputObj);
      }
}
function eliminators(inputObj) {
   if (inputObj["ears"] === "floppy" || inputObj["color"] === "other" || inputObj["eyes"] === "red" || inputObj["eyes"] === "blue" || inputObj["coat"] === "spotted"){
      console.log(domesticStr);
   }
   else {
      getRabbits();
   }
}
function getRabbits() {
   fetch("http://localhost:3000/rabbits") 
   .then(response => response.json()) 
   .then(rabbits => {
      returnMatches(rabbits)
      renderRabbit(matchArr)
   })
}

function returnMatches(rabbits) {
   rabbits.filter(rabbit => { 
   let match = false; 
      for (let key in rabbit) { 
         for (let key in inputObj) {    
            if (rabbit[key] === "id" || key === "image" || key === "species") {
               match = true;
            }
            else if (Array.isArray(rabbit[key]) && rabbit[key].includes(inputObj[key])) { 
               match = true; 
            }
            else if (rabbit[key] === inputObj[key]) {
               match = true;
            }   
         }   
      }
      if (match === true) {
        matchArr.push(rabbit.species)
      }
      else {
      }
   })
}
document.addEventListener('DOMContentLoaded', () => {
   getInput();
   //  let region = document.getElementsByTagName("select")[0];
   //  //this identifies the specific select box. Can I interpolate this? 
   //  //try to use .this, and assign classes? 
   // region.addEventListener("change", function () { //maybe i can make all of this the renderInput function and have category be the arg? 
   //      //detects change in selection
   //      let input = region.options[region.selectedIndex].value;
   //      //how to access the input 
   //      inputObj[`${region.id}`] = input;
   //      //stores the input and category as key value pairs
   //  })
    document.getElementById('rabbitform').addEventListener('submit', (e) => {
       e.preventDefault(); 
       errorMessage(); 
   })
})
function getInput() {
   let categories = document.getElementsByTagName("select");
   for (let i = 0; i < categories.length; i++) {
      let category = document.getElementsByTagName("select")[i];
      category.addEventListener("change", function () { 
         let input = category.options[category.selectedIndex].value;
         inputObj[`${category.id}`] = input;
     })
   }
} 
function renderRabbit(matchArr) { 
   if (matchArr.length === 1) { //this is printing even when matchArr is 2, maybe calling this fn in wrong spot
      console.log(`We've got a match! It sounds like a ${matchArr}.`)
      //searchWiki(matchArr[0]);
   }
   else if (matchArr.length > 1) {
      let matchString = "We found multiple match possibilities: "; 
      matchArr.map(idx => {
         //searchWiki(idx);
         //iterate through matchArr
         if (matchArr.indexOf(idx) === matchArr.length-1) {
            matchString += "and " + idx + ".";
            //identifies whether it's the last. 
            console.log(matchString);

         }
         else {
            matchString += `${idx}, `
            //else just continue adding idx to the string.
         }
      })
   }
}
//return fetch request on the matches. append wiki frame and image into html? 

         //   if category.value === " ") { try this using e.target
         //       console.log("Please make sure you complete all the fields.")
         //   }
         //   else {
         //       console.log(inputObj)
         //   }
//querySelector or find element by className "category", then eventlistener for a click or submit. 
//event listener on select form submission. if option.value === holder, they didn't answer everything, error message. else, execute rabbitInput function
//rabbitInput fn saves option.value to a variable named ${category} and push it into newObj
//compare newObj to stored ones -- call comparisonFn


//https://en.wikipedia.org/w/api.php?action=query&prop=value&. .& format=json
//. . srsearch=Craig%20Noone indicates the page title or content to search for. The %20 indicates a space character in a URL.
//If you want plain text only, use TextExtracts: http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext=1&titles=Unix
//https://en.wikipedia.org/wiki/Snowshoe_hare
//https://en.wikipedia.org/w/api.php?action=query&prop=value&Snowshoe_hare&format=json

//vv Note that the TextExtracts extension must be installed on the wiki in order to use this method. To see if it is installed, go to Special:Version on the wiki you are targeting.
//https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&exlimit=1&titles=Snowshoe_hare&explaintext=1&formatversion=2 

//http://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=max&explaintext&exintro&titles=Showshoe_hare

//Get the part of the article you want as HTML. It's much easier to strip HTML than to strip wikitext!
//http://en.wikipedia.org/w/api.php?action=query&prop=revisions&rvsection=0&titles=Snowshoe_hare&rvprop=content

//"https://en.wikipedia.org/w/api.php?action=opensearch&search="+ searchTerm + "&format=json&callback=?";
//https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&search=


function searchWiki (rabbit) {
    if (rabbit.includes(" ")) {
      rabbit.replaceAll(" ", "%20"); 
      //let newRabbit = rabbit.replace(/" "/gi, '%20') //why doesnt this work?
      }
   const endpoint = `https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&srsearch=${rabbit}&format=json`
   fetch(endpoint, {
      method: 'get', 
      headers: {
         "Content-Type": "application/json", 
      }
   })
   .then(function(response) {
      return response.json();
   })
   .then(function(data) {
      for (let key in data) {
            let secondKey = data[key];
               for (let key in secondKey) {
                 if (key === "search") {
                    let search = secondKey[key];
                    //array of objects containing more objects
                     search.map(item => {
                       for (let key in item) {
                          if (key === "title") {
                             let title = item[key]; 
                             if (title.toLowerCase() === rabbit.toLowerCase()) {
                                console.log(item)
                             }
                          }
                       }
                    })
                   }
               }  
      }
   })
}
//how do i narrow down to only exact matches returned? 
// for (let key in data) {
//    let secondKey = data[key]
//     for (let key in secondKey) {
//       let thirdKey = secondKey[key]
//       for (let key in thirdKey) { 
//          let searchData = thirdKey[key];
//              if (searchData.title === rabbit) {
//               console.log(searchData)
//            }
//        }
// }
// }
//clean that up with a while loop??
//when we get to the key that is an array, we break out of loop

   
