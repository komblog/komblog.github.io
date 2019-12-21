

    // Create IndexDB
    function registerIDB() {
        var dbPromise = idb.open("favclub", 3, function(upgradeDb) {
          if (!upgradeDb.objectStoreNames.contains("club")) {
            upgradeDb.createObjectStore("club", {keyPath: 'id'});
            console.log("IndexDB Created")
          }

          if (!upgradeDb.objectStoreNames.contains("lastView")) {
            upgradeDb.createObjectStore("lastView");
            console.log("IndexDB Created")
          }
          console.log("DB already use")
        });
      }
  
      function requestPushPermition() {
        if('Notification' in window) {
          Notification.requestPermission()
          .then(function(result) {
            if(result == 'denied') {
                console.log("Fitur notifikasi tidak diijinkan.")
                return;
            } else if(result == 'default') {
                console.log("Pengguna menutup kotak dialog permintaan ijin.")
                return;
            }
  
            if(('PushManager' in window)) {
                navigator.serviceWorker.getRegistration()
                .then(function(registration) {
                  registration.pushManager.subscribe({
                      userVisibleOnly : true,
                      applicationServerKey : urlBase64ToUint8Array("BKTJb1_YolEn1qz4ssYBz5yRwnqPkmkjxJjqsOZLJsLrF4aP3yK5fyXOxAuKR9bjZFdXPZH1h-tfVPu-6WhjRoo")
                  })
                  .then(function(subscribe) {
                      console.log("Berhasil melakukan subscribe dengan endpoint ", subscribe.endpoint);
                      console.log("Berhasil melakukan subscribe dengan key ", btoa(String.fromCharCode.apply(
                          null, new Uint8Array(subscribe.getKey('p256dh')))));
                      console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                          null, new Uint8Array(subscribe.getKey('auth')))));
                  })
                  .catch(function(e) {
                      console.log("Tidak dapat melakukan subscribe : ", e.massage);
                  });
              });
            }
          });
        }
      }
  
      function urlBase64ToUint8Array(base64String) {
          const padding = '='.repeat((4 - base64String.length % 4) % 4);
          const base64 = (base64String + padding)
              .replace(/-/g, '+')
              .replace(/_/g, '/');
          const rawData = window.atob(base64);
          const outputArray = new Uint8Array(rawData.length);
          for (let i = 0; i < rawData.length; ++i) {
              outputArray[i] = rawData.charCodeAt(i);
          }
          return outputArray;
      }
      
      function deleteClub(id){
        var dbPromise = idb.open("favclub", 3, function(upgradeDb) {
          if (!upgradeDb.objectStoreNames.contains("club")) {
            upgradeDb.createObjectStore("club", {keyPath: 'id'});
          }
        });
        dbPromise.then(function(db) {
          var tx = db.transaction('club', 'readwrite');
          var store = tx.objectStore('club');
          store.delete(id);
          return tx.complete;
        }).then(function() {
          M.toast({html: 'Tim deleted', classes: 'rounded'});
          favorite()
        });
      }
  
      function saveFavorite(idTeam, clubName) {
        var dbPromise = idb.open("favclub", 3, function(upgradeDb) {
          if (!upgradeDb.objectStoreNames.contains("club")) {
            upgradeDb.createObjectStore("club", {keyPath: 'id'});
          }
        });
        dbPromise.then(function(db) {
            var tx = db.transaction('club', 'readwrite');
            var store = tx.objectStore('club');
            var item = {
                clubName : clubName,
                id: idTeam
            };
            store.put(item); //menambahkan key "club"
            return tx.complete;
        }).then(function() {
            M.toast({html: 'Tim favorite berhasil ditambahkan', classes: 'rounded'});
            console.log("Saved to favorite")
        }).catch(function() {
            console.log("Failed")
        })
      }