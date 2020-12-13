var ingredients = [];
var recipes = [];
var button = [
  "Generate",
  "Generate Recipe",
  "Generate Password",
  "Generate Recipe Password",
  "Generate Random Password",
  "Generate Random Recipe",
  "Another!",
  "Not your cup of tea?",
  "Still hungry?",
];

var placeholders = ["correct-horse-battery-staple", "water-rhubarb-martini"];

async function starter() {
  const axios = window.axios;
  function getIngredients() {
    return axios.get("foods.json");
  }

  function getRecipes() {
    return axios.get("dishes.json");
  }

  const getBtn = document.getElementById("gen-btn");
  const opts = document.getElementById("options");

  try {
    getBtn.setAttribute("disabled", "disabled");
    opts.setAttribute("disabled", "disabled");
    if (window.innerWidth <= 350) {
      document.getElementById("gen").textContent = "Generate";
    }
    document.getElementById("pass").textContent =
      placeholders[Math.floor(Math.random() * placeholders.length)];
    if (!axios) {
      throw new Error("Axios is missing!!");
    }
    Promise.all([getIngredients(), getRecipes()]).then(function (results) {
      ingredients = results[0].data;
      recipes = results[1].data;
    });
  } catch (err) {
    console.error(
      `Error :: Couldn't download the dictionary :: ${err.message}`
    );
    window.alert("Error: Couldn't download the dictionary!!");
  } finally {
    getBtn.removeAttribute("disabled");
    opts.removeAttribute("disabled");
  }
}

function copyStringToClipboard(str) {
  // Create new element
  var el = document.createElement("textarea");
  // Set value (string to be copied)
  el.value = str;
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute("readonly", "");
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand("copy");
  // Remove temporary element
  document.body.removeChild(el);
}

function pass(btn, copy) {
  var slider = 4;
  var slider = document.getElementById("myRange");
  var randFoods = [];
  var generated = "";
  //add the ingredients first
  for (var i = 0; i < slider.value - 1; i++) {
    randFoods.push(ingredients[Math.floor(Math.random() * ingredients.length)]);
    randFoods.push("-");
  }
  //append a dish type
  randFoods.push(recipes[Math.floor(Math.random() * recipes.length)]);

  for (var i = 0; i < slider.value * 2 - 1; i++) {
    generated += randFoods[i];
  }

  document.getElementById("pass").textContent = generated;

  if (btn) {
    if (window.innerWidth > 350)
      document.getElementById("gen").textContent =
        button[Math.floor(Math.random() * button.length)];
  }

  if (copy) {
    copyStringToClipboard(generated);
  }
}

function menu() {
  var menu = document.getElementById("menu");
  if (menu.style.display === "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
}

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.textContent = slider.value; // Display the default slider value

function slide() {
  range_weight_disp.value = myRange.value;
  pass();
}
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function () {
  output.textContent = this.value;
  pass(false);
};
