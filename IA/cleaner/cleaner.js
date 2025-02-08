// MIT License
// Copyright (c) 2020 Luis Espino

function reflex_agent(location, stateA, stateB) {
  if (location == "BASE") {
    return Math.random() < 0.5 ? "MOVE_TO_A" : "MOVE_TO_B"; // Mover a A o B aleatoriamente
  } else if (stateA == "DIRTY" && location == "A") {
    return "CLEAN";
  } else if (stateB == "DIRTY" && location == "B") {
    return "CLEAN";
  } else if (location == "A" && stateA == "CLEAN") {
    if (stateA == "CLEAN" && stateB == "CLEAN") {
      return "RETURN_TO_BASE";
    }
    return "MOVE_TO_B";
  } else if (location == "B" && stateB == "CLEAN") {
    if (stateA == "CLEAN" && stateB == "CLEAN") {
      return "RETURN_TO_BASE";
    }
    return "MOVE_TO_A";
  }
}

function test(states, visitCount) {
  var location = states[0];
  var stateA = states[1];
  var stateB = states[2];
  var action_result = reflex_agent(location, stateA, stateB);

  document.getElementById("log").innerHTML +=
    "<br>Location: " + location + " | Action: " + action_result;

  if (action_result == "CLEAN") {
    if (location == "A") states[1] = "CLEAN";
    else if (location == "B") states[2] = "CLEAN";
  } else if (action_result == "MOVE_TO_A") {
    states[0] = "A";
  } else if (action_result == "MOVE_TO_B") {
    states[0] = "B";
  } else if (action_result == "RETURN_TO_BASE") {
    states[0] = "BASE";
    states[1] = "DIRTY"; // Reiniciar estados A y B a sucios
    states[2] = "DIRTY";
  }

  // Registrar el estado actual
  var currentState = location + "-" + stateA + "-" + stateB;
  visitCount[currentState] = true;

  // Verificar si se han visitado los 8 estados posibles
  if (Object.keys(visitCount).length >= 8) {
    document.getElementById("log").innerHTML +=
      "<br>All 8 states visited. Shutting down.";
    return; // Terminar la ejecución
  }

  setTimeout(function () {
    test(states, visitCount);
  }, 2000);
}

var states = ["BASE", "DIRTY", "DIRTY"];
var visitCount = {}; // Para rastrear los estados visitados
test(states, visitCount);
