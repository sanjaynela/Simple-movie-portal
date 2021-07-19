//Function to fetch movies
async function fetchMovies() {
    const response = await fetch('/trending');
    //Convert to json object
    const obj = await response.json();
    // waits until the request completes...
    return obj;
}
fetchMovies().then(
    function(data){
        //Get 5 trending results
        for(let i=0;i<5;i++){
            // //Create array
            // let objArray = [];
            //Store attributes in an array
            let title = data.results[i].title;
            let movieId =  "movieImage" + (i+1);
            let backdropPath = "https://image.tmdb.org/t/p/original" + data.results[i].backdrop_path;
            //Replace image 
            document.getElementById(movieId).src = backdropPath;
            let releaseDate = data.results[i].release_date.substring(0,4);
            // console.log(releaseDate);
            //Replace text
            let text = title + " (" + releaseDate + ")";
            let movieTextId = "movieText" + (i+1);
            document.getElementById(movieTextId).innerHTML = text;
            // objArray.push(title,backdropPath,releaseDate);
            // //Store array in dictionary
            // results[i] = objArray;
        }
        // return results;
    }
);

//Function to fetch airing today
async function fetchAiring(){
    const response = await fetch('/airing');
    //Convert to json object
    const obj = await response.json();
    // waits until the request completes...
    return obj;
}
fetchAiring().then(
    function(data){
        //Get 5 airing results
        for(let i=0;i<5;i++){
            //Get name
            let name = data.results[i].name;
            let showId =  "showImage" + (i+1);
            let backdropPath = "https://image.tmdb.org/t/p/original" + data.results[i].backdrop_path;
            //Replace image 
            document.getElementById(showId).src = backdropPath;
            let firstAirDate = data.results[i].first_air_date.substring(0,4);
            //Replace text
            let text = name + " (" + firstAirDate + ")";
            let showTextId = "showText" + (i+1);
            document.getElementById(showTextId).innerHTML = text;
            // objArray.push(title,backdropPath,releaseDate);
            // //Store array in dictionary
            // results[i] = objArray;
        }
    }
);