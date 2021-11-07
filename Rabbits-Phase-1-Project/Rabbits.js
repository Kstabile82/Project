let inputObj = {
}; 
let inputArr = []; 
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
   let errorArr = []; 
   let collectionArray = []; 
      let collectionVals = Object.values(collection);
      collectionVals.map(val => {
         let collectionIds = val.id; 
         collectionArray.push(collectionIds.toLowerCase()); 
      })      
      collectionArray.map(idx => { 
         if (inputArr.includes(idx) === false) {
               errorArr.push(idx)
         }
      })
      if (errorArr.length > 0) {
         alert("Oops! Looks like you forgot to complete these fields: " + errorArr.join(", ").toUpperCase())
      }
      else {
         document.getElementById("rabbitform").style.display="none";   
         eliminators(inputObj);
      }
}

function eliminators(inputObj) {
   document.getElementById("instructions").style.display = "none";
   if (inputObj["ears"] === "Floppy" || inputObj["color"] === "Other" || inputObj["eyes"] === "Red/pink" || inputObj["eyes"] === "Blue" || inputObj["coat"] === "Spotted"){
      document.getElementById("rescues").style.display="block"
      document.getElementById("rescues").innerText = "Based on your input, it sounds like you are looking at a domestic rabbit that's been abandoned and needs help. Please try reaching out to an animal rescue local to your area to see if they can determine and get it to safety."
      showRescues(); 
   }
   else {
      getRabbits();
   }
   document.getElementById("rabbit finder").innerText = ""
   resetForm();
}

function getRabbits() {
   fetch("http://localhost:3000/rabbits") 
   .then(response => response.json()) 
   .then(rabbits => {
     returnMatches(rabbits)
   })
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
         category.addEventListener("change", function (e) { 
         let input = category.options[category.selectedIndex].value;
         inputArr.push(e.target.id);
         inputObj[`${category.id}`] = input;
     })
   }
}

function renderRabbit(matchArr, rabbits) { 
   resetForm();
   let matchString = "We found multiple match possibilities: "; 
   let p = document.createElement("p");
   document.getElementById("rabbit matches").appendChild(p);
   if (matchArr.length === 1) { 
      p.innerText = `We've got a match! ${matchArr}. However, some domestic rabbits have similar features to wild species. If this doesn't closely resemble what you see, it could be a domestic rabbit, in which case we recommend reaching out to your local animal rescues to see if they can further identify and help get it to safety.`;
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
   let rabbitmatches = document.getElementById("rabbit matches");
      while (rabbitmatches.firstChild) {
         rabbitmatches.removeChild(rabbitmatches.firstChild);
      }
   button.remove();
   document.getElementById("instructions").style.display = "block";
   document.getElementById("rescues").style.display = "none";
   document.getElementById("rabbitform").style.display="block" 
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
   listenForWildButton(inputObj, rabbits, radioForm); 
}

function listenForWildButton(inputObj, rabbits, radioForm) {
   radioForm.addEventListener('change', (e) => {
      e.preventDefault();
      if (e.target.value === 'yes') {
         showWildRabbits(inputObj, rabbits); 
         radioForm.remove(); 
         document.getElementById("rabbit matches").firstChild.remove();
      }
      else {
         radioForm.remove();
         document.getElementById("rabbit matches").firstChild.remove();
         document.getElementById("rescues").innerText = "Okay, here are some rabbit rescue search results to help you connect with one in your area:"; 
         showRescues(); 
      }
   })
}

function showWildRabbits(inputObj, rabbits) {
   let regionMatch = rabbits.filter(function(rabbit) {
      return rabbit["region"] === inputObj["region"] || rabbit["region"].includes(inputObj["region"])
   })
     regionMatch.filter(match => {
         matchArr.push(match["species"])
       })  
   matchArr.map(idx => {
      searchNature(idx);
})
}

function showRescues() {
   let searchDiv = document.createElement('div');
   document.getElementById("rescues").appendChild(searchDiv);
   let iframe = document.createElement('iframe')
     iframe.width = "1000";
     iframe.height = "400";
     searchDiv.appendChild(iframe);
     iframe.src = "https://www.google.com/search?igu=1&q=rabbit+rescues+near+me&source=hp&ei=KcR-YbPlItW5qtsP78eA-AE&iflsig=ALs-wAMAAAAAYX7SOfU8JyStKUoVixiJMCcck3XlrAZg&oq=rabbit+rescues+near+me&gs_lcp=Cgdnd3Mtd2l6EAMyCAgAEIAEEMkDMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeMgYIABAWEB4yBggAEBYQHjIGCAAQFhAeOhQILhCABBCxAxCDARDHARCjAhCTAjoICAAQgAQQsQM6CAguEIAEELEDOgUIABCABDoLCC4QgAQQxwEQ0QM6DgguEIAEELEDEMcBENEDOgsILhCABBDHARCjAjoICAAQsQMQgwE6DgguEIAEEMcBENEDEJMCOg4ILhCABBCxAxDHARCjAjoOCC4QgAQQsQMQgwEQkwI6BQguELEDOgsILhCABBDHARCvAToLCC4QgAQQsQMQkwI6BQgAEJIDOgUILhCABDoFCAAQhgNQugxYzC9gujFoAnAAeACAAYEBiAGiD5IBBDE5LjWYAQCgAQGwAQA&sclient=gws-wiz&ved=0ahUKEwjznc3liPXzAhXVnGoFHe8jAB8Q4dUDCAo&uact=5&output=embed)"
   resetForm();
   }

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

// function matchesFirstLevel(rabbits, category) {
//    let misMatchArr = []; 
//    let matchRabbitArr = []; 
//    if (category = "undefined") {
//       let categoryArr = []; 
//          for (let key in inputObj) {
//             categoryArr.push(key) 
//             categoryArr.filter(category => matchesNextLevel(category))
//          }
//    }
//    else {
//       matchesNextLevel(category)
//    }
//    function matchesNextLevel(category) {
//    rabbits.filter(function (rabbit) {
//       for (let key in rabbit) {
//          if (category === key) {
//             if (typeof rabbit[key] == "string" && inputObj[category] != rabbit[key]) {
//               misMatchArr.push(rabbit["species"])
//             }
//             else if (typeof rabbit[key] == "object" && !Array.from(rabbit[key]).includes(inputObj[category])) {
//                misMatchArr.push(rabbit["species"])
//             }
//          }
//       }
//       if (!misMatchArr.includes(rabbit["species"])) {
//        matchRabbitArr.push(rabbit["species"]);
//       }
//     })   
//    }
//    let set = new Set(matchRabbitArr)
//    matchArr = Array.from(set)
//    renderRabbit(matchArr, rabbits)
// }