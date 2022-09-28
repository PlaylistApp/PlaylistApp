document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("playlistApp JS imported successfully!");
  },
  false
);

if (document.querySelector('#ytplayer')!==null) {
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
  let userID = document.querySelector('#ytplayer').getAttribute("data-userID")
  let videoID = document.querySelector('#ytplayer').getAttribute("data-videoID")
  let creatorID = document.querySelector('#ytplayer').getAttribute("data-creatorID")

  document.querySelector('#allNotes').addEventListener('click', function () {
    document.querySelector('#allNotes').className = ''
    document.querySelector('#allNotes').classList.add('primaryButton')
    document.querySelector('#allNotes').classList.add('allNotes')
    if (document.querySelector('#creatorsNotes') !== null) {
      document.querySelector('#creatorsNotes').className = ''
      document.querySelector('#creatorsNotes').classList.add('creatorsNotes')
      document.querySelector('#creatorsNotes').classList.add('secondaryButton')
      
      document.querySelector('#myNotes').className = ''
      document.querySelector('#myNotes').classList.add('myNotes')
      document.querySelector('#myNotes').classList.add('secondaryButton')
    }
  
    getAllNotes()
  })
  
  getAllNotes=()=> {
    if(userID){
    fetch(`/notes/${creatorID}/${videoID}`,{
    headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
    },
    method: "GET",

    }).then(response => response.json())
    .then(creatorData => {
      fetch(`/notes/${userID}/${videoID}`,{
        headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
        },
        method: "GET",
      
        }).then(response => response.json())
        .then(userData => {
          let data, dataCreator
          let dataNotSorted = []
          if (creatorData.length!==0) {
            dataCreator = [...creatorData[0].notes.sort((a,b)=>{
              return a.time.localeCompare(b.time)
            })]
          }
          if(userData.length===0){
            dataNotSorted = dataCreator
          }else {
             dataNotSorted = [...userData[0].notes,...creatorData[0].notes] // PENDING
          }

            data = dataNotSorted.sort((a,b)=>{
              return a.time.localeCompare(b.time)
            })

          console.log('getAllNotes UserID',data);
          renderNotes(data)
        })
    })
  }else{
    fetch(`/notes/${creatorID}/${videoID}`,{
      headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
      },
      method: "GET",
    
      }).then(response => response.json())
      .then(creatorData => {
        const data = [...creatorData[0].notes.sort((a,b)=>{
          return a.time.localeCompare(b.time)
        })]
        console.log('getAllNotes No UserID',data);
        renderNotes(data)
      })
  }
}

getUserNotes = () => {
  fetch(`/notes/${userID}/${videoID}`,{
    headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
    },
    method: "GET",
  
    }).then(response => response.json())
    .then(userData => {
      let data
      if(userData.length===0){
        data = []
      } else {
        data = [...userData[0].notes.sort((a,b)=>{
          return a.time.localeCompare(b.time)
        })] 
      }
      console.log('getUserNotes', data);
      renderNotes(data)
    })
}

getCreatorNotes = () => {
  fetch(`/notes/${creatorID}/${videoID}`,{
    headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
    },
    method: "GET",
  
    }).then(response => response.json())
    .then(creatorData => {
      const data = [...creatorData[0].notes.sort((a,b)=>{
        return a.time.localeCompare(b.time)
      })] 
      
      console.log('getCreatorNotes',data);
      renderNotes(data)
    })
}


const renderNotes =(data)=>{
  const notesDiv = document.querySelector('#notes')
  notesDiv.innerHTML=''
  for (let i = 0; i < data.length; i++) {
    const newNoteDB = document.createElement('div')
    newNoteDB.setAttribute('class','noteCard')
    newNoteDB.innerHTML= `
    <div class="noteHeader">
      <p class="timestamp">${data[i].time}</p>
      <div class="noteCredits">
          <p>${data[i].date} | by ${data[i].user}</p>
      </div>

  </div>        
  <p class="noteText">${data[i].note}</p>`
  notesDiv.appendChild(newNoteDB)

  }
  addListenerToTimeStamp()
}

getAllNotes()
}

if(document.querySelector('#addNote')!==null){
    document.querySelector('#addNote').addEventListener('click', function () {
    const notesDiv = document.querySelector('#notes')
    const newNote = document.createElement('form')
    const currentVideoTimeSec = player.playerInfo.currentTime
    let currentTimeHours = Math.floor(currentVideoTimeSec / 60 / 60)
    let currentTimeMins = Math.floor((currentVideoTimeSec%3600)/60)
    let currentTimeSecs = Math.floor(currentVideoTimeSec%3600)%60
    let noteCreator = document.querySelector('#ytplayer').getAttribute("data-username")

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
        <div class='noteCardBtns'>
          <span id="discardNote" class="noteFormBtn secondaryButton">Discard Note</span>
          <span id="safeNote" class="noteFormBtn primaryButton">Save Note</span>
        </div>`;
      

      if(notesDiv.innerHTML === ''){
        notesDiv.appendChild(newNote)
      }else {
        notesDiv.prepend(newNote,document.querySelectorAll('.noteCard')[0])
      }
    
    newNote.querySelector('#discardNote').addEventListener('click', function () {
      const noteForm = notesDiv.querySelector('.formNote')
      noteForm.remove()
      
    })

    newNote.querySelector('#safeNote').addEventListener('click', function () {
      let note = document.querySelector('#textAreaNote').value
      let userID = document.querySelector('#ytplayer').getAttribute("data-userID")
      let videoID = document.querySelector('#ytplayer').getAttribute("data-videoID")
      let noteCreator = document.querySelector('#ytplayer').getAttribute("data-username")
      let toDateLarge = new Date();
      let toDate = toDateLarge.toLocaleDateString();
      const currentVideoTimeSec = player.playerInfo.currentTime
      let currentTimeHours = Math.floor(currentVideoTimeSec / 60 / 60)
      let currentTimeMins = Math.floor((currentVideoTimeSec%3600)/60)
      let currentTimeSecs = Math.floor(currentVideoTimeSec%3600)%60
      
      if(currentTimeMins<10){currentTimeMins = `0${currentTimeMins}`}
      if(currentTimeSecs<10){currentTimeSecs = `0${currentTimeSecs}`}
      
      fetch(`/notes/${userID}/${videoID}`,{headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
        method: "POST",
        body:JSON.stringify( {
          user: noteCreator,
          time: `${currentTimeHours}:${currentTimeMins}:${currentTimeSecs}`,
          note: note,
          date: toDate})
    })
      .then(response => response.json())
      .then(res => {
        if (document.querySelector('#myNotes').classList.contains('primaryButton')) {
          getUserNotes()
        } else if (document.querySelector('#creatorsNotes').classList.contains('primaryButton')){
          getCreatorNotes()
        } else {
          getAllNotes()
        }
      })
    })
  });
}

function addListenerToTimeStamp(){
  let timeStamps = document.querySelectorAll('.timestamp')
  for (let i = 0; i < timeStamps.length; i++) {
    timeStamps[i].addEventListener('click',() =>{
      let time = timeStamps[i].innerText
      let arrTime = time.split(":")
      let realTime = (+arrTime[0]*3600)+(+arrTime[1]*60)+(+arrTime[2])
      player.seekTo(realTime)

    })
    
  }
}

addListenerToTimeStamp()

if (document.querySelector('#creatorsNotes') !== null) {
  document.querySelector('#myNotes').addEventListener('click', function () {
    
    document.querySelector('#myNotes').className = ''
    document.querySelector('#myNotes').classList.add('primaryButton')
    document.querySelector('#myNotes').classList.add('myNotes')
    
    document.querySelector('#creatorsNotes').className = ''
    document.querySelector('#creatorsNotes').classList.add('creatorsNotes')
    document.querySelector('#creatorsNotes').classList.add('secondaryButton')
    
    document.querySelector('#allNotes').className = ''
    document.querySelector('#allNotes').classList.add('allNotes')
    document.querySelector('#allNotes').classList.add('secondaryButton')
    
  
    getUserNotes()
    
  })

  document.querySelector('#creatorsNotes').addEventListener('click', function () {
    document.querySelector('#creatorsNotes').className = ''
    document.querySelector('#creatorsNotes').classList.add('primaryButton')
    document.querySelector('#creatorsNotes').classList.add('creatorsNotes')
    
    document.querySelector('#myNotes').className = ''
    document.querySelector('#myNotes').classList.add('myNotes')
    document.querySelector('#myNotes').classList.add('secondaryButton')
    
    document.querySelector('#allNotes').className = ''
    document.querySelector('#allNotes').classList.add('allNotes')
    document.querySelector('#allNotes').classList.add('secondaryButton')
    
  
    getCreatorNotes()
    
  })
}