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
   .then(rabbits => rabbits.filter(rabbit => { 
   returnMatches(rabbit);
   renderRabbit(); 
}))
}

function returnMatches(rabbit) {
   let match = false; 
   // rabbit.map(key => {    
   //    inputObj.map(key => { 
   //    })
   // })
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
      
function renderRabbit() {
   if (matchArr.length === 1) {
      console.log(`We've got a match! It sounds like a ${matchArr}.`)
   }
   else if (matchArr.length === 2) {
      console.log("We found multiple match possibilities: " + matchArr[0] + " and a " + matchArr[1] +"."); 
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
