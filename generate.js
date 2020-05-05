function loadFile(filePath) {
  var result = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", filePath, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    result = xmlhttp.responseText;
  }
  return result;
}

var button = [
  "Generate", "Generate Recipe", "Generate Password", "Generate Recipe Password", "Generate Random Password", "Generate Random Recipe", "Another!", "Not your cup of tea?", "Still hungry?"
];

var placeholders = [
  "correct-horse-battery-staple", "water-rhubarb-martini"
];

function starter() {
  document.getElementById("pass").innerHTML = placeholders[Math.floor(Math.random() * (placeholders.length))];
}

function randFood(){
  var foods = loadFile("./foods.txt").split("\n");
  var randFood = foods[Math.floor(Math.random() * (foods.length))];
  return randFood;
}

function pass() {
  var seperator = "-";
  document.getElementById("pass").innerHTML = randFood().concat(seperator.concat(randFood().concat(seperator.concat(randFood().concat(seperator.concat(randFood()))))));
  document.getElementById("gen").innerHTML = button[Math.floor(Math.random() * (button.length))];
}