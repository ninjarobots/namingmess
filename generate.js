function generateName() {
  if (document.getElementById("alliterative").checked == true) {
    //Aliterative, doing real word because why not style on them a little bit
    return genRealWordAlliterative();
  }
  if (document.getElementById("realWord").checked == true) {
    //Aliterative, doing real word because why not style on them a little bit
    return generateRealWord();
  }
  //Custom word or random word case
  return addNameToList(genFullName());
}

function upperFirst(word) {
  if (word != undefined && word.length > 0) {
    return word[0].toUpperCase() + word.substring(1);
  }
  return word != undefined ? word.toUpperCase() : word;
}

function dictionaryLoad(dictionary) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      wordData[dictionary] = this.responseText.split("\n");
    }
  };
  xmlhttp.open("GET", "dictionary/" + dictionary + ".txt", true);
  xmlhttp.send();
}

function genRandomWord(speech, beginning = "") {
  if (beginning != "") {
    return genCustomWord(speech, beginning);
  }
  if (speech != undefined && speech != "random") {
    return wordData[speech][randomInt(wordData[speech].length)];
  } else {
    //Random
    if (total_length == 0) {
      findTotalLength();
    }
    idx = randomInt(total_length);
    for (key in wordData) {
      if (idx > wordData[key].length) {
        idx -= wordData[key].length;
      } else {
        return wordData[key][idx];
      }
    }
  }
}

function genCustomWord(speech, target) {
  //Used to generate a word based on the 2 character text boxes
  if (speech == undefined || speech == "") {
    return "";
  }
  customData = [];
  if (speech != "random") {
    //Search and build letter arrays
    for (i = 0; i < wordData[speech].length; i++) {
      if (wordData[speech][i].substring(0, target.length) == target) {
        customData.push(wordData[speech][i]);
      }
    }
  } else {
    //Random
    if (total_length == 0) {
      findTotalLength();
    }
    for (key in wordData) {
      for (i = 0; i < wordData[key].length; i++) {
        if (wordData[key][i].substring(0, target.length) == target) {
          customData.push(wordData[key][i]);
        }
      }
    }
  }
  if (customData.length == 0) {
    return "['" + target + "' does not exist in " + speech + " list]";
  } else {
    return customData[randomInt(customData.length)];
  }
}

wordData = {};
//stored here to reduce processing trying to recalculate it
total_length = 0;

function findTotalLength() {
  total_length = 0;
  for (key in wordData) {
    total_length += wordData[key].length;
  }
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function genData() {
  //Add list of dictionary files to the list below.
  //Files must be in dictionary/ directory and be named in the form [dictionary_list].txt
  //The only exception is 'random' which will specifically not attempt to read a database
  dictionary_list = ["random", "noun", "verb", "adjective", "animal", "adverb"];
  //enter the name of the dictionary you want to be marked as selected and the page will attempt to set those after creation
  default_selected_list = ["adjective", "animal"];
  //building the selectors
  selector_list = document.querySelectorAll("#PartOfSpeech select");
  for (cur_selector of selector_list) {
    for (cur_dictionary of dictionary_list) {
      new_option = document.createElement("option");
      new_option.value = cur_dictionary;
      new_option.innerText = upperFirst(cur_dictionary);
      cur_selector.appendChild(new_option);
    }
  }
  //populating wordData with dictionary names
  for (cur_dictionary of dictionary_list) {
    if (cur_dictionary != "random") {
      wordData[cur_dictionary] = [];
      dictionaryLoad(cur_dictionary);
    }
  }
  //Attempt to set the default selected values for the part of speech chooser.
  //Using normal for loop to ensure we can track track which index we are on, as default_selected_list relies on it
  for (x = 0; x < selector_list.length; x++) {
    for (opts of selector_list[x]) {
      if (opts.value == default_selected_list[x]) {
        opts.selected = true;
      }
    }
  }
}
function genFullName() {
  select_options = document.querySelectorAll("#PartOfSpeech select");
  first_letters = document.querySelectorAll("#first_two input");
  new_name = "";
  for (x = 0; x < select_options.length; x++) {
    if (select_options[x][select_options[x].selectedIndex].value != "") {
      new_name +=
        upperFirst(genRandomWord(select_options[x][select_options[x].selectedIndex].value, first_letters[x].value)) +
        " ";
    }
  }
  return new_name.trim();
}

function genNewTitle() {
  select_options = ["adjective", "animal"];
  first_letters = ["na", "me"];
  new_name = "";
  for (x = 0; x < select_options.length; x++) {
    new_name += upperFirst(genRandomWord(select_options[x], first_letters[x])) + " ";
  }
  document.getElementById("title-name").innerText = new_name.trim().toUpperCase();
}

function genMakeRealWord() {
  while (true) {
    curName = genFullName();
    if (isRealWord(curName)) {
      return curName;
    }
  }
}

function isRealWord(full_name) {
  split = full_name.split(" ");
  first_two = (split[0].substring(0, 2) + split[1].substring(0, 2)).toLowerCase();
  for (word in wordData) {
    if (wordData[word].indexOf(first_two) > -1) {
      return true;
    }
  }
  // Hits because word does not exist in any dictionary
  return false;
}

function generateRealWord() {
  word = genMakeRealWord();
  addNameToList(word);
}

function addNameToList(word) {
  //These brackets are only displayed when user receives an error, so they wont want to populate a four letter short name in these cases
  if (word.indexOf("[") > -1) {
    new_name = word;
  } else {
    new_name =
      word + " (" + (word.split(" ")[0].substring(0, 2) + word.split(" ")[1].substring(0, 2)).toUpperCase() + ")";
  }
  name_list = document.getElementById("name_list");
  for (item of name_list.children) {
    item.className = "";
  }
  newhr = document.createElement("hr");
  newli = document.createElement("li");
  newli.className = "text-success font-weight-bold";
  newli.innerText = new_name;
  for (node of document.querySelectorAll("#name_list hr")) node.remove();
  name_list.insertBefore(newhr, document.getElementById("name_list").firstChild);
  name_list.insertBefore(newli, document.getElementById("name_list").firstChild);
}

/* Generating a name in which the first two letters of each word combine to form a real word
  Such as Naughty Mermaid (NAME) */
function genRealWordAlliterative() {
  while (true) {
    curName = genMakeRealWord();
    if (isAlliterative(curName)) {
      return addNameToList(curName);
    }
  }
}

/* Returns true/false to identify two alliterative words. Pass full name including spaces */
function isAlliterative(full_name) {
  split = full_name.split(" ");
  return split[0][0] == split[1][0];
}

function clearEntries() {
  nameList = document.querySelectorAll("#name_list li");
  verify = confirm("Are you sure you want to clear all " + nameList.length + " entries?");
  if (verify == true) {
    document.querySelector("#name_list").textContent = "";
  }
}

window.onload = function() {
  this.document.getElementById("generate").setAttribute("onclick", "generateName()");
  this.document.getElementById("clear").setAttribute("onclick", "clearEntries()");
  this.document.getElementById("title-name").setAttribute("onmouseover", "genNewTitle()");
  genData();
  alliterative_check();
  realword_check();
};

/* Shows/hides first two letter option when alliterative is requested */
function alliterative_check() {
  //Change the "First Two" and "Last Two" Input Boxes to "Hidden" Respectively.
  chk = document.getElementById("alliterative").checked;
  document.getElementById("first_two").hidden = chk;

  if (chk == true) {
    document.getElementById("realWord").checked = true;
    document.getElementById("realWord").disabled = true;
    clearFirstLetters();
  } else {
    document.getElementById("realWord").disabled = false;
    document.getElementById("realWord").checked = false;
  }
}
function realword_check() {
  //Change the "First Two" and "Last Two" Input Boxes to "Hidden" Respectively.
  chk = document.getElementById("realWord").checked;
  document.getElementById("first_two").hidden = chk;
  if (chk == true) {
    clearFirstLetters();
  }
}

function clearFirstLetters() {
  inputs = document.querySelectorAll("#first_two input");
  for (txtbox of inputs) {
    txtbox.value = "";
  }
}
