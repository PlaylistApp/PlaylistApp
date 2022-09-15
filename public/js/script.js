document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("playlistApp JS imported successfully!");
  },
  false
);
var videoUrlnotReady = document.querySelector('#ytplayer').getAttribute("data-videoUrl")
  var videoUrl = videoUrl.slice(videoUrl.indexOf('embed/')+6)


var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  var player;
  function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytplayer', {
      // height: '360',
      // width: '640',
      videoId: videoUrl
    });
  }
// 2. get player.playerInfo.currentTime
// window.onclick = () => {
//   console.log(player);
//   alert(player.playerInfo.currentTime);
// }



// console.log(videoUrl.slice(videoUrl.indexOf('embed/')+6));
document.querySelector('#addNote').addEventListener('click', function () {
  const notesDiv = document.querySelector('#notes')
  const newNote = document.createElement('form')
  newNote.setAttribute("action","/playlists/add-video/")
  newNote.setAttribute('method',"POST")
  newNote.setAttribute('class',"formNote")
  newNote.innerHTML = `
  <label for="">Timestamp: </label>
		<input type="text" name="timestamp">

		<label for="">Note: </label>
		<textarea type="text" name="Note" rows="4" ></textarea>

		<button type="sumbmit">Add this Note</button>`;

  notesDiv.appendChild(newNote)
});

