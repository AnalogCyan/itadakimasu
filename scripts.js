let foods = [];
let dishes = [];
const button = ["Generate"];
const placeholders = ["correct-horse-battery-staple", "water-rhubarb-martini"];
const pass = document.getElementById("pass");
const genButton = document.getElementById("genButton");
const fullRecipeButton = document.getElementById("fullRecipeButton");
const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");
const url = "https://api.itadakimasu.app";

function gen(len) {
  let randFoods = [];
  let generated = "";
  //add the ingredients first
  for (let i = 0; i < len - 1; i++) {
    randFoods.push(foods[Math.floor(Math.random() * foods.length)]);
    randFoods.push("-");
  }
  //append a dish type
  randFoods.push(dishes[Math.floor(Math.random() * dishes.length)]);

  for (let i = 0; i < len * 2 - 1; i++) {
    generated += randFoods[i];
  }

  return generated;
}

document.addEventListener("DOMContentLoaded", async function () {
  document.getElementById("pass").textContent =
    placeholders[Math.floor(Math.random() * placeholders.length)];
  foods = await (await fetch("./data/foods.json")).json();
  dishes = await (await fetch("./data/dishes.json")).json();
});

pass.addEventListener("click", async () => {
  await navigator.clipboard.writeText(pass.innerText);
});

genButton.addEventListener("click", () => {
  pass.innerText = gen(slider.value);
});

fullRecipeButton.addEventListener("click", async () => {
  document.getElementById("spinner").style.display = "flex";
  try {
    const ingredients = document.getElementById("pass").innerText;
    const encodedIngredients = encodeURIComponent(ingredients);
    const response = await fetch(
      url + "/gen?ingredients=" + encodedIngredients
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data fetched successfully:", data);
    window.location = url + data.url;
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    document.getElementById("spinner").style.display = "none";
  }
});

slider.addEventListener("input", () => {
  sliderValue.textContent = slider.value;
  pass.innerText = gen(slider.value);
});
