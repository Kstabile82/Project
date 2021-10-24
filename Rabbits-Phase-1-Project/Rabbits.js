let inputObj = {
}; 
let matchArr = []; 
let button = document.createElement('btn');
let collection = document.getElementsByTagName('select');
let rabbitfinder = document.getElementById("rabbit finder");
let domesticStr = "Based on your input, it sounds like you are looking at a domestic rabbit that's been abandoned and is at risk. Please try reaching out to an animal rescue local to your area to see if they can determine and get it to safety."

document.addEventListener('DOMContentLoaded', () => {
   getInput();
   document.getElementById('rabbitform').addEventListener('submit', (e) => {
       e.preventDefault(); 
       errorMessage(); 
   })
   button.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById("rabbitform").reset();
      document.getElementById("rabbitform").style.display="block" 
      let rabbitmatches = document.getElementById("rabbit matches");
      while (rabbitmatches.firstChild) {
         rabbitmatches.removeChild(rabbitmatches.firstChild);
      }
      button.innerText = " "
   })
})

function errorMessage()  {    
   if (Object.keys(inputObj).length < collection.length ) {
      console.log("Please make sure you complete all the fields."); 
   }
   else {
      document.getElementById("rabbitform").style.display="none";   
      eliminators(inputObj);
      } 
}

function eliminators(inputObj) {
   if (inputObj["ears"] === "Floppy" || inputObj["color"] === "Other" || inputObj["eyes"] === "Red/pink" || inputObj["eyes"] === "Blue" || inputObj["coat"] === "Spotted"){
      console.log(domesticStr);
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
   renderRabbit(matchArr)
    //try linking the above and then doing if(eyeMatch && regionMatch && earMatch && colorMatch && coatMatch) push rabbit into matchArr
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

function renderRabbit(matchArr) { 
   inputObj = {}; 
   if (matchArr.length === 1) { 
      console.log(`We've got a match! ${matchArr}.`)
      searchNature(matchArr[0]);
   }
   else if (matchArr.length > 1) {
      let matchString = "We found multiple match possibilities: "; 
      matchArr.map(idx => {
         searchNature(idx);
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
   inputObj = {}; 
   matchArr = []; 
}

   // let container = document.getElementById("container");
   //document.getElementById('rabbitform').reset();
   // div.innerHTML = " ";
   // img.remove();
   // button.remove();
   // container.style.display = "block";
//})
   
   //   let div = document.createElement('div')
   //   document.getElementById("rabbit finder").appendChild(div)
   //   let iframe = document.createElement('iframe')
   //   iframe.width = "600";
   //   iframe.height = "400"
   //   iframe.src = data
   // document.getElementById("rabbit finder").appendChild(iframe);
   //div.innerHTML = data.results[0].preferred_common_name; 

// function searchFlickr (rabbit) {
//    if (rabbit.includes(" ")) {
//      rabbit.replaceAll(" ", " + "); 
//      }
//     fetch (`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=4b131cfca539bd6b4ea5252f067c1bbe&tags=${rabbit}&format=json&nojsoncallback=1&`)
//       .then(function(response) {
//          return response.json();
//       })
//       .then(data => {
//          for (let key in data) {
//             let secondKey = data[key]; 
//             for (let key in secondKey) {
//                let thirdKey = secondKey[key];
//                for (let key in thirdKey) {
//                   let fourthKey = thirdKey[key];
//                   for (let key in fourthKey) {
//                      if (key === "title") {
//                         if(fourthKey[key].toLowerCase().includes(rabbit.toLowerCase())) {
//                            console.log(fourthKey[key])
//                         }
//                      }
//                   }
//                }
//             }
//          }

//       })
//  }


//      for (let key in data) {
//            let secondKey = data[key];
//               for (let key in secondKey) {
//                 if (key === "search") {
//                    let search = secondKey[key];
//                    //array of objects containing more objects
//                     search.map(item => {
//                       for (let key in item) {
//                          if (key === "title") {
//                             let title = item[key]; 
//                             if (title.toLowerCase() === rabbit.toLowerCase()) {
//                                console.log(item)
//                               }
//                            }
//                         }
//                      })
//                   }
//                }  
//        }
//    })
// }



//flickr.galleries.getPhotos api_key=d9416fc65dae6717c665c2db49b1580e&photoset_id=&user_id=&page=1&per_page=4&

//https://live.staticflickr.com/{server-id}/{id}_{secret}_{size-suffix}.jpg
//https://live.staticflickr.com/7372/12502775644_acfd415fa7_w.jpg

//api key="d9416fc65dae6717c665c2db49b1580e" photoset id="" user id="" page="1" per page = "4"
//Flickr
//flickr.activity.userPhotos
//flickr.photos.search
//flickr.photos.licenses.getInfo
//flickr.photosets.getPhotos
//<photoset id="4" primary="2483" page="1" perpage="500" pages="1" total="2">
// {/* <photo id="2484" secret="123456" server="1" title="my photo" isprimary="0" />
// <photo id="2483" secret="123456" server="1" title="flickr rocks" isprimary="1" />
// </photoset> *//}

//Key:
//d9416fc65dae6717c665c2db49b1580e

// Secret:
// 472cc1aaf8a2a2bb

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

   // for (let key in inputObj) {
   //    rabbits.filter(function(rabbit) {
        // console.log(rabbit[rabbitKey] === inputObj[key] || rabbit[rabbitKey].includes(inputObj[key]))
      // })
   

         //   if category.value === " ") { try this using e.target
         //       console.log("Please make sure you complete all the fields.")
         //   }
         //   else {
         //       console.log(inputObj)
         //   }

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
