// Histórico de Versões
var historicoBord = []

// Setup inicial de start das damas.
var gameBoard = [
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0]
]
//arrays to store the instances
var pieces = []; // Peças
var tiles = []; // Espaço Vazio

//distance formula
var dist = function (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}
//Piece object - there are 24 instances of them in a checkers game
function Piece(element, position) {
  // when jump exist, regular move is not allowed
  // since there is no jump at round 1, all pieces are allowed to move initially
  this.allowedtomove = true;
  //linked DOM element
  this.element = element;
  //positions on gameBoard array in format row, column
  this.position = position;
  //which player's piece i it
  this.player = '';
  //figure out player by piece id
  if (this.element.attr("id") >= 12)
    this.player = 1;
  else
    this.player = 2;
  //makes object a king
  this.king = false;
  this.makeKing = function () {
    this.element.css("backgroundImage", "url('img/king" + this.player + ".png')");
    this.king = true;
  }
  //moves the piece
  this.move = function (tile) {
    // Guarda histórico anterior
    Board.save_state()

    // Move
    this.element.removeClass('selected');
    if (!Board.isValidPlacetoMove(tile.position[0], tile.position[1])) return false;
    //remova a marca do Board.board e coloque-a no novo local
    Board.board[this.position[0]][this.position[1]] = 0;
    Board.board[tile.position[0]][tile.position[1]] = this.player;
    this.position = [tile.position[0], tile.position[1]];
    //change the css using board's dictionary
    this.element.css('top', Board.dictionary[this.position[0]]);
    this.element.css('left', Board.dictionary[this.position[1]]);
    //Se a peça chegar ao final da linha no lado oposto, coroe-a como um rei (pode se mover em todas as direções)
    if (!this.king && (this.position[0] == 0 || this.position[0] == 7))
      this.makeKing();
    return true;
  };

  //tests if piece can jump anywhere
  this.canJumpAny = function () {
    if(!this.king){
      return (this.canOpponentJump([this.position[0] + 2, this.position[1] + 2]) ||
      this.canOpponentJump([this.position[0] + 2, this.position[1] - 2]) ||
      this.canOpponentJump([this.position[0] - 2, this.position[1] + 2]) ||
      this.canOpponentJump([this.position[0] - 2, this.position[1] - 2]))
    }else{
      for(var i = 0; i<= 7; i++){
        // Aumenta e diminui isso deve ser uma constante
        
        if(this.canOpponentJump([this.position[0] + i, this.position[1] + i])){
          return this.canOpponentJump([this.position[0] + i, this.position[1] + i])
        }
        if(this.canOpponentJump([this.position[0] + i, this.position[1] - i])){
          return this.canOpponentJump([this.position[0] + i, this.position[1] - i])
        }
        if(this.canOpponentJump([this.position[0] - i, this.position[1] + i])){
          return this.canOpponentJump([this.position[0] - i, this.position[1] + i])
        }

        if(this.canOpponentJump([this.position[0] - i, this.position[1] - i])){
          return this.canOpponentJump([this.position[0] - i, this.position[1] - i])
        }
        
      }        
    }
    
  };

  //tests if an opponent jump can be made to a specific place
  this.canOpponentJump = function (newPosition) {
    //find what the displacement is
    var dx = newPosition[1] - this.position[1];
    var dy = newPosition[0] - this.position[0];
    
    // ceca se a peça normal não está dandando mais de 2 casas
    if(Math.abs(dx) > 2 && Math.abs(dy) > 2 && !this.king) return false;
    //must be in bounds
    if (newPosition[0] > 7 || newPosition[1] > 7 || newPosition[0] < 0 || newPosition[1] < 0) return false;
    //middle tile where the piece to be conquered sits
    var tileToCheckx = newPosition[1] - Math.sign(dx) /// 2; // x da peça a ser capturada
    var tileToChecky = newPosition[0] - Math.sign(dy) // / 2; // y da peça a ser capturada
    if (tileToCheckx > 7 || tileToChecky > 7 || tileToCheckx < 0 || tileToChecky < 0) return false;
    //if there is a piece there and there is no piece in the space after that
    if (!Board.isValidPlacetoMove(tileToChecky, tileToCheckx) && Board.isValidPlacetoMove(newPosition[0], newPosition[1])) {
      //find which object instance is sitting there
      for (let pieceIndex in pieces) {
        if (pieces[pieceIndex].position[0] == tileToChecky && pieces[pieceIndex].position[1] == tileToCheckx) {
          if (this.player != pieces[pieceIndex].player) {
            //return the piece sitting there
            return pieces[pieceIndex];
          }
        }
      }
    }
    return false;
  };

  this.opponentJump = function (tile) {
    var pieceToRemove = this.canOpponentJump(tile.position);
    //if there is a piece to be removed, remove it
    if (pieceToRemove) {
      pieceToRemove.remove();
      return true;
    }
    return false;
  };

  this.remove = function () {
    //remove it and delete it from the gameboard
    this.element.css("display", "none");
    if (this.player == 1) {
      $('#player2').append("<div class='capturedPiece'></div>");
      Board.score.player2 += 1;
    }
    if (this.player == 2) {
      $('#player1').append("<div class='capturedPiece'></div>");
      Board.score.player1 += 1;
    }
    Board.board[this.position[0]][this.position[1]] = 0;
    //reset position so it doesn't get picked up by the for loop in the canOpponentJump method
    this.position = [];
    var playerWon = Board.checkifAnybodyWon();
    if (playerWon) {
      $('#winner').html("Player " + playerWon + " has won!");
    }
  }
}

function Tile(element, position) {
  //linked DOM element
  this.element = element;
  //position in gameboard
  this.position = position;
  //se a peça está em alcence de caputra
  this.inRange = function (piece) {
    // Checa se no intervalo ah uma peça de caputra
    var isCapture = false
    // Posição final - inicial;
    var dy = (this.position[1]) - piece.position[1]
    var dx = (this.position[0]) - piece.position[0]
    
    var cDx = Math.sign(dx)
    var cDy = Math.sign(dy)
    for(let p of pieces ){
      if (p.position[0] == this.position[0] - cDx && p.position[1] == this.position[1] - cDy && p.player != piece.player) isCapture = true;
    }

    for (let k of pieces){
      
      if (k.position[0] == this.position[0] && k.position[1] == this.position[1]) return 'wrong'; // impede que uma a peça vá para um slot com outra peça

      voltarJogada// Checa se é pra captura de peça
      if (!piece.king && piece.player == 1 && this.position[0] > piece.position[0] && !isCapture) return 'wrong'; // checa se ele ta voltando a jogada com as pretas
      if (!piece.king && piece.player == 2 && this.position[0] < piece.position[0] && !isCapture) return 'wrong'; // checa se ele ta voltando a jogada com as brancas
      if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == Math.sqrt(2)) {
        //regular move
        return 'regular';
      } else if (dist(this.position[0], this.position[1], piece.position[0], piece.position[1]) == 2 * Math.sqrt(2)) {
        //jump move
        return 'jump';
      }
      // Dama
      if(!isCapture && piece.king){
        return 'regular';
      }else if(isCapture && piece.king){
        return 'jump';
      }
    }
    
  };
}

//Board object - controls logistics of game
var Board = {
  board: gameBoard,
  score: {
    player1: 0,
    player2: 0
  },
  playerTurn: 1,
  jumpexist: false,
  continuousjump: false,
  tilesElement: $('div.tiles'),
  //dictionary to convert position in Board.board to the viewport units
  dictionary: ["0vmin", "10vmin", "20vmin", "30vmin", "40vmin", "50vmin", "60vmin", "70vmin", "80vmin", "90vmin"],
  //initialize the 8x8 board
  initalize: function () {
    var countPieces = 0;
    var countTiles = 0;
    for (let row in this.board) { //row is the index
      for (let column in this.board[row]) { //column is the index
        //whole set of if statements control where the tiles and pieces should be placed on the board
        if (row % 2 == 1) {
          if (column % 2 == 0) {
            countTiles = this.tileRender(row, column, countTiles)
          }
        } else {
          if (column % 2 == 1) {
            countTiles = this.tileRender(row, column, countTiles)
          }
        }
        if (this.board[row][column] == 1) {
          countPieces = this.playerPiecesRender(1, row, column, countPieces)
        } else if (this.board[row][column] == 2) {
          countPieces = this.playerPiecesRender(2, row, column, countPieces)
        }
      }
    }
  },
  reinitalize: function(startSet){
    var countPiecesW = 11;
    var countPiecesB = 0;
    var countTiles = 0;
    // Inicia com base em um jogo já pré estábelecido
    for (let row in this.board) { //Linha 
      for (let column in this.board[row]) { //Coluna
        // Renderiza o Espaços de Peças
        if (row % 2 == 1) {
          if (column % 2 == 0) {
            countTiles = this.tileRender(row, column, countTiles)
          }
        } else {
          if (column % 2 == 1) {
            countTiles = this.tileRender(row, column, countTiles)
          }
        }

        // seta a Vez 
        Board.playerTurn = startSet["playerTurn"]
        
        // Restarta as Peças
        var boardStart = startSet["bord"]

        var piece = boardStart[row][column]
        if(piece == 1 || piece == 'W'){
          this.board[row][column] = 1
          if(piece == 'W'){
            countPiecesW = this.restartPiecesPlayer(1, row, column, countPiecesW, true)
          } else{
            countPiecesW = this.restartPiecesPlayer(1, row, column, countPiecesW, false)
          }            
          
        }
        if(piece == 2 || piece == 'B'){
          this.board[row][column] = 2
          if(piece == 'B'){
            countPiecesB = this.restartPiecesPlayer(2, row, column, countPiecesB, true)
          }else{
            countPiecesB = this.restartPiecesPlayer(2, row, column, countPiecesB, false)
          }            
        }
      }
    }

  },
  tileRender: function (row, column, countTiles) {
    this.tilesElement.append("<div class='tile' id='tile" + countTiles + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
    tiles[countTiles] = new Tile($("#tile" + countTiles), [parseInt(row), parseInt(column)]);
    return countTiles + 1
  },

  playerPiecesRender: function (playerNumber, row, column, countPieces) {
    $(`.player${playerNumber}pieces`).append("<div class='piece' id='" + countPieces + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
    pieces[countPieces] = new Piece($("#" + countPieces), [parseInt(row), parseInt(column)]);
    return countPieces + 1;
  },
  
  restartPiecesPlayer: function (playerNumber, row, column, countPieces, isKing){
    $(`.player${playerNumber}pieces`).append("<div class='piece' id='" + countPieces + "' style='top:" + this.dictionary[row] + ";left:" + this.dictionary[column] + ";'></div>");
    pieces[countPieces] = new Piece($("#" + countPieces), [parseInt(row), parseInt(column)]);
    return countPieces + 1;
  },

  //check if the location has an object
  isValidPlacetoMove: function (row, column) {
    //console.log(row); console.log(column); console.log(this.board);
    if (row < 0 || row > 7 || column < 0 || column > 7) return false;
    if (this.board[row][column] == 0) {
      return true;
    }
    return false;
  },
  //change the active player - also changes div.turn's CSS
  changePlayerTurn: function () {
    if (this.playerTurn == 1) {
      this.playerTurn = 2;
      $('.turn').css("background", "linear-gradient(to right, transparent 50%, #BEEE62 50%)");
    } else {
      this.playerTurn = 1;
      $('.turn').css("background", "linear-gradient(to right, #BEEE62 50%, transparent 50%)");
    }
    this.check_if_jump_exist()
    return;
  },
  checkifAnybodyWon: function () {
    if (this.score.player1 == 12) {
      return 1;
    } else if (this.score.player2 == 12) {
      return 2;
    }
    return false;
  },
  //reset the game
  clear: function () {
    location.reload();
  },
  check_if_jump_exist: function () {
    this.jumpexist = false
    this.continuousjump = false;
    for (let k of pieces) {
      k.allowedtomove = false;
      // if jump exist, only set those "jump" pieces "allowed to move"
      if (k.position.length != 0 && k.player == this.playerTurn && k.canJumpAny()) {
        this.jumpexist = true
        k.allowedtomove = true;
      }
    }
    // if jump doesn't exist, all pieces are allowed to move
    if (!this.jumpexist) {
      for (let k of pieces) k.allowedtomove = true;
    }
  },
  // Possibly helpful for communication with back-end.
  str_board: function () {
    ret = ""
    for (let i in this.board) {
      for (let j in this.board[i]) {
        var found = false
        for (let k of pieces) {
          if (k.position[0] == i && k.position[1] == j) {
            if (k.king) ret += (this.board[i][j] + 2)
            else ret += this.board[i][j]
            found = true
            break
          }
        }
        if (!found) ret += '0'
      }
    }
    return ret
  },
  // Salva Estado da borda
  save_state: function(){
    var save = {}
    var currentBord = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ]
    for(var i = 0; i < pieces.length; i++){
      p = pieces[i]
      // Checa qual a cor da peça e se ela está no tabuleiro
      if(p.player == 1 && p.position.length == 2){
        
        // checa se é Branca Dama (White Lady)
        if(p.king){
          currentBord[p.position[0]][p.position[1]] = 'W'
        }else{
          currentBord[p.position[0]][p.position[1]] = '1'
        }

      }
      if(p.player == 2 && p.position.length == 2){
        // Checa se é Rei Preto (King Black)
        if(p.king){
          currentBord[p.position[0]][p.position[1]] = 'B'
        }else{
          currentBord[p.position[0]][p.position[1]] = '2'
        }
      }
    }
    
    save["bord"] = currentBord
    save["playerTurn"] = this.playerTurn

    historicoBord.push(save)

  }
}

//initialize the board
Board.initalize();

/***
Events
***/

//select the piece on click if it is the player's turn
$('.piece').on("click", function () {
  var selected;
  var isPlayersTurn = ($(this).parent().attr("class").split(' ')[0] == "player" + Board.playerTurn + "pieces");
  if (isPlayersTurn) {
    if (!Board.continuousjump && pieces[$(this).attr("id")].allowedtomove) {
      if ($(this).hasClass('selected')) selected = true;
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
  }else{
    mensagem('Não é a vez dessas pessas.')
    
  }
  
});

//reset game when clear button is pressed
$('#cleargame').on("click", function () {
  Board.clear();
});

//mover peça quando o espaço é clicado
$('.tile').on("click", function () {
  //make sure a piece is selected
  if ($('.selected').length != 0) {
    //find the tile object being clicked
    var tileID = $(this).attr("id").replace(/tile/, '');
    var tile = tiles[tileID];
    //find the piece being selected
    var piece = pieces[$('.selected').attr("id")];
    //check if the tile is in range from the object
    var inRange = tile.inRange(piece);
    if (inRange != 'wrong') {
      //if the move needed is jump, then move it but also check if another move can be made (double and triple jumps)
      if (inRange == 'jump') {
        if (piece.opponentJump(tile)) {
          piece.move(tile);
          if (piece.canJumpAny()) {
            // Board.changePlayerTurn(); //change back to original since another turn can be made
            piece.element.addClass('selected');
            // exist continuous jump, you are not allowed to de-select this piece or select other pieces
            Board.continuousjump = true;
          } else {
            Board.changePlayerTurn()
          }
        }
        //if it's regular then move it if no jumping is available
      } else if (inRange == 'regular' && !Board.jumpexist) {
        if (!piece.canJumpAny()) {
          piece.move(tile);
          Board.changePlayerTurn()
        } else {
          alert("You must jump when possible!");
        }
      }
    }
  }
});
