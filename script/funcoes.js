
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