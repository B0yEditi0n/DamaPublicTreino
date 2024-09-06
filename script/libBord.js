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

    constructor(id, grupo, xy){
        this.id = id
        this.x  = xy.x
        this.y  = xy.y  
        switch (grupo) {
            case 1 :
            case "1":
            case -1 :
            case "-1":            
                this.grupo = Number(grupo)
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
    }

    returnElementHTML(){
        /*
            Retorna um Element HTML da peça
            Args:
                - Return: Element 
        */

        this.pecaHTML.id = `peca${this.id}`

        if(this.grupo > 0){
            this.pecaHTML.className = 'pecaBranca'
            if(this.king){
                this.pecaHTML.style.backgroundImage = 'url(img/king1.png)';
            }
        }else if(this.grupo < 0){
            this.pecaHTML.className = 'pecaPreta'
            if(this.king){
                this.pecaHTML.style.backgroundImage = 'url(img/king2.png)';
            }
        }

        var obj = this;
        new function(){
            $(obj.pecaHTML).on('click', function(){
                var xy = {x: obj.x, y: obj.y}
                // Checa se é valido para jogada
                var pseudoJogadas = tab.pecaValida(xy, obj.grupo)
                if(pseudoJogadas){
                    // Remove estilo de outros & Adiciona estilo
                    $('.marcaJogada').removeClass('marcaJogada')
                    $('.selected').removeClass('selected')
                    $(obj.pecaHTML).addClass('selected')
                    
                    // Pinta as Celulas jogaveis
                    for(let jogada of pseudoJogadas.position){
                        tab.tabuleiro[jogada.destino.y][jogada.destino.x]["espaco"].marcaComoJogavel()
                    }
                    
                };
            })
        }

        return this.pecaHTML
    }

    rangeDeCapura(){
        var listRange = []

        if(!this.king){ // Para peças comumns 
            listRange.push({
                y: this.y + 2,
                x: this.x + 2,
            })
            listRange.push({
                y: this.y + 2,
                x: this.x - 2,
            })
            listRange.push({
                y: this.y - 2,
                x: this.x + 2,
            })
            listRange.push({
                y: this.y - 2,
                x: this.x - 2,
            })
            return listRange
        }else{ // para tipo king
            

        }
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
        var xy = this.idToCord()
        this.x = xy.x
        this.y = xy.y
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
        // define posilção
        this.epacoHTML.appendChild( oPeca )
    }

    marcaComoJogavel(){
        $(this.epacoHTML).addClass('marcaJogada')
    }

    returnElementHTML(){
        /*
            Retorna um Element HTML do espaço
            Args:
                - Return: Element 
        */

        /* Cria um Elemento HTML com base no ID */

        this.epacoHTML.className = "tile";
        this.epacoHTML.id = `espaco${this.id}`
        $(this.epacoHTML).css("top", `${this.y * 10}vmin`)
        $(this.epacoHTML).css("left", `${this.x * 10}vmin`)

        return this.epacoHTML
    }
}

class Tabuleiro{
    tabuleiro = [];
    tabuleiroHTML = $("#board").get(0);
    jogadorVez = 0;

    initTabuleiro(bordLoad){
        /*
            Inicializa o tabuleiro e cria 
            a base HTML para jogadas
        */

        var bordConfig
        // Checa Layout Padrão
        if(bordLoad){
            bordConfig = bordLoad["bord"] 
        }else{
            bordConfig = gameBoard
        }


        var index = 0;
        var idxPeca = 0
        this.jogadorVez = 1; // Inicia pelas Brancas

        for(let y=0; y<8; y++){
            // Inicia o espaço vazio de y
            this.tabuleiro.push( [] );
            for(let x=0; x < 8; x++){

                // Inicia o espaço vazio de x
                this.tabuleiro[y].push( {espaco: Object, peca: undefined} );
                if((!(y % 2) == 0 && x % 2 == 0) || (y % 2 == 0 && !(x % 2 == 0))){
                    
                    var peca = bordConfig[y][x];

                    // Cria um Epaço no Tabuleiro
                    this.tabuleiro[y][x]["espaco"] = new Espaco(index)

                    // Anexa uma Peça (se houver)
                    if(peca != 0){
                        // id, grupo, html
                        var xy = { x: x, y: y }
                        var oPeca = new Peca(idxPeca, peca, xy)
                        this.tabuleiro[y][x]["peca"] = oPeca
                        this.tabuleiro[y][x]["espaco"].addPeca( oPeca.returnElementHTML() )                        

                        // Incrementa Index
                        idxPeca++
                    }

                    // Anexa HTML
                    this.tabuleiroHTML.appendChild(this.tabuleiro[y][x]["espaco"].returnElementHTML());
                    
                    // Incremento dos contadores
                    index++
                }
            }
        }
    }

    capturaValida(origem, destino){
        /*
            Checa se a captura efetuada é valida

            Args:
            - Return: Bool | Verdadeiro caso seja

        */

        // entre essas duas posiçoes há uma peca?
        var xCaptura = destino.x - Math.sign(destino.x - origem.x)
        var yCaptura = destino.y - Math.sign(destino.y - origem.y )

        // Está dentro dos limites do tabuleiro?
        if(xCaptura <= 7 && xCaptura >= 0
        && yCaptura <= 7 && yCaptura >= 0){

            if(this.tabuleiro[yCaptura][xCaptura]["peca"] != undefined){
                let currentP = this.tabuleiro[yCaptura][xCaptura]["peca"]
                // há uma peça
                if(currentP.grupo != this.jogadorVez){ // é Adversária?
                    // Alguma Peca bloqueia?

                    // Posterior
                    var pecaPost = this.tabuleiro[destino.y][destino.x]["peca"]
                    var pecaAnt = this.tabuleiro[yCaptura - Math.sign(origem.y)][xCaptura - Math.sign(origem.x)]["peca"]
                    if(pecaPost == undefined){
                        // Anterior 
                        if(pecaAnt == undefined
                        || ( yCaptura - Math.sign(origem.y) == origem.y && xCaptura - Math.sign(origem.x) == origem.x ) ){
                            return true        
                        }
                    }                    
                }
            }

        }
    }

    checaJogCaptura(){
        /*
            Checa todas as jogadas possiveis no tabuleiro

            Args:
            - Returns: Object | Retonas a jogadas validas
                {
                    origem: {x y}
                    destino: {x, y}
                }
        */

        var jogadasHabilitadas = []
        for(let y=0; y<this.tabuleiro.length; y++){
            for(let x=0; x<this.tabuleiro[y].length; x++){
                var peca = this.tabuleiro[y][x]["peca"]
                if(peca && peca.grupo == this.jogadorVez){
                    var List = peca.rangeDeCapura()                    
                    for(let dest of List){
                        var xyOrigem = {x: x, y: y}
                        if(this.capturaValida(xyOrigem, dest)){
                            jogadasHabilitadas.push({
                                "origem": xyOrigem,
                                "destino": dest
                            })
                        }
                    }
                }
            }
        }
        return jogadasHabilitadas
    }

    pecaValida(xy, grupo){
        /*
            Valida se peça Atual é valida para ser joagada
            
            Args:
            - Returns: bool | Verdadeiro se valida
        */

        if(grupo == this.jogadorVez){

            // Checar Se há alguma posição de captura
            var pecasJogaveis = this.checaJogCaptura()

            // A Pesa selecionada está na lista?
            var position = pecasJogaveis.filter(function(peca){
                return(
                    peca.origem.x == xy.x &&
                    peca.origem.y == xy.y
                )
            })
            console.log(position.length)
            if(position.length > 0){
                return {position};
            }
            
        }

        return false;
    }

    mover(origem, destino){
        

    }

}