//This script checks all enabled keywords in an Adwords account.
//Labels are applied to any keywords that are not in the same ad group and are:
//  - duplicates
//  - are broad match and can be reodered into duplicates, i.e. "cheap hot dogs for sale" & "for sale hot dogs cheap"
//  - have broad match modifiers and the modified terms can be rearranged into duplicates, i.e. "+cheap +beer nearby" & "+cheap cold +beer for sale"
//
//Jake Ratliff
//29 April 2018



function createLabels(){
  if(!AdWordsApp.labels().withCondition("Name = 'Duplicate Keyword'").get().hasNext()){
    AdWordsApp.createLabel("Duplicate Keyword");
  }
  if(!AdWordsApp.labels().withCondition("Name = 'Reordered Broad Match'").get().hasNext()){
    AdWordsApp.createLabel("Reordered Broad Match");
  }
  if(!AdWordsApp.labels().withCondition("Name = 'Duplicate BMMs'").get().hasNext()){
    AdWordsApp.createLabel("Duplicate BMMs");
  }
}


var duplicateKwIds = [];
var reorderedBMIds = [];
var duplicateBMMsIds = [];


function checkKeywords(){
  for(i = 0; i < keywords.length; i++){
    var keyword1 = keywords[i];
    for(j = 0; j < keywords.length; j++){
      var keyword2 = keywords[j];
      if(keyword1.adgroup == keyword2.adgroup){
        continue;
      }
      if(keyword1.type == keyword2.type){
        if(checkDuplicate(keyword1.keyword, keyword2.keyword)){
          duplicateKwIds.push([keyword1.adgroup, keyword1.KwID]);
        }else{
          if(keyword1.type == "BROAD"){
            if (checkOrderSwap(keyword1.keyword, keyword2.keyword)){
              Logger.log("These are the same broad match terms but in different order: " + keyword1.keyword + "  " + keyword2.keyword);
              reorderedBMIds.push([keyword1.adgroup, keyword1.KwID]);
            }{
              if (checkModBroadSwap(keyword1.keyword, keyword2.keyword)){
                Logger.log("These keyword have the same BMMs: " + keyword1.keyword + "  " + keyword2.keyword);
                duplicateBMMsIds.push([keyword1.adgroup, keyword1.KwID]);
              }
            }
          }
        }
      }
    }
  }
}

function checkDuplicate(x,y){
  if(x == y){
    return true
  }else{
    return false
  }
}

function checkOrderSwap(x,y){
  var keyword1 = x.split(' ').sort().toString();
  var keyword2 = y.split(' ').sort().toString();
  return keyword1 == keyword2
}

function checkModBroadSwap(x,y){
  var mods1 = x.split(' ').filter(function(i){return i.indexOf('+') == 0});
  var mods2 = y.split(' ').filter(function(i){return i.indexOf('+') == 0});
  if(mods1.length > 0 && mods2.length > 0){
    mods1 = mods1.sort().toString();
    mods2 = mods2.sort().toString();
    return mods1 == mods2 
  }else{
    return false
  }
}

function applyLabelsToKws(list, label){
  if (list.length == 0){
    return
  }
  keywordIterator = AdWordsApp.keywords()
      .withIds(list)
      .get();
  while (keywordIterator.hasNext()) {
    var keyword = keywordIterator.next();
    if(!keyword.labels().withCondition('Name = "'+label+'"').get().hasNext()){
      keyword.applyLabel(label);
    }
  }
}

var keywords = [];
var counter = 0;
var bCounter = 0;
var mbCounter = 0;
var pCounter = 0;
var eCounter = 0;

function getModBroadKWs(){
  Logger.log(broadMatchKWs.length);
  for (i in broadMatchKWs){
    var keyword = broadMatchKWs[i];
    if (keyword.indexOf("+")>-1){
      Logger.log("mod broad: " + keyword);
      mbCounter += 1;
    }else{
      Logger.log("plain broad: " + keyword);
    }
  }
}

function getEnabledKeywords(){
  var keywordIterator = AdWordsApp.keywords().withCondition('Status = "ENABLED"').get()
  if (keywordIterator.hasNext()){
    while (keywordIterator.hasNext()) {
      var keyword = keywordIterator.next();
      if (keyword.getMatchType() == "BROAD"){
        //broadMatchKWs.push(keyword.getText());
        bCounter += 1;
      }
      if (keyword.getMatchType() == "PHRASE"){
        //phraseMatchKWs.push(keyword.getText());
        pCounter += 1;
      }
      if (keyword.getMatchType() == "EXACT"){
        //exactMatchKWs.push(keyword.getText());
        eCounter += 1;
      }
      keywords.push({'keyword': keyword.getText(), 'type': keyword.getMatchType(), 'adgroup': keyword.getAdGroup().getId(), 'KwID': keyword.getId()})
      counter += 1;
    }
  }
}

function iterateData(){
  for (i in keywords){
    Logger.log(keywords[i]);
  }
}

function main() {
  createLabels();
  getEnabledKeywords();
  //getModBroadKWs();
  Logger.log(counter + " enabled keywords reviewed.");
  Logger.log(bCounter + " broad match.")
  Logger.log(pCounter + " phrase match.")
  Logger.log(eCounter + " exact match.")
  checkKeywords();
  applyLabelsToKws(duplicateKwIds, "Duplicate Keyword");
  applyLabelsToKws(reorderedBMIds, "Reordered Broad Match");
  applyLabelsToKws(duplicateBMMsIds, "Duplicate BMMs");
}




