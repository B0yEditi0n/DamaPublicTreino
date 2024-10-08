var tab = new Tabuleiro()


function mensagem(txtMsg){
    /*
        Retorna a mensagem para android ou desktop dependendo do dispositivo 
    */
    const isMobile = navigator.userAgentData.mobile; 
    if(isMobile){
        msg.setText(Html.fromHtml(`<u>${txtMsg}</u>`))
    }else{
        window.alert(txtMsg)
    };
}
class ControleJogadas {
    //len = historicoBord.length;
    indexHistorico = historicoBord.length;

    checaIndex(){
        if(len != historicoBord.length){
            len = historicoBord.length
            indexHistorico = historicoBord.length
        }
    }

    voltarJogada(){
        checaIndex()
        if(this.indexHistorico > 0){
            this.indexHistorico--
        }
        Board.reinitalize(historicoBord[this.indexHistorico])    
    }

    AvancarJogada(){
        checaIndex
        if(this.indexHistorico < historicoBord.length - 2){
            this.indexHistorico++
        }
        Board.reinitalize(historicoBord[this.indexHistorico])    
    }
}

function checkSizeDevice(){
    // para tornar tudo mais responsivo
    //console.log($(window).width())
    
    //; remontar os epaços dos tabuleiros
    var listTitles = $("#board .tile");
    for (let i=0; i < listTitles.length; i++){
        var title = listTitles[i]
        try{
           var intId = title.id.replace(/[^0-9\.]+/g, "");
        }catch(e){
            debugger;
        }

        //? id para cordenadas
        var y = Math.floor(intId / 4);        
        if(y % 2 == 0){ // Par
            var x = 1 + ((intId % 4) * 2)
        }else{ // impar
            var x =(intId % 4) * 2
        }
        
        if($(window).width() <= 1200){
            //? Remonta os espaços
            $(title).css("top", `${y * 12}vmin`)
            $(title).css("left", `${x * 12}vmin`)
        }else{
            //? Remonta os espaços
            $(title).css("top", `${y * 10}vmin`)
            $(title).css("left", `${x * 10}vmin`)
        }

    }
}

$(window).on("resize", checkSizeDevice)

//var controleJogadas = new ControleJogadas()

$('#voltarJogada').on("click", function(){
    //controleJogadas.voltarJogada()
})

$('#avancarJogada').on("click", function(){
    //controleJogadas.AvancarJogada()
})

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
}

window.onload = function() {
    var initGame = getQueryVariable('config')
    if(initGame != undefined){
        var strIni = decodeURI(initGame)
        var playerTurn = getQueryVariable("jogador")
        
        //Inicializa o jogo de dama
        if(JSON.parse(strIni)){
            tab.initTabuleiro({ "playerTurn": playerTurn,"bord": JSON.parse(strIni) });
        }
    }
    else{
        tab.initTabuleiro();
    }
    checkSizeDevice()
}
