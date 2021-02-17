import {utilService} from './map-storage.js'
const PLACE_KEY = 'PLACES-DB';
const API_KEY = 'AIzaSyCq69s-N1C8sggOeWFqhQWXNlxCtLjHNzs'; 


export const mapService = {
    getLocs,
    getPositionName
}
var locs = [{id:1, name:'tel aviv',  lat: 11.22, lng: 22.11 ,weather:'30', createdAt: Date.now() , updatedAt: Date.now()}]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}


function getPositionName(latAndLng){
    const placesNames = utilService.loadFromStorage(PLACE_KEY) || {};
    console.log(placesNames)
    console.log('Getting from Network');
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latAndLng.lat},${latAndLng.lng}&sensor=true&key=${API_KEY}`)
    .then(res => {
        console.log(res.data.results[0].formatted_address)
        let placeInfo = {name:res.data.results[0].formatted_address, lat:latAndLng.lat, lng:latAndLng.lng}
        placesNames[res.data.results[0].formatted_address] = placeInfo
        utilService.saveToStorage( PLACE_KEY, placesNames)
        return placesNames})
    // .then(ytVideos => ytVideos.map(ytVideo => ({
    //     id: ytVideo.id.videoId,
    //     title: ytVideo.snippet.title,
    //     img: {
    //         url: ytVideo.snippet.thumbnails.default.url,
    //         width: ytVideo.snippet.thumbnails.default.width,
    //         height: ytVideo.snippet.thumbnails.default.height,
    //     }
    // })))
    // .then(videos => {
    //     termVideosMap[term] = videos;
    //     utilService.saveToStorage(KEY, termVideosMap)
    //     return videos;
    // })



}



