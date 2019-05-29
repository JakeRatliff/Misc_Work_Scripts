<script>
  //console.log("this is a product page...");
  var first_h3 = document.getElementsByTagName("h3")[0];
  //console.log(document);
  var timer = 0;
  function runAfterElementExists(element, callback) {
    var checker = window.setInterval(function() {
      timer += 10; //millisecs
      //console.log("CHECKING " + timer);
      if (timer > 5000) { //stop checking after 5 secs
        console.log("took too long, exiting this process.");
        clearInterval(checker);
      }
      if (element != undefined) {
        console.log("found element, it took " + timer + " millisecs.");
        clearInterval(checker);
        callback();
      }
    }, 10);
  }
  
  function elementFound(){
    var first_h3 = document.getElementsByTagName("h3")[0];
  	console.log("Found element", first_h3);
    console.log("Adjusting element...");
    var newH2 = document.createElement("h2");
    //console.log("getting brand name...");
    var brandName = '{{collection.handle}}';
    //console.log(brandName);
    brandName = brandName.replace("-", " ");
    brandName = initialCapsTheBrandName(brandName);
    //console.log(brandName);
    newH2.innerText = "Enter Your " + brandName + " Spa Cover Dimensions";
    first_h3.parentNode.replaceChild(newH2, first_h3);

  }
  
  runAfterElementExists(first_h3, elementFound);
  
  function initialCapsTheBrandName(text){
  	wordList = text.split(" ");
    upperedList = [];
    for(i in wordList){
      word = wordList[i];
      upperedList.push(word.substr(0,1).toUpperCase() + word.substr(1));
    }
    upperedList = upperedList.join(" ");
    return upperedList
  }
  
</script>
