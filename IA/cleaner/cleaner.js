// MIT License
// Copyright (c) 2020 Luis Espino

function reflex_agent(location, state) {
  if (state == "DIRTY") return "CLEAN";
  else if (location == "A") return "RIGHT";
  else if (location == "B") return "LEFT";
}

let visitedStates = new Set();

function test(states) {
  var location = states[0];
  var state = states[0] == "A" ? states[1] : states[2];

  let stateKey = states.join(",");
  visitedStates.add(stateKey);

  var action_result = reflex_agent(location, state);
  document.getElementById("log").innerHTML +=
    "<br>Location: " + location + " | Action: " + action_result;

  if (action_result == "CLEAN") {
    if (location == "A") states[1] = "CLEAN";
    else if (location == "B") states[2] = "CLEAN";
  } else if (action_result == "RIGHT") states[0] = "B";
  else if (action_result == "LEFT") states[0] = "A";

  if (visitedStates.size >= 8) {
    document.getElementById("log").innerHTML +=
      "<br>Fin del proceso. Se visitaron los 8 estados.";
    return;
  }

  setTimeout(function () {
    test(states);
  }, 2000);
}

// Estado inicial: A y ambas ubicaciones sucias
var states = ["A", "DIRTY", "DIRTY"];
test(states);
