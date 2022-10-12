function init() {
    document.querySelector('#buttonCreate').onclick = createLobby;
    document.querySelector('#buttonConnect').onclick = joinLobby;
}
//got to the game and create the lobby
const createLobby = async () => {
    window.location.href = '/app';
}
const joinLobby = () => {
    // take id sent to local storage then tries to connect using that id
    if (document.querySelector("#idText").value != '') {
        localStorage.setItem('id', document.querySelector("#idText").value);
        window.location.href = '/app';
    }
}
window.onload = init;