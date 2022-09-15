document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("playlistApp JS imported successfully!");
  },
  false
);

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

{/* <div class="noteCard">
    
    <div class="noteHeader">
        <p class="timestamp">01:45</p>
        <div class="noteCredits">
            <p>06/18/2022 | by Name</p>
        </div>

    </div>
    
    <p class="noteText">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
</div> */}