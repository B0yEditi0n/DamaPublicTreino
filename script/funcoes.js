
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
    len = historicoBord.length;
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

var controleJogadas = new ControleJogadas()

$('#voltarJogada').on("click", function(){
    controleJogadas.voltarJogada()
})

$('#avancarJogada').on("click", function(){
    controleJogadas.AvancarJogada()
})