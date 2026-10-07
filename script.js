const button = document.getElementById("dark");

button.addEventListener("click", function(){
    document.body.classList.toggle("dark");
    
    if (document.body.classList.contains("dark")) {

        button.innerHTML = '<i class="fa fa-sun-o"></i>';
    } 
    else {
        button.innerHTML = '<i class="fa fa-moon-o"></i>';
    }
});

// const themeBtn = document.getElementById("themeBtn");

// themeBtn.addEventListener("click", function () {

//     document.body.classList.toggle("dark");

//     const icon = themeBtn.querySelector("i");

//     if (document.body.classList.contains("dark")) {

//         icon.classList.remove("fa-moon-o");
//         icon.classList.add("fa-sun-o");

//     } else {

//         icon.classList.remove("fa-sun-o");
//         icon.classList.add("fa-moon-o");

//     }

// });