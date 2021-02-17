import { mapService } from './services/map-service.js'

var gMap;
console.log('Main!');

mapService.getLocs()
    .then(locs => console.log('locs', locs))


window.onload = () => {
    //TODO: get user location
    document.querySelector('.btn-get-location').addEventListener('click', (ev) => {
        console.log('Aha!', ev.target);

        panTo(35.6895, 139.6917);
    })

     
    //  const myLatlng = { lat: -25.363, lng: 131.044 };
    //  const map = new google.maps.Map(document.getElementById("map"), {
    //    zoom: 4,
    //    center: myLatlng,
    //  });
//     //  .then(() => {
//     //     let infoWindow = new google.maps.InfoWindow({
//     //         content: "Click the map to get Lat/Lng!",
//     //         position: myLatlng,
//     //       });
//     //       infoWindow.open(map);
//     //       // Configure the click listener.
//     //       map.addListener("click", (mapsMouseEvent) => {
//     //         // Close the current InfoWindow.
//     //         infoWindow.close();
//     //         console.log('in?')
//     //         // Create a new InfoWindow.
//     //         infoWindow = new google.maps.InfoWindow({
//     //           position: mapsMouseEvent.latLng,
//     //         });
//     //         infoWindow.setContent(
//     //           JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2)
//     //         );
//     //         infoWindow.open(map);
//     //       });
//     //     }

//     // )

// }




    initMap()
        .then(() => {
            addMarker({ lat: 32.0749831, lng: 34.9120554 });
        })
        .catch(() => console.log('INIT MAP ERROR'));

    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords);
        })
        .catch(err => {
            console.log('err!!!', err);
        })
}

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
        }).then(() => {

            gMap.addListener("click", (mapsMouseEvent) => {
                // Close the current InfoWindow.
                let pos = { position: mapsMouseEvent.latLng}
                
                console.log('click', pos);
                console.log(pos.position.lat())
                console.log(pos.position.lng())
                let lanAndLng = {lat: pos.position.lat(), lng:pos.position.lng()}
                placeMarkerAndPanTo(lanAndLng, gMap)
                mapService.getPositionName(lanAndLng).then(name => renderTable(name))
                
        })
        
    } )
}

function placeMarkerAndPanTo(latLng, map) {
    new google.maps.Marker({
      position: latLng,
      map: map,
    });
    console.log(latLng)
    map.panTo(latLng);

    // gPlaces = loadFromStorage(PLACES_KEY);
    // if (!gPlaces || !gPlaces.length) {
    //   gPlaces = [];
    //   let placeName = 'Eilat';
    //   gPlaces.push({ latLng, placeName });
    //   savePlacesToStorage(gPlaces);
    //   gPlaces = loadFromStorage(PLACES_KEY);
    //   renderPlaces();
    // } else {
    //   console.log(gPlaces);
    //   var placeName = prompt('place name?');
    //   gPlaces.push({ latLng, placeName });
    //   console.log(gPlaces);
    //   savePlacesToStorage(gPlaces);
    //   renderPlaces();
    // }
  }




   
function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    });
    return marker;
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(laLatLng);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}


function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCq69s-N1C8sggOeWFqhQWXNlxCtLjHNzs'; 
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


function renderTable(gplaces){
    var strHTML = '';
    for (let key in gplaces) {
      strHTML += `<tr>  <td> ${gplaces[key].lat} </td> <td> ${gplaces[key].lng} </td>  <td> ${gplaces[key].name} </td> <td> <button onclick="onGo(${gplaces[key].lat} , ${gplaces[key].lng})"> GO </button> </td>   <td> <button onclick="onDelete( '${gplaces[key].name}')"> Delete </button> </td> </tr> `;
    }
    document.querySelector('.table-input').innerHTML = strHTML;
}




window.onGo = (lat,lng) => {
    let lanAndlng = {lat,lng}
    placeMarkerAndPanTo(lanAndlng, gMap)
}

window.onDelete = (name) => {
    console.log(name)
    // localStorage.removeItem('PLACES-DB');
}





