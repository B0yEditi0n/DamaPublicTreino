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
    console.log('json;');
    var initGame = getQueryVariable('config')
    var strIni = decodeURI(initGame)
    
    //Inicializa o jogo de dama
    if(JSON.parse(strIni)){
        tab.initTabuleiro({ "playerTurn": 1,"bord": JSON.parse(strIni) });
    }else{
        tab.initTabuleiro();
    }
    
}
