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
        new function(){
            
            $(obj.pecaHTML).on('click', function(){
                
            })
        }
    }

    returnElementHTML(){
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
        oPeca.x = this.x
        oPeca.y = this.y
        this.epacoHTML.appendChild( oPeca )
    }

    returnElementHTML(){
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
        // Checa Layout Padrão
        if(!bordLoad){
            bordLoad["bord"] = gameBoard
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
                    
                    var peca = bordLoad["bord"][y][x];

                    // Cria um Epaço no Tabuleiro
                    this.tabuleiro[y][x]["espaco"] = new Espaco(index)

                    // Anexa uma Peça (se houver)
                    if(peca != 0){
                        // id, grupo, html
                        var oPeca = new Peca(idxPeca, peca)
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

    mover(origem, destino){
        // Checar Se há alguma posição de jogada

    }

}