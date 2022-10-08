function init() {
    document.querySelector('#buttonCreate').onclick = createLobby;
    document.querySelector('#buttonConnect').onclick = joinLobby;
}
const createLobby = async () => {
    window.location.href = '/app';
}
const joinLobby = () => {
// take id sent to local storage 
if(document.querySelector("#idText").value != '' || document.querySelector("#idText").value.length != 4){
    localStorage.setItem('id',document.querySelector("#idText").value);
    window.location.href = '/app';
}
//load to the game page 
// get from local storage id and load board
}
window.onload = init;