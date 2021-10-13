let inputObj = {
}; 

function getRabbits() {
fetch("http://localhost:3000/rabbits") 
.then(response => response.json()) 
.then(rabbitData => rabbitData.map(rabbit => console.log(rabbit.species)))
}
document.addEventListener('DOMContentLoaded', () => {
    let region = document.getElementsByTagName("select")[0];
    //this identifies the specific select box. Can I interpolate this? 
    //try to use .this, and assign classes? 
   region.addEventListener("change", function () { //maybe i can make all of this the renderInput function and have category be the arg? 
        //detects change in selection
        let input = region.options[region.selectedIndex].value;
        //how to access the input 
        inputObj[`${region.id}`] = input;
        //stores the input and category as key value pairs
    })
    document.getElementById('rabbitform').addEventListener('submit', (e) => {
       e.preventDefault(); 
       console.log(inputObj); 
    //call renderInput here       
   })
})
function renderInput() {
    
        //    if (input === 'holder') {
        //        console.log("Please make sure you complete all the fields.")
        //    }
        //    else {
        //        upon successful submission, push all the input into inputObj
        //    }
}
//querySelector or find element by className "category", then eventlistener for a click or submit. 
//event listener on select form submission. if option.value === holder, they didn't answer everything, error message. else, execute rabbitInput function
//rabbitInput fn saves option.value to a variable named ${category} and push it into newObj
//compare newObj to stored ones -- call comparisonFn

//comparisonFn
//if each category matches && array categories.includes(newObj.element) 
//if ears === floppy || eyes === red || coat === spotted || color === other, return domestic
//but just in case, here is a list of all the types of wild rabbits that are common in your region: 

//return fetch request on the returned rabbit types. append wiki frame and image into html? 
//else return the domestic rabbit statement and fetch 

//"It sounds like you're looking at a ___ or a ___. Here are pictures and some further details to help you determine!"
//"You might be looking at a domestic rabbit that's been abandoned and is at risk. Please try reaching out to an animal rescue local to your area to see if they can determine and get it to safety."
//"It sounds like you're looking at a ___, but it could also be a domestic rabbit that needs help. Here are some images of ____ so that you can compare. If you think it's domestic, please try reaching out to an animal rescue local to your area to see if they can determine and get it to safety."