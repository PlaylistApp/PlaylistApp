document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("playlistApp JS imported successfully!");
  },
  false
);
var videoUrlnotReady = document.querySelector('#ytplayer').getAttribute("data-videoUrl")
  var videoUrl = videoUrlnotReady.slice(videoUrlnotReady.indexOf('embed/')+6)


var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/player_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  var player;
  function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytplayer', {
      
      videoId: videoUrl
    });
  }

document.querySelector('#addNote').addEventListener('click', function () {
  const notesDiv = document.querySelector('#notes')
  const newNote = document.createElement('form')
  const currentVideoTimeSec = player.playerInfo.currentTime
  let currentTimeHours = Math.floor(currentVideoTimeSec / 60 / 60)
  let currentTimeMins = Math.floor((currentVideoTimeSec%3600)/60)
  let currentTimeSecs = Math.floor(currentVideoTimeSec%3600)%60
  let noteCreator = document.querySelector('#ytplayer').getAttribute("data-username")
  let userID = document.querySelector('#ytplayer').getAttribute("data-userID")
  let videoID = document.querySelector('#ytplayer').getAttribute("data-videoID")
  let toDateLarge = new Date();
  let toDate = toDateLarge.toLocaleDateString();

  if(currentTimeMins<10){currentTimeMins = `0${currentTimeMins}`}
  if(currentTimeSecs<10){currentTimeSecs = `0${currentTimeSecs}`}

  newNote.setAttribute("action","/addNote")
  newNote.setAttribute('method',"POST")
  newNote.setAttribute('class',"formNote")
  newNote.innerHTML += `
        <div class="noteCard"> 
          <div class="noteHeader">
              <p class="timestamp">${currentTimeHours}:${currentTimeMins}:${currentTimeSecs}</p>
              <div class="noteCredits">
                  <p>${toDate} | by ${noteCreator}</p>
              </div>

          </div>
          <textarea id="textAreaNote" class="noteInputField" type="text" name="Note" rows="6" cols="43"></textarea>
      </div>
		<span id="safeNote" class="noteFormBtn primaryButton">Safe Note</span>`;

    if(notesDiv.innerHTML === ''){
      notesDiv.appendChild(newNote)
    }else {
      notesDiv.prepend(newNote,document.querySelectorAll('.noteCard')[0])
    }
    

  newNote.querySelector('#safeNote').addEventListener('click', function () {
    let note = document.querySelector('#textAreaNote').value
    fetch(`/notes/${userID}/${videoID}`,{headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
      method: "POST",
      body:JSON.stringify( {
        time: `${currentTimeHours}:${currentTimeMins}:${currentTimeSecs}`,
        note: note,
      date: toDate})
  })
		.then(response => response.json())
		.then(data => {
      document.querySelector('#notes').innerHTML=''
      for (let i = 0; i < data[0].notes.length; i++) {
        const newNoteDB = document.createElement('div')
        newNoteDB.setAttribute('class','noteCard')
        newNoteDB.innerHTML= `
        <div class="noteHeader">
          <p class="timestamp">${data[0].notes[i].time}</p>
          <div class="noteCredits">
              <p>${data[0].notes[i].date} |</p>
          </div>

      </div>
                
      <p class="noteText">${data[0].notes[i].note}</p>`
      notesDiv.appendChild(newNoteDB)

      }

			console.log(data)
		})
  })
  
});

function addListenerToTimeStamp(){
  let timeStamps = document.querySelectorAll('.timestamp')
  for (let i = 0; i < timeStamps.length; i++) {
    timeStamps[i].addEventListener('click',() =>{
      let time = timeStamps[i].innerText
      let arrTime = time.split(":")
      let realTime = (+arrTime[0]*3600)+(+arrTime[1]*60)+arrTime[2]
      player.seekTo(realTime)

    })
    
  }
}

addListenerToTimeStamp()

