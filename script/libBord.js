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
        var obj = this;
        $(obj.pecaHTML).on('click', function(){
            var xy = {x: obj.x, y: obj.y}
            // Checa se é valido para jogada
            var pseudoJogadas = tab.pecaValida(xy, obj.grupo)
            if(pseudoJogadas){ 
                if(pseudoJogadas.length > 0){
                    // Alguém é obrigaod a comer

                    // Remove estilo de outros & Adiciona estilo
                    $('.marcaJogada').removeClass('marcaJogada')
                    $('.selected').removeClass('selected')
                    $(obj.pecaHTML).addClass('selected')
                    
                    // Pinta as Celulas jogaveis
                    for(let jogada of pseudoJogadas){
                        tab.tabuleiro[jogada.y][jogada.x]["espaco"].marcaComoJogavel()
                    }

                    // Guarda Peça selecionada
                    tab.pecaSel = obj;
                }
            }
            
        })
    }

    setAsKing(){
        this.king = true;
        if(this.grupo > 0){ this.pecaHTML.style.backgroundImage = 'url(img/king1.png)' }
        if(this.grupo < 0){ this.pecaHTML.style.backgroundImage = 'url(img/king2.png)' }
    }

    returnElementHTML(){
        /*
            Retorna um Element HTML da peça
            Args:
                - Return: Element 
        */

        this.pecaHTML.id = `peca${this.id}`

        if(this.grupo > 0){
            this.pecaHTML.className = 'peca pecaBranca'
            if(this.king){
                this.pecaHTML.style.backgroundImage = 'url(img/king1.png)';
            }
        }else if(this.grupo < 0){
            this.pecaHTML.className = 'peca pecaPreta'
            if(this.king){
                this.pecaHTML.style.backgroundImage = 'url(img/king2.png)';
            }
        }


        // }

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
        }else{ // para tipo king
            for(let add=2; add<=7; add++){
                if(this.x + add <= 7
                && this.y + add <= 7){
                    listRange.push({
                        y: this.y + add,
                        x: this.x + add,
                    })
                }
                
                if(this.x - add >= 0
                && this.y - add >= 0){
                    listRange.push({
                        x: this.x - add,
                        y: this.y - add,                        
                    })
                }

                if(this.x + add <= 7
                && this.y - add >= 0){
                    listRange.push({
                        x: this.x + add,
                        y: this.y - add,
                    })
                }

                if(this.x - add >= 0
                && this.y + add <= 7){
                    listRange.push({
                        x: this.x - add,
                        y: this.y + add,                        
                    })
                }
            }

        }

        return listRange
    }

}

class Espaco{
    id = -1;
    peca = Object()
    epacoHTML = document.createElement('div')
    x = -1;
    y = -1;

    //? em casos de recaputra a peça precisa ser travada
    lockPeca = Object();

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
    delPeca(){
        $(this.epacoHTML).children('.peca').remove();
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

        // Define um Evento
        $(this.epacoHTML).on("click", ()=>{
            var temPeca = $(this.epacoHTML).find('.peca')
            if(temPeca.length == 0){ // Espaço não deve ter pecas
                if(tab.pecaSel){ // alguma peça deve estar selecionada
                    tab.mover({x: this.x, y: this.y})
                }
            }
        })

        return this.epacoHTML
    }
}

class Tabuleiro{
    tabuleiro = [];
    tabuleiroHTML = $("#board").get(0);
    jogadorVez = 0;

    pecaSel = undefined;

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
        var yCaptura = destino.y - Math.sign(destino.y - origem.y)

        // Está dentro dos limites do tabuleiro?
        if(destino.x <= 7 && destino.x >= 0
        && destino.y <= 7 && destino.y >= 0){

            if(this.tabuleiro[yCaptura][xCaptura]["peca"] != undefined){
                let currentP = this.tabuleiro[yCaptura][xCaptura]["peca"]
                // há uma peça
                if(currentP.grupo != this.jogadorVez){ // é Adversária?
                    // Alguma Peca bloqueia
                    // Posterior
                    var pecaPost = this.tabuleiro[destino.y][destino.x]["peca"]
                    var pecaAnt = this.tabuleiro[yCaptura - Math.sign(destino.y - origem.y)][xCaptura - Math.sign(destino.x - origem.x)]["peca"]
                    if(pecaPost == undefined){
                        // Tem uma peça Anterior? & se sim ela é a de origem?
                        if(pecaAnt == undefined || ( pecaAnt.x  == origem.x && pecaAnt.y == origem.y)){
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

    movePosicaoValid(origem, dest, grupo){
        /*
            Checa Se a Movimentação é valida
            
            Args:
                - Param:
                    objeto origem {x,y} | com a origem dos dados
                    objeto dest {x, y}  | List com destinos das movimentações
                    int grupo           | -1 Pretas` 1 Brancas
        */
        
        if(dest.x >= 0 && dest.x <= 7
        && dest.y >= 0 && dest.y <= 7){
            if(this.tabuleiro[dest.y][dest.x]["peca"] == undefined){ // checa se há peças no destino
                if(Math.abs(dest.x - origem.x) == 1
                && origem.y - dest.y == grupo){ // Checa se apenas 1 casa de difrenca
                    //ValidListdest.push(dest)
                    return true
                }
                
            }
        }

    }

    pecaValida(xy, grupo){
        /*
            Valida se peça Atual é valida para ser joagada
            
            Args:
                possiceis movimentações previstas no tabuleiro ou apenas falço
                - Returns: bool, objeto {x, y} 
                         
        */

        if(grupo == this.jogadorVez){

            // Checar Se há alguma posição de captura
            var pecasJogaveis = this.checaJogCaptura()
            if(pecasJogaveis.length > 0){ // Existe a Posição
                
                var position = []
                // A Pesa selecionada está na lista?
                for(let peca of pecasJogaveis){
                    if(peca.origem.x == xy.x &&
                    peca.origem.y == xy.y){
                        position.push(peca.destino)
                    }                    
                }
                if(position.length > 0){return position}
            }else{ // Não Existe portanto pode efetuar uma jogada normal
                var validMove = []            

                if(this.movePosicaoValid(xy, {x: xy.x + 1, y: xy.y - grupo}, grupo)){
                    validMove.push({x: xy.x + 1, y: xy.y - grupo})
                }
                if(this.movePosicaoValid(xy, {x: xy.x - 1, y: xy.y - grupo}, grupo)){
                    validMove.push({x: xy.x - 1, y: xy.y - grupo})
                }

                if(validMove.length > 0){return validMove}                   
            }
        }

        return false
    }

    capturePeca(posicao){
        /*
            Deleta peça do tabuleiro
            
            Args:
                - Param: 
                    objeto destino | posições a mover {x, y}
        */
        this.tabuleiro[posicao.y][posicao.x]["peca"].pecaHTML.remove()
        this.tabuleiro[posicao.y][posicao.x]["peca"] = undefined
    }

    mover(destino){
        /*
            Move a peças para o destino selecionada
            se validado.
            Args:
                - Param: 
                    objeto destino | posições a mover {x, y}
        */

        var moveValids = false;

        // Travar em caso de captura 
        var Caputravel = this.checaJogCaptura();
        if(Caputravel.length > 0){
            // Checa se a peça seleciona que está fazendo a captura
            var oCaptura = Caputravel.find((c) => c.destino.x == destino.x && c.destino.y == destino.y)
            // Checa se o destino selecionado é o da caputra 
            var dCaptura = Caputravel.find((c) => c.destino.x == destino.x && c.destino.y == destino.y)            
            // é uma captura
            if(oCaptura && dCaptura){
                moveValids = true
                //Some com a peça capturada
                this.capturePeca({
                    x: destino.x - Math.sign(destino.x - this.pecaSel.x), 
                    y: destino.y - Math.sign(destino.y - this.pecaSel.y), 
                })

            }
        }else if(this.movePosicaoValid({x: this.pecaSel.x, y: this.pecaSel.y }, destino, this.pecaSel.grupo)){
            moveValids = true
        }

        if(moveValids){
            // Movimenta a Peça
            var pecaJogada = this.tabuleiro[this.pecaSel.y][this.pecaSel.x]["peca"]

            this.tabuleiro[destino.y][destino.x]["peca"] = pecaJogada
            this.tabuleiro[destino.y][destino.x]["espaco"].addPeca(pecaJogada.returnElementHTML())

            this.tabuleiro[this.pecaSel.y][this.pecaSel.x]["peca"] = undefined
            this.tabuleiro[this.pecaSel.y][this.pecaSel.x]["espaco"].delPeca()       

            // Atualiza o Destino
            pecaJogada.x = destino.x
            pecaJogada.y = destino.y        

            // Remover Adição visual
            $('.marcaJogada').removeClass("marcaJogada")
            
            // Checa se a peça se tornou dama, 
            //; caso se torne dama ela não pode sair capturando
            if((pecaJogada.y == 0 && pecaJogada.grupo > 0)
            || (pecaJogada.y == 7 && pecaJogada.grupo < 0)){ 
                pecaJogada.setAsKing() 
                this.jogadorVez *= -1
            }else{
                // Checa se Ainda ah posições de captura
                var novaCaputra = this.checaJogCaptura();
                var reCaputra = novaCaputra.filter((p) => p.origem.x == pecaJogada.x && p.origem.y == pecaJogada.y)
                if(Caputravel.length > 0 && reCaputra.length > 0){
                    // mantém como selecionada
                    $(pecaJogada.pecaHTML).addClass('selected')
                        
                    // Pinta as Celulas jogaveis
                    for(let jogada of reCaputra){
                        this.tabuleiro[jogada.destino.y][jogada.destino.x]["espaco"].marcaComoJogavel()
                    }

                    // Guarda Peça selecionada
                    this.pecaSel = pecaJogada
                    this.lockPeca = pecaJogada
                }
                else{
                    // inverte o jogador
                    this.jogadorVez *= -1
                    // Remove travamentos
                    this.lockPeca = Object()
                }

            }

            
        }
    }

}