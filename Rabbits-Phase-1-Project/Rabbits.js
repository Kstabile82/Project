let inputObj = {
}; 
let matchArr = []; 
let button = document.createElement('btn');
let collection = document.getElementsByTagName('select');

document.addEventListener('DOMContentLoaded', () => {
   getInput();
   document.getElementById('rabbitform').addEventListener('submit', (e) => {
       e.preventDefault(); 
       errorMessage(); 
   })    
})

function errorMessage()  {    
   if (Object.keys(inputObj).length < collection.length ) {
      alert("Please make sure you complete all the fields."); 
   }
   else {
      document.getElementById("rabbitform").style.display="none";   
      eliminators(inputObj);
      } 
}

function eliminators(inputObj) {
   if (inputObj["ears"] === "Floppy" || inputObj["color"] === "Other" || inputObj["eyes"] === "Red/pink" || inputObj["eyes"] === "Blue" || inputObj["coat"] === "Spotted"){
      let p = document.createElement("p");
      p.innerText = "Based on your input, it sounds like you are looking at a domestic rabbit that's been abandoned and needs help. Please try reaching out to an animal rescue local to your area to see if they can determine and get it to safety."
      document.getElementById("rabbit matches").appendChild(p);
      resetForm(); 
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
   })
}

function categoryTest(category, inputObj, rabbits) {
     let matches = rabbits.filter(function(rabbit) {
      return rabbit[category] === inputObj[category] || rabbit[category].includes(inputObj[category])
   })
      // can i do this instead of returnMatches below, and use recursion? Base case would be: matches = rabbits.length? or 0? 
   return matches; 
}

function returnMatches(rabbits) {
   let eyeMatch = rabbits.filter(function (rabbit) {
      return rabbit.eyes === inputObj.eyes || rabbit.eyes.includes(inputObj.eyes)  
   })    
   let regionMatch = eyeMatch.filter(function(rabbit) {
      return rabbit.region === inputObj.region || rabbit.region.includes(inputObj.region)
   })     
   let earMatch = regionMatch.filter(function(rabbit) {
      return rabbit.ears === inputObj.ears || rabbit.ears.includes(inputObj.ears)
   })
   let colorMatch = earMatch.filter(function(rabbit) {
      return rabbit.color === inputObj.color || rabbit.color.includes(inputObj.color)
   })
   let coatMatch = colorMatch.filter(function(rabbit) {
      return rabbit.coat === inputObj.coat || rabbit.coat.includes(inputObj.coat)
   })
   let sizeMatch = coatMatch.filter(function(rabbit) {
      return rabbit.size === inputObj.size || rabbit.size.includes(inputObj.size)
   })
   sizeMatch.filter(match => {
     matchArr.push(match["species"])
   })
   renderRabbit(matchArr, rabbits)
}   

function getInput() {
   for (let i = 0; i < collection.length; i++) {
         let category = collection[i];
         category.addEventListener("change", function () { 
         let input = category.options[category.selectedIndex].value;
         inputObj[`${category.id}`] = input;
     })
   }
} 

function renderRabbit(matchArr, rabbits) { 
   let matchString = "We found multiple match possibilities: "; 
   let p = document.createElement("p");
   document.getElementById("rabbit matches").appendChild(p);
   p.innerText = `We've got a match! ${matchArr}.`
   if (matchArr.length === 1) { 
      p.innerText = `We've got a match! ${matchArr}.`
      searchNature(matchArr[0]);
   }
   else if (matchArr.length > 1) {
      p.innerText = matchString; 
      matchArr.map(idx => {
         searchNature(idx);
         if (matchArr.indexOf(idx) === matchArr.length-1) {
            p.innerText += " and " + idx + ". However, some domestic rabbits have similar features to wild species. If none of these pictures closely resemble what you see, it could be a domestic rabbit, in which case we recommend reaching out to your local animal rescues to see if they can further identify and help get it to safety. ";
         }
         else {
           p.innerText += ` ${idx}, `
         }
      })
   }
   else if (matchArr.length === 0) {
      p.innerText = "No matches came up in our search, so it sounds like you are looking at a domestic rabbit that needs help, and suggest that you reach out to a local animal rescue group. But just in case, do you want to see a listing of all wild rabbit species that are found in your area so that you can compare?"
      showWildButton(inputObj, rabbits); 
   }
   resetForm();
}

function searchNature(idx) {
   let rabbitmatches = document.getElementById("rabbit matches");
   if (idx.includes(" ")) {
           idx.replaceAll(" ", "%20"); 
      }
   fetch (`https://api.inaturalist.org/v1/taxa?q=${idx}`)
   .then(function(response) {
      return response.json();
   })
   .then(data => {
      let defaultImg = data.results[0].default_photo.medium_url
      let div = document.createElement('div')
      let header = document.createElement('h3')
      let p = document.createElement('p')
   
      rabbitmatches.appendChild(div)
      header.innerText = data.results[0].preferred_common_name; 
      div.id = `${data.results[0].preferred_common_name}`
      div.appendChild(header)
      p.innerHTML = data.results[0].default_photo.attribution; 
      let img = document.createElement('img')
      img.src = defaultImg;
      img.width = "250"
      img.height = "165"
      div.appendChild(img)
      div.appendChild(p)
   })
}

function resetForm() {
   let rabbitfinder = document.getElementById("rabbit finder");
   rabbitfinder.appendChild(button)
   button.innerText = "Reset Form"
   button.addEventListener("click", (e) => {
      e.preventDefault();
      homePage(); 
   })
} 

function homePage() {
   inputObj = {}; 
   matchArr = []; 
   document.getElementById("rabbitform").reset();
      document.getElementById("rabbitform").style.display="block" 
      let rabbitmatches = document.getElementById("rabbit matches");
      while (rabbitmatches.firstChild) {
         rabbitmatches.removeChild(rabbitmatches.firstChild);
      }
      button.remove();
}

function showWildButton(inputObj, rabbits) {
   let radioForm = document.createElement("form");
   document.getElementById("rabbit matches").appendChild(radioForm);
   let yesButton = document.createElement("input"); 
   yesButton.type = "radio";
   yesButton.name = "wildBunnies"
   yesButton.value = "yes";
   radioForm.appendChild(yesButton); 
   let yesLabel = document.createElement('label');
   yesLabel.textContent = "Yes"
   radioForm.appendChild(yesLabel)
   let noButton = document.createElement("input"); 
   noButton.type = "radio";
   noButton.name = "wildBunnies";
   noButton.value = "no";
   radioForm.appendChild(noButton);
   let noLabel = document.createElement('label');
   noLabel.textContent = "No";
   radioForm.appendChild(noLabel);
   radioForm.addEventListener('change', (e) => {
      e.preventDefault();
      if (e.target.value === 'yes') {
         showWildRabbits(inputObj, rabbits); 
      }
      else {
         homePage();
      }
   })
}

function showWildRabbits(inputObj, rabbits) {
//    let regionMatch = rabbits.filter(function (rabbit) {
//       return rabbit.region === inputObj.region || rabbit.region.includes(inputObj.region)  
//    })
   let regionMatch = categoryTest("region", inputObj, rabbits); 
   console.log(regionMatch); 
     regionMatch.filter(match => {
         matchArr.push(match["species"])
       })  
   matchArr.map(idx => {
      searchNature(idx);
})
}

   //   let div = document.createElement('div')
   //   document.getElementById("rabbit finder").appendChild(div)
   //   let iframe = document.createElement('iframe')
   //   iframe.width = "600";
   //   iframe.height = "400"
   //   iframe.src = data
   // document.getElementById("rabbit finder").appendChild(iframe);
   //div.innerHTML = data.results[0].preferred_common_name; 

//FLICKR
//Key: d9416fc65dae6717c665c2db49b1580e
//Secret: 472cc1aaf8a2a2bb

// function filterFunc(rabbits) {
// //could also convert each rabbit to array using Object.entries(rabbit).slice() and slice off first 2 and last idx, and convert inputObj, and compare...loop through array, if idx 1 isArray, use the conditionals below
// let match = false;
// for (let info in inputObj) {
//    let inputElement = inputObj[info]
//    // console.log(inputElement)
//    rabbits.map(rabbit => { 
//       for (let key in rabbit) {
//          let dataElement = rabbit[key];
//          // console.log(dataElement)
//          if (Array.isArray(dataElement) && dataElement.includes(inputElement)) {
//             dataElement === inputElement;
//             match = true
//          }
//          else if (dataElement === inputElement) {
//             match = true; 
//          }
//          else {
//             match = false; 
//          }
//       }
//    })
// }

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
