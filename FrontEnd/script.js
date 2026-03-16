// Récupération des catégories dans l'api + création des boutons de filtres
async function getCategories() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    console.log(categories)   
    const portfolio = document.querySelector("#portfolio");
    const projects = portfolio.querySelector("h2")
    const filterContainer = document.createElement("div")
    filterContainer.classList.add("filter-container")
    projects.after(filterContainer) // Ajoute la nouvelle div après le h2
    const buttonAll = document.createElement("button")
    buttonAll.innerText = "Tous"
    buttonAll.id = "allCategories"
    filterContainer.appendChild(buttonAll)
    categories.forEach(category => {
        const buttonFilter = document.createElement("button")
        buttonFilter.innerText = category.name;
        filterContainer.appendChild(buttonFilter)
    })
}

// getCategories()
let works = []
// Récupération des works(images) dans l'api + création de la grille en dynamique
async function getWorks() {
    works = JSON.parse(window.localStorage.getItem("works"))//Ici le JSON.parse passe les données stockées en json
    if(works === null){
        const response = await fetch("http://localhost:5678/api/works");
        works = await response.json();
        afficherWorks(works)
        window.localStorage.setItem("works", JSON.stringify(works))// Ici on stock les données en les mettant en STRING
    }
    console.log(works)
    afficherWorks(works)
}
// getWorks()

function afficherWorks (works) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML=""
    works.forEach(work => {
        const figure = document.createElement("figure")
        const image = document.createElement("img")
        const figCaption = document.createElement("figcaption")
        gallery.appendChild(figure)
        figure.appendChild(image)
        image.after(figCaption)
        image.src = work.imageUrl
        image.alt = work.title
        figCaption.innerText = work.title
    })
}
let lastCategory = null // On déclare une variable qui n'a pas de valeur de base
function categoriesFilter () {
    const buttonAll = document.getElementById("allCategories")
    buttonAll.addEventListener("click", () => {
        afficherWorks(works)
    })
    const buttonFilters = document.querySelectorAll(".filter-container button")
    buttonFilters.forEach(buttonFilter => {
        buttonFilter.addEventListener("click", (event) => {
        const chosenCategory = event.target.textContent
        if (lastCategory === chosenCategory || "Tous" ){
            afficherWorks(works)
            lastCategory = null // On réattribue la valeur de base à la variable 
        } else {
        const chosenWorks = works.filter(work => work.category.name === chosenCategory)
        afficherWorks(chosenWorks)
        lastCategory = chosenCategory // On attribut une nouvelle valeur à la variable
        }
        })
    })
}
async function init() {
    await Promise.all ([getCategories(),getWorks()]) // on attend (2 promesse) que les deux fonction aient eu lieux pour poursuivre
    categoriesFilter()
}
init() 

// Vérification du token qui induit les changement dans le dom 