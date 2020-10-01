var foods = [];
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
  const getBtn = document.getElementById("gen-btn");
  const opts = document.getElementById("options");
  const axios = window.axios;
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
    const { data } = await axios.get("foods.json");
    foods = data;
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

function pass(btn) {
  var slider = 4;
  var slider = document.getElementById("myRange");
  var randFoods = [];
  var generated = "";

  for (var i = 0; i < slider.value; i++) {
    randFoods.push(foods[Math.floor(Math.random() * foods.length)]);
    randFoods.push("-");
  }

  for (var i = 0; i < slider.value * 2 - 1; i++) {
    generated += randFoods[i];
  }

  document.getElementById("pass").textContent = generated;

  if (btn) {
    if (window.innerWidth > 350)
      document.getElementById("gen").textContent =
        button[Math.floor(Math.random() * button.length)];
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
