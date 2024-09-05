gameBoard = [
    [ 0, -1,  0, -1,  0, -1,  0, -1], 
    [-1,  0, -1,  0, -1,  0, -1,  0], 
    [ 0, -1,  0, -1,  0, -1,  0, -1], 
    [ 0,  0,  0,  0,  0,  0,  0,  0], 
    [ 0,  0,  0,  0,  0,  0,  0,  0], 
    [ 1,  0,  1,  0,  1,  0,  1,  0], 
    [ 0,  1,  0,  1,  0,  1,  0,  1], 
    [ 1,  0,  1,  0,  1,  0,  1,  0]  
]
class Peca{
    id = -1;
    x = -1
    y = -1
    king = false
    grupo = 0 // -1 Pretas, 1 Brancas

    pecaHTML = document.createElement('div')

    constructor(id, grupo){
        this.id       = id
        switch (grupo) {
            case 1:
            case -1:            
                this.grupo = grupo
                break;
            case 'W':
                this.grupo = 1
                this.king = true;
                break;
            case 'B':
                this.grupo = -1
                this.king = true;
                break
        }

        var obj = this;
        new function(){
            
            $(obj.pecaHTML).on('click', function(){
                //console.log(obj)    

                // Cria um enveto unico para o click
                /*var selected;
                var isPlayersTurn = ($(this).parent().attr("class").split(' ')[0] == "player" + Board.playerTurn + "pieces");
                if (isPlayersTurn) {
                    if (!Board.continuousjump && pieces[$(this).attr("id")].allowedtomove) {
                    if ($(this).hasClass('selected')){ selected = true };
                    $('.piece').each(function (index) {
                        $('.piece').eq(index).removeClass('selected')
                    });
                    if (!selected) {
                        $(this).addClass('selected');
                    }
                    } else {
                    let exist = "Essa peça não tem permissão para se mover"
                    let continuous = "você tem que pular a mesma peça"
                    let message = !Board.continuousjump ? exist : continuous
                    mensagem(message)
                    }
                } else {
                    mensagem('Não é a vez dessas pessas.')

                }*/
            })
        }
    }

    returnElementHTML(){
        this.pecaHTML.id = `peca${this.id}`

        if(this.grupo > 0){
            this.pecaHTML.className = 'pecaBranca'
            if(this.king){
                $(this.pecaHTML).css('backgroundbackground-image', 'url(img/king1.png)')
            }
        }else if(this.grupo < 0){
            this.pecaHTML.className = 'pecaPreta'
            if(this.king){
                $(this.pecaHTML).css('backgroundbackground-image', 'url(img/king2.png)')
            }
        }        

        return this.pecaHTML
    }
}

class Espaco{
    id = -1;
    peca = Object()
    epacoHTML = document.createElement('div')
    x = -1;
    y = -1;

    constructor(id){
        this.id = id
    }

    idToCord(){
        // descobre o ID apartir de uma cordenada
        var y = Math.floor(this.id / 4);        
        if(y % 2 == 0){ // Par
            var x = 1 + ((this.id % 4) * 2)
        }else{ // impar
            var x =(this.id % 4) * 2
        }

        return{
            x: x,
            y: y
        }
    }

    addPeca(oPeca){
        this.peca = oPeca
        this.epacoHTML.appendChild( this.peca.returnElementHTML() )
    }

    returnElementHTML(){
        /* Cria um Elemento HTML com base no ID */

        var xy = this.idToCord()

        this.epacoHTML.className = "tile";
        this.epacoHTML.id = `espaco${this.id}`
        $(this.epacoHTML).css("top", `${xy.y * 10}vmin`)
        $(this.epacoHTML).css("left", `${xy.x * 10}vmin`)

        return this.epacoHTML
    }
}

class Tabuleiro{
    tabuleiro = [];
    tabuleiroHTML = $("#board").get(0);

    initTabuleiro(bordLoad){
        // Checa Layout Padrão
        if(!bordLoad){
            bordLoad["bord"] = gameBoard
        }


        var index = 0;
        var idxPeca = 0

        for(let y=0; y<8; y++){
            // Inicia o espaço vazio de y
            this.tabuleiro.push( [] );
            for(let x=0; x < 8; x++){

                // Inicia o espaço vazio de x
                this.tabuleiro[y].push( 0 );
                if((!(y % 2) == 0 && x % 2 == 0) || (y % 2 == 0 && !(x % 2 == 0))){
                    
                    var peca = bordLoad["bord"][y][x];

                    // Cria um Epaço no Tabuleiro
                    this.tabuleiro[y][x] = new Espaco(index)

                    // Anexa uma Peça (se houver)
                    if(peca != 0){
                        // id, grupo, html
                        this.tabuleiro[y][x].addPeca( new Peca(idxPeca, peca) )

                        

                        // Incrementa Index
                        idxPeca++
                    }

                    // Anexa HTML
                    this.tabuleiroHTML.appendChild(this.tabuleiro[y][x].returnElementHTML());
                    
                    // Incremento dos contadores
                    index++
                }
            }
        }
    }

}