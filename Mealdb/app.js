const searchBar = document.getElementById("search-bar");
const mealContainer = document.getElementById("meal-container");
const mealDetails = document.getElementById("meal-details");
const errorMessage = document.getElementById("error-message");

async function fetchMeals(query) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const data = await res.json();
    return data.meals;
}

function displayMeals(meals) {
    mealContainer.innerHTML = "";
    if (meals && meals.length > 0) {
        meals.forEach(meal => {
            const mealCard = document.createElement("div");
            mealCard.classList.add("meal-card");
            mealCard.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
            `;
            mealCard.addEventListener("click", () => showMealDetails(meal.idMeal));
            mealContainer.appendChild(mealCard);
        });
        errorMessage.style.display = "none";
    } else {
        errorMessage.style.display = "block";
    }
}

async function loadInitialMeals() {
    const randomMeals = [];
    for (let i = 0; i < 4; i++) {
        const meal = await fetchRandomMeals();
        randomMeals.push(meal[0]);
    }
    displayMeals(randomMeals);
}

async function fetchRandomMeals() {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
    const data = await res.json();
    return data.meals;
}

async function showMealDetails(id) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    const meal = data.meals[0];

    mealDetails.innerHTML = `
        <button class="close-btn" onclick="closeMealDetails()">×</button>
        <h2>${meal.strMeal}</h2>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>Ingredients:</h3>
        <ul>
            ${getIngredients(meal).map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        <h3>Instructions:</h3>
        <p>${meal.strInstructions}</p>
    `;
    mealDetails.classList.add("modal-active");
}

function getIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
    }
    return ingredients;
}

function closeMealDetails() {
    mealDetails.classList.remove("modal-active");
}

searchBar.addEventListener("input", async (e) => {
    const query = e.target.value.trim();
    if (query) {
        const meals = await fetchMeals(query);
        displayMeals(meals);
    } else {
        loadInitialMeals();
        errorMessage.style.display = "none";
    }
});

loadInitialMeals();
