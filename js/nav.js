document.addEventListener("DOMContentLoaded", function() {
  // Activate sidebar nav
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();

  // Load page content
  var page = window.location.hash.substr(1);
  if (page == "") page = "home";
  loadPage(page);
 
  function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;
 
        // Muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });

        document.querySelectorAll(".topnav a, .sidenav a").forEach(function(elm) {
            elm.addEventListener("click", function(event) {

                //tutup sidenav
                var sidenav = document.querySelector(".sidenav");
                M.Sidenav.getInstance(sidenav).close();

                //memuat kontent halaman yang dipanggil
                page = event.target.getAttribute("href").substr(1);
                loadPage(page);
            });
        });
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  function loadPage(page) {    
    if (page == "") page = "home"; 
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        var content = document.querySelector("#body-content");
        if(page == "home"){
          getStandings()
        }
        else if(page == "team") {
          getTeam('','')
        }
        else if(page == "favorite") {
          favorite()
        }        

        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
        } else if (this.status == 404) {
          content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
        } else {
          content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
        }
      }
    };
    xhttp.open("GET", "Pages/" + page + ".html", true);
    xhttp.send();
  }

});