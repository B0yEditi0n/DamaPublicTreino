
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

function redimensionarRegua(){
    var position = $('#board').get(0).getBoundingClientRect()
    $(".regua_vertical").css("left", (position.left - 35))
    $(".regua_horizontal").css("top", (position.top + (position.height) + 5))
    
}
if(navigator.userAgentData.mobile){
    window.addEventListener('resize', function(){
        redimensionarRegua()
    })
}