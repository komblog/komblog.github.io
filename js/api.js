var base_url = "https://api.football-data.org/v2/";
// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}
// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}
// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}
// Blok kode untuk melakukan request data json
function getStandings() {
    if ('caches' in window) {
        caches.match(base_url + "competitions/2021/standings").then(function(response) {
          if (response) {
            response.json().then(function (data) {
              var listStandings = data.standings[0].table;      
              var headerTableHTML = "";
              headerTableHTML += `<div class="page-header">
                                    <h1>${data.competition.name}</h1>
                                  </div>`;
              headerTableHTML += `<table>
                                    <thead>
                                      <tr>
                                        <th>#</th>                                
                                        <th>Team Name</th>
                                        <th>P</th>
                                        <th>W</th>
                                        <th>D</th>
                                        <th>L</th>
                                        <th>F</th>
                                        <th>A</th>
                                        <th>GD</th>
                                        <th>Pts</th>
                                      </tr>
                                    </thead>
                                    <tbody>`;
              listStandings.forEach(function(teams) {
                headerTableHTML +=    `<tr>
                                        <td>${teams.position}</td>
                                        <td><a href="#team" onClick="getTeam('${teams.team.id}', '${teams.team.name}');">${teams.team.name}</a></td>
                                        <td>${teams.playedGames}</td>
                                        <td>${teams.won}</td>
                                        <td>${teams.draw}</td>
                                        <td>${teams.lost}</td>
                                        <td>${teams.goalsFor}</td>
                                        <td>${teams.goalsAgainst}</td>
                                        <td>${teams.goalDifference}</td>
                                        <td>${teams.points}</td>
                                      </tr>`;
              })
              headerTableHTML +=    `</tbody>
                                  </table>`;
            document.getElementById("standings").innerHTML = headerTableHTML;      
          })
        }
      })
    }

    fetch(base_url + "competitions/2021/standings", {
      method : "GET",
      withCredentials: true,
      headers: {
        "X-Auth-Token": "ef6ba06c0b0d4dc9b8f18a15d7decbbb"
      }}
    )
    .then(status)
    .then(json)
    .then(function(data) {
      var listStandings = data.standings[0].table;      
      var headerTableHTML = "";
      headerTableHTML += `<div class="page-header">
                                    <h1>${data.competition.name}</h1>
                                  </div>`;
      headerTableHTML += `<table>
                            <thead>
                              <tr>
                                <th>#</th>                                
                                <th>Team Name</th>
                                <th>P</th>
                                <th>W</th>
                                <th>D</th>
                                <th>L</th>
                                <th>F</th>
                                <th>A</th>
                                <th>GD</th>
                                <th>Pts</th>
                              </tr>
                            </thead>
                            <tbody>`;
      listStandings.forEach(function(teams) {        
        headerTableHTML +=    `<tr>
                                <td>${teams.position}</td>
                                <td><a href="#team" onClick="getTeam('${teams.team.id}', '${teams.team.name}');">${teams.team.name}</a></td>
                                <td>${teams.playedGames}</td>
                                <td>${teams.won}</td>
                                <td>${teams.draw}</td>
                                <td>${teams.lost}</td>
                                <td>${teams.goalsFor}</td>
                                <td>${teams.goalsAgainst}</td>
                                <td>${teams.goalDifference}</td>
                                <td>${teams.points}</td>
                              </tr>`;
      })
      headerTableHTML +=    `</tbody>
                          </table>`;
      document.getElementById("standings").innerHTML = headerTableHTML;      
    })
    .catch(error);
}

function getTeam(idTeam, clubName) {  
  var dbPromise = idb.open("favclub", 3, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains("lastView")) {
      upgradeDb.createObjectStore("lastView", {keyPath: 'id'});
      console.log("object store lastView Created")
    }
    console.log("object store lastView already exist")
  });

  dbPromise.then(function(db) {
    var tx = db.transaction('lastView', 'readonly');
    var store = tx.objectStore('lastView');
    return store.getAll();
  }).then(function(item) {  

    if(!idTeam) idTeam = item[0].idTeam;
    if(!clubName) clubName = item[0].clubName;

    console.log({idTeam, clubName})

    callTeam(idTeam, clubName);
    if ('caches' in window) {
      caches.match(base_url + "teams/"+idTeam+"/matches?status=SCHEDULED").then(function(response) {      
        if (response) {
          response.json().then(function (data) {
            var list = data.matches;            
            var cardHTML = "";
            cardHTML += `<h1>${clubName} Schedule</h1>`;
            cardHTML += `<a class="waves-effect waves-light btn save-fav" onclick="saveFavorite(${idTeam}, ${clubName})"><i class="material-icons left">save</i>Jadikan Tim Favorite</a>`;
            list.forEach(function(schedule) {
              cardHTML += `<div class="row">
                            <div class="col s12 m12">
                              <div class="card indigo lighten-5">
                                <div class="card-content blue-text">
                                  <span class="card-title">${schedule.competition.name}</span>  
                                  <p>Date : ${schedule.utcDate}</p>                 
                                </div>
                                <div class="card-action">
                                  <a href="#">${schedule.homeTeam.name}</a>
                                  <a href="#">VS</a>
                                  <a href="#">${schedule.awayTeam.name}</a>
                                </div>
                              </div>
                            </div>
                          </div>`
            })
          })
        }
      })
    }

    fetch(base_url + "teams/"+idTeam+"/matches?status=SCHEDULED", {
      method : "GET",
      withCredentials: true,
      headers: {
        "X-Auth-Token": "ef6ba06c0b0d4dc9b8f18a15d7decbbb"
      }}
    )
    .then(status)
    .then(json)
    .then(function(data) {
      var list = data.matches;
      var cardHTML = "";
      cardHTML += `<h1>${clubName} Schedule</h1>`;
      cardHTML += `<a class="waves-effect waves-light btn save-fav" onclick="saveFavorite('${idTeam}', '${clubName}')"><i class="material-icons left">save</i>Jadikan Tim Favorite</a>`;
      list.forEach(function(schedule) {
        cardHTML += `<div class="row">
                      <div class="col s12 m12">
                        <div class="card indigo lighten-5">
                          <div class="card-content blue-text">
                            <span class="card-title">${schedule.competition.name}</span>  
                            <p>Date : ${schedule.utcDate}</p>                 
                          </div>
                          <div class="card-action">
                            <a href="#">${schedule.homeTeam.name}</a>
                            <a href="#">VS</a>
                            <a href="#">${schedule.awayTeam.name}</a>
                          </div>
                        </div>
                      </div>
                    </div>`
      })
      document.getElementById("team-schedule").innerHTML = cardHTML;
    })
    .catch(error);
    })
}

function callTeam(idTeam, clubName){
  var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        var content = document.querySelector("#body-content");      
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
          saveLastVisit(idTeam, clubName);
        } else if (this.status == 404) {
          content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
        } else {
          content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
        }
      }
    };
    xhttp.open("GET", "pages/team" + ".html", true);
    xhttp.send();
}

function saveLastVisit(idTeam, clubName)
{
  var dbPromise = idb.open("favclub", 3, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains("lastView")) {
      upgradeDb.createObjectStore("lastView", {keyPath: 'id'});
      console.log("object store lastView Created")
    }
    console.log("object store lastView already exist")
  });

  dbPromise.then(function(db) {
    var tx = db.transaction('lastView', 'readwrite');
    var store = tx.objectStore('lastView');
    var item = {
      clubName : clubName,
      idTeam : idTeam,
      id: 0
    };    
    store.put(item, 0);
    return tx.complete;
  })
  .then(function() {
    console.log("saved");
  })
  .catch(function(err) {
    console.log(err);
  })
}

function favorite() {
  var dbPromise = idb.open("favclub", 3, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains("club")) {
      upgradeDb.createObjectStore("club", {keyPath: 'id'});
    }
  });

  dbPromise.then(function(db) {
    var tx = db.transaction('club', 'readonly');
    var store = tx.objectStore('club');
    return store.getAll();
  }).then(function(items) {
    var headerTableHTML = "";
    headerTableHTML += `<table>
                            <thead>
                              <tr>                                                                
                                <th>Team Name</th>
                                <th>Action</th>                                
                              </tr>
                            </thead>
                            <tbody>`;
    items.forEach(function(team) {
      headerTableHTML += `<tr>
                            <td>${team.clubName}</td>
                            <td><a id=${team.id} class="waves-effect waves-light btn red" onClick="deleteClub('${team.id}')">Delete</a></td>
                          </tr>`;
    })
    headerTableHTML +=    `</tbody>
                          </table>`;
    document.getElementById("favorite").innerHTML = headerTableHTML;
  });

}
