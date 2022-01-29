 var curIndex =0;
    var row
    function myCreateFunction() {
    var maxRowLength = 4;
    
    var ProfilesTable = document.body.getElementsByClassName("ProfileTable")[0];
        
        if(curIndex == 0){
           row = ProfilesTable.insertRow();
           }
        if(curIndex < maxRowLength){
            
            var cell = row.insertCell();
               cell.innerHTML = "<a href='/deadend.html'><div class='row2'><div class='column2'><div class='card'><center><img src='/files/6_about/avatarBase.png' style='width:128px;height:128px;' class='avatar'></center><div class='box'><h2>BixTheGameDev</h2><p class='title'>Better Programmer</p></div></div></div></div></a>>";
            curIndex += 1;
            if(curIndex == maxRowLength){
               nextRow();
               }
           }
        
        
    }
    function nextRow(){
        curIndex = 0;
    }