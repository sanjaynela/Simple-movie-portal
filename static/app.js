
async function fetchSearchResults(query) {
    const response = await fetch(query);
    //Convert to json object
    const obj = await response.json();
    // waits until the request completes...
    return obj;
}

async function fetchMoveGenres(){
    //await and get promise 
    const response = await fetch('/getMovieGenres');
    //Convert to json object
    const obj = await response.json();
    // waits until the request completes...
    return obj;
}

async function fetchTvGenres(){
    //await and get promise 
    const response = await fetch('/getTvGenres');
    //Convert to json object
    const obj = await response.json();
    // waits until the request completes...
    return obj;
}

/**Function which executes search tv shows and movies endpoint and populates on html */
function searchMoviesAndTvShows(finalizedKeyword){
    let query = "/searchMoviesTv?query=" + finalizedKeyword;
    fetchSearchResults(query).then(
        function(data){
            let resultListLength = data.results.length;
            //Check if rootDiv exists. If yes, delete it
            let tempRootDiv = document.getElementById("rootDiv");
            if(tempRootDiv!=null){
                document.getElementById("searchSectionBox").removeChild(tempRootDiv);
            }
            //Create rootDiv where all showingresults box and results are added. This is created to make it easy delete it later 
            let rootDiv = document.createElement("div");
            rootDiv.setAttribute("id","rootDiv");
            document.getElementById("searchSectionBox").appendChild(rootDiv);

            //Check if search results are empty
            if(resultListLength===0){
                //Create element to display no results found
                let div = document.createElement("div");
                div.setAttribute("id","noResultsBox");
                div.classList.add("noResultsBox");
                let p = document.createElement("p");
                let text = document.createTextNode("No results found.");
                p.appendChild(text);
                div.appendChild(p);
                //Append to searchSectionBox
                document.getElementById("rootDiv").appendChild(div);
            }
            //Else,display results by creating elements
            else{
                //Create showing results...
                let div = document.createElement("div");
                div.setAttribute("id","showingResultsBox");
                div.classList.add("showingResultsBox");
                let p = document.createElement("p");
                let text = document.createTextNode("Showing results...");
                p.appendChild(text);
                div.appendChild(p);
                //Append to searchSectionBox
                document.getElementById("rootDiv").appendChild(div);
                //Iterate though each result of data and create elements to display its content
                    //For 10 elements
                let genreMovieDictPromise = fetchMoveGenres();
                let genreTvDictPromise = fetchTvGenres();
                let genreDictPromise = null;
                let mediaType = null;
                for(let i=0;i<10;i++){
                    //Create parent div
                    let parentDiv = document.createElement("div");
                    let id = data.results[i].id;
                    parentDiv.setAttribute("id",id);
                    parentDiv.classList.add("searchResults");
                    //Check media type
                    mediaType = data.results[i].media_type;
                    //Create img
                    let img = document.createElement("img");
                    if(data.results[i].backdrop_path!=null){
                        //Image is not null
                        let backdropPath = "https://image.tmdb.org/t/p/original" + data.results[i].backdrop_path;
                        img.setAttribute("src",backdropPath);
                    }
                    else{
                        //Image is null
                        img.setAttribute("src","static/movie-placeholder.jpg");
                    }
                    img.classList.add("resultImage");

                    //Create resultText div
                    let resultTextdiv = document.createElement("div");
                    resultTextdiv.classList.add("resultText");

                    //Add Title 
                    let resultTextTitle = document.createElement("H2");
                        //Check if tv or movie
                    let textTitle = "";
                    if(mediaType==="movie"){
                        //Movie
                        textTitle = document.createTextNode(data.results[i].title);
                    }
                    else{
                        //Tv show
                        textTitle = document.createTextNode(data.results[i].name);
                    }
                    resultTextTitle.appendChild(textTitle);

                    //Add year and genre for new p element
                    let resultP = document.createElement("p");
                    let yearGenreText = "";
                        //Year
                        //Check if tv or movie
                    if(mediaType==="movie"){
                        //Movie
                        yearGenreText = yearGenreText + data.results[i].release_date.substring(0,4);
                    }
                    else{
                        //Tv
                        yearGenreText = yearGenreText + data.results[i].first_air_date.substring(0,4);
                    }
                        //Genre list
                    let genreListIds = data.results[i].genre_ids
                        //Check if genre list is not empty
                    if(genreListIds.length!=0){
                        if(yearGenreText){
                            yearGenreText += " | ";
                        }
                        let genreList = [];
                        //Check if movie or year
                        if(mediaType==="movie"){
                            //Movie
                            genreDictPromise = genreMovieDictPromise;
                        }
                        else{
                            //Tv
                            genreDictPromise = genreTvDictPromise;
                        }
                        genreDictPromise.then(
                            function(genreDict){
                                //Iterate through each genre id in genreListIds
                                for(let j=0;j<genreListIds.length;j++){
                                    let currentGenreId = genreListIds[j];
                                    genreList.push(genreDict[currentGenreId]);
                                }
                                //Iterate through each genre in genreList and add it to yearGenreText
                                for(let k=0;k<genreList.length-1;k++){
                                    //Add , for all elements excepts for last element
                                    yearGenreText += genreList[k] + ", "
                                }
                                yearGenreText += genreList[genreList.length-1]
                                let yearGenreResult = document.createTextNode(yearGenreText);
                                //Add final yearGenre Text to p element
                                resultP.appendChild(yearGenreResult);
        

                            }
                        );
                    }

                    //Append children to resultTextdiv
                    resultTextdiv.appendChild(resultTextTitle);   
                    resultTextdiv.appendChild(resultP);

                    //Add star, vote average and vote count 
                        //Create subparent div to contain star,vote count
                    let resultRatingsDiv = document.createElement("div");
                    resultRatingsDiv.classList.add("resultratings");
                        //Create star
                    let starSpan = document.createElement("span");
                    starSpan.classList.add("star");
                    starSpan.appendChild(document.createTextNode("★"));
                        //Create vote average
                    let voteAvergeSpan = document.createElement("span");
                    let voteAverage = " " + (data.results[i].vote_average/2) + "/5";
                    voteAvergeSpan.appendChild(document.createTextNode(voteAverage));
                    voteAvergeSpan.classList.add("starText");
                        //Create vote count
                    let voteCountSpan = document.createElement("span");
                    voteCountSpan.classList.add("voteCount");
                    let voteCountText = " " + data.results[i].vote_count + " votes";
                    voteCountSpan.appendChild(document.createTextNode(voteCountText));
                    
                    //Append children to resultRatingsDiv
                    resultRatingsDiv.appendChild(starSpan);
                    resultRatingsDiv.appendChild(voteAvergeSpan);
                    resultRatingsDiv.appendChild(voteCountSpan);

                    //Add movie description
                        //Create subparent div to add movie description
                    let resultDescriptionDiv = document.createElement("div");
                    resultDescriptionDiv.classList.add("resultDescription");
                    let resultDescriptionText = data.results[i].overview;
                    resultDescriptionDiv.appendChild(document.createTextNode(resultDescriptionText));

                    //Add show more button
                    let resultButton = document.createElement("button");
                    resultButton.classList.add("resultButton");
                    resultButton.appendChild(document.createTextNode("Show more"));
                    resultButton.addEventListener("click",function(){
                        showMoreMovieTv(i,id,mediaType);
                    }); 

                    //Append children to resultTextdiv
                    resultTextdiv.appendChild(resultRatingsDiv);
                    resultTextdiv.appendChild(resultDescriptionDiv);
                    resultTextdiv.appendChild(resultButton);

                    //Add modal div
                    let modalDiv = document.createElement("div");
                    let modalDivId = "resultModal" + i;
                    modalDiv.setAttribute("id",modalDivId);
                    modalDiv.classList.add("modal");
                        //Create modal content div
                    let modalContentDiv = document.createElement("div");
                    modalContentDiv.setAttribute("id","modalContentDiv" + i);
                    modalContentDiv.classList.add("modalContent");
                        //Create close span
                    let closeSpan = document.createElement("span");
                    let closeSpanId = "closeSpan" + i;
                    closeSpan.setAttribute("id",closeSpanId);
                    closeSpan.classList.add("close");
                    closeSpan.setAttribute("onclick","closeModal("+i+")");
                    closeSpan.appendChild(document.createTextNode('✖'));
                        //Append children to modalContentDiv
                    modalContentDiv.appendChild(closeSpan);
                    // modalContentDiv.appendChild(pText);
                        //Append modalContentDiv to modalDiv
                    modalDiv.appendChild(modalContentDiv);

                    //Append to parentDiv
                    parentDiv.appendChild(img);
                    parentDiv.appendChild(resultTextdiv);
                    parentDiv.appendChild(modalDiv);


                    //Append parentDiv to searchSectionBox
                    document.getElementById("rootDiv").appendChild(parentDiv);

                    // console.log(data.results[i].id);
                }
            }
        }
    );    
}

/**Function which executes search tv shows endpoint and populates on html */
function searchTvShows(finalizedKeyword){
    let query = "/searchTv?query=" + finalizedKeyword;
    fetchSearchResults(query).then(
        function(data){
            let resultListLength = data.results.length;
            //Check if rootDiv exists. If yes, delete it
            let tempRootDiv = document.getElementById("rootDiv");
            if(tempRootDiv!=null){
                document.getElementById("searchSectionBox").removeChild(tempRootDiv);
            }
            //Create rootDiv where all showingresults box and results are added. This is created to make it easy delete it later 
            let rootDiv = document.createElement("div");
            rootDiv.setAttribute("id","rootDiv");
            document.getElementById("searchSectionBox").appendChild(rootDiv);

            //Check if search results are empty
            if(resultListLength===0){
                //Create element to display no results found
                let div = document.createElement("div");
                div.setAttribute("id","noResultsBox");
                div.classList.add("noResultsBox");
                let p = document.createElement("p");
                let text = document.createTextNode("No results found.");
                p.appendChild(text);
                div.appendChild(p);
                //Append to searchSectionBox
                document.getElementById("rootDiv").appendChild(div);
            }
            //Else,display results by creating elements
            else{
                //Create showing results...
                let div = document.createElement("div");
                div.setAttribute("id","showingResultsBox");
                div.classList.add("showingResultsBox");
                let p = document.createElement("p");
                let text = document.createTextNode("Showing results...");
                p.appendChild(text);
                div.appendChild(p);
                //Append to searchSectionBox
                document.getElementById("rootDiv").appendChild(div);
                //Iterate though each result of data and create elements to display its content
                    //For 10 elements
                let genreDictPromise = fetchTvGenres();
                for(let i=0;i<10;i++){
                    //Create parent div
                    let parentDiv = document.createElement("div");
                    let id = data.results[i].id;
                    parentDiv.setAttribute("id",id);
                    parentDiv.classList.add("searchResults");
                    //Create img
                    let img = document.createElement("img");
                    if(data.results[i].backdrop_path!=null){
                        //Image is not null
                        let backdropPath = "https://image.tmdb.org/t/p/original" + data.results[i].backdrop_path;
                        img.setAttribute("src",backdropPath);
                    }
                    else{
                        //Image is null
                        img.setAttribute("src","static/movie-placeholder.jpg");
                    }
                    img.classList.add("resultImage");

                    //Create resultText div
                    let resultTextdiv = document.createElement("div");
                    resultTextdiv.classList.add("resultText");

                    //Add Title 
                    let resultTextTitle = document.createElement("H2");
                    let textTitle = document.createTextNode(data.results[i].name);
                    resultTextTitle.appendChild(textTitle);

                    //Add year and genre for new p element
                    let resultP = document.createElement("p");
                    let yearGenreText = "";
                        //Year
                    yearGenreText = yearGenreText + data.results[i].first_air_date.substring(0,4);
                        //Genre list
                    let genreListIds = data.results[i].genre_ids
                        //Check if genre list is not empty
                    if(genreListIds.length!=0){
                        if(yearGenreText){
                            yearGenreText += " | ";
                        }
                        let genreList = [];
                        genreDictPromise.then(
                            function(genreDict){
                                //Iterate through each genre id in genreListIds
                                for(let j=0;j<genreListIds.length;j++){
                                    let currentGenreId = genreListIds[j];
                                    genreList.push(genreDict[currentGenreId]);
                                }
                                //Iterate through each genre in genreList and add it to yearGenreText
                                for(let k=0;k<genreList.length-1;k++){
                                    //Add , for all elements excepts for last element
                                    yearGenreText += genreList[k] + ", "
                                }
                                yearGenreText += genreList[genreList.length-1]
                                let yearGenreResult = document.createTextNode(yearGenreText);
                                //Add final yearGenre Text to p element
                                resultP.appendChild(yearGenreResult);
        

                            }
                        );
                    }

                    //Append children to resultTextdiv
                    resultTextdiv.appendChild(resultTextTitle);   
                    resultTextdiv.appendChild(resultP);

                    //Add star, vote average and vote count 
                        //Create subparent div to contain star,vote count
                    let resultRatingsDiv = document.createElement("div");
                    resultRatingsDiv.classList.add("resultratings");
                        //Create star
                    let starSpan = document.createElement("span");
                    starSpan.classList.add("star");
                    starSpan.appendChild(document.createTextNode("★"));
                        //Create vote average
                    let voteAvergeSpan = document.createElement("span");
                    let voteAverage = " " + (data.results[i].vote_average/2) + "/5";
                    voteAvergeSpan.appendChild(document.createTextNode(voteAverage));
                    voteAvergeSpan.classList.add("starText");
                        //Create vote count
                    let voteCountSpan = document.createElement("span");
                    voteCountSpan.classList.add("voteCount");
                    let voteCountText = " " + data.results[i].vote_count + " votes";
                    voteCountSpan.appendChild(document.createTextNode(voteCountText));
                    
                    //Append children to resultRatingsDiv
                    resultRatingsDiv.appendChild(starSpan);
                    resultRatingsDiv.appendChild(voteAvergeSpan);
                    resultRatingsDiv.appendChild(voteCountSpan);

                    //Add movie description
                        //Create subparent div to add movie description
                    let resultDescriptionDiv = document.createElement("div");
                    resultDescriptionDiv.classList.add("resultDescription");
                    let resultDescriptionText = data.results[i].overview;
                    resultDescriptionDiv.appendChild(document.createTextNode(resultDescriptionText));

                    //Add show more button
                    let resultButton = document.createElement("button");
                    resultButton.classList.add("resultButton");
                    resultButton.appendChild(document.createTextNode("Show more"));
                    resultButton.setAttribute("onclick","showMoreTv("+i+ "," + id +")");

                    //Append children to resultTextdiv
                    resultTextdiv.appendChild(resultRatingsDiv);
                    resultTextdiv.appendChild(resultDescriptionDiv);
                    resultTextdiv.appendChild(resultButton);

                    //Add modal div
                    let modalDiv = document.createElement("div");
                    let modalDivId = "resultModal" + i;
                    modalDiv.setAttribute("id",modalDivId);
                    modalDiv.classList.add("modal");
                        //Create modal content div
                    let modalContentDiv = document.createElement("div");
                    modalContentDiv.setAttribute("id","modalContentDiv" + i);
                    modalContentDiv.classList.add("modalContent");
                        //Create close span
                    let closeSpan = document.createElement("span");
                    let closeSpanId = "closeSpan" + i;
                    closeSpan.setAttribute("id",closeSpanId);
                    closeSpan.classList.add("close");
                    closeSpan.setAttribute("onclick","closeModal("+i+")");
                    closeSpan.appendChild(document.createTextNode('✖'));
                        //Append children to modalContentDiv
                    modalContentDiv.appendChild(closeSpan);
                    // modalContentDiv.appendChild(pText);
                        //Append modalContentDiv to modalDiv
                    modalDiv.appendChild(modalContentDiv);

                    //Append to parentDiv
                    parentDiv.appendChild(img);
                    parentDiv.appendChild(resultTextdiv);
                    parentDiv.appendChild(modalDiv);

                    //Append parentDiv to searchSectionBox
                    document.getElementById("rootDiv").appendChild(parentDiv);

                    // console.log(data.results[i].id);
                }
            }
        }
    );    
}

/**Function which execute search movies endpoint and populates html*/
function searchMovies(finalizedKeyword){
    let query = "/searchMovies?query=" + finalizedKeyword;
    fetchSearchResults(query).then(
        function(data){
            let resultListLength = data.results.length;
            //Check if rootDiv exists. If yes, delete it
            let tempRootDiv = document.getElementById("rootDiv");
            if(tempRootDiv!=null){
                document.getElementById("searchSectionBox").removeChild(tempRootDiv);
            }
            //Create rootDiv where all showingresults box and results are added. This is created to make it easy delete it later 
            let rootDiv = document.createElement("div");
            rootDiv.setAttribute("id","rootDiv");
            document.getElementById("searchSectionBox").appendChild(rootDiv);
            //Check if search results are empty
            if(resultListLength===0){
                //Create element to display no results found
                let div = document.createElement("div");
                div.setAttribute("id","noResultsBox");
                div.classList.add("noResultsBox");
                let p = document.createElement("p");
                let text = document.createTextNode("No results found.");
                p.appendChild(text);
                div.appendChild(p);
                //Append to searchSectionBox
                document.getElementById("rootDiv").appendChild(div);
            }
            //Else,display results by creating elements
            else{
                //Create showing results...
                let div = document.createElement("div");
                div.setAttribute("id","showingResultsBox");
                div.classList.add("showingResultsBox");
                let p = document.createElement("p");
                let text = document.createTextNode("Showing results...");
                p.appendChild(text);
                div.appendChild(p);
                //Append to searchSectionBox
                document.getElementById("rootDiv").appendChild(div);
                //Iterate though each result of data and create elements to display its content
                    //For 10 elements
                let genreDictPromise = fetchMoveGenres();
                for(let i=0;i<10;i++){
                    //Create parent div
                    let parentDiv = document.createElement("div");
                    let id = data.results[i].id;
                    parentDiv.setAttribute("id",id);
                    parentDiv.classList.add("searchResults");
                    //Create img
                    let img = document.createElement("img");
                    if(data.results[i].backdrop_path!=null){
                        //Image is not null
                        let backdropPath = "https://image.tmdb.org/t/p/original" + data.results[i].backdrop_path;
                        img.setAttribute("src",backdropPath);
                    }
                    else{
                        //Image is null
                        img.setAttribute("src","static/movie-placeholder.jpg");
                    }
                    img.classList.add("resultImage");

                    //Create resultText div
                    let resultTextdiv = document.createElement("div");
                    resultTextdiv.classList.add("resultText");

                    //Add Title 
                    let resultTextTitle = document.createElement("H2");
                    let textTitle = document.createTextNode(data.results[i].title);
                    resultTextTitle.appendChild(textTitle);

                    //Add year and genre for new p element
                    let resultP = document.createElement("p");
                    let yearGenreText = "";
                        //Year
                    yearGenreText = yearGenreText + data.results[i].release_date.substring(0,4);
                        //Genre list
                    let genreListIds = data.results[i].genre_ids
                        //Check if genre list is not empty
                    if(genreListIds.length!=0){
                        if(yearGenreText){
                            yearGenreText += " | ";
                        }
                        let genreList = [];
                        genreDictPromise.then(
                            function(genreDict){
                                //Iterate through each genre id in genreListIds
                                for(let j=0;j<genreListIds.length;j++){
                                    let currentGenreId = genreListIds[j];
                                    genreList.push(genreDict[currentGenreId]);
                                }
                                //Iterate through each genre in genreList and add it to yearGenreText
                                for(let k=0;k<genreList.length-1;k++){
                                    //Add , for all elements excepts for last element
                                    yearGenreText += genreList[k] + ", "
                                }
                                yearGenreText += genreList[genreList.length-1]
                                let yearGenreResult = document.createTextNode(yearGenreText);
                                //Add final yearGenre Text to p element
                                resultP.appendChild(yearGenreResult);
        

                            }
                        );
                    }

                    //Append children to resultTextdiv
                    resultTextdiv.appendChild(resultTextTitle);   
                    resultTextdiv.appendChild(resultP);

                    //Add star, vote average and vote count 
                        //Create subparent div to contain star,vote count
                    let resultRatingsDiv = document.createElement("div");
                    resultRatingsDiv.classList.add("resultratings");
                        //Create star
                    let starSpan = document.createElement("span");
                    starSpan.classList.add("star");
                    starSpan.appendChild(document.createTextNode("★"));
                        //Create vote average
                    let voteAvergeSpan = document.createElement("span");
                    let voteAverage = " " + (data.results[i].vote_average/2) + "/5";
                    voteAvergeSpan.appendChild(document.createTextNode(voteAverage));
                    voteAvergeSpan.classList.add("starText");
                        //Create vote count
                    let voteCountSpan = document.createElement("span");
                    voteCountSpan.classList.add("voteCount");
                    let voteCountText = " " + data.results[i].vote_count + " votes";
                    voteCountSpan.appendChild(document.createTextNode(voteCountText));
                    
                    //Append children to resultRatingsDiv
                    resultRatingsDiv.appendChild(starSpan);
                    resultRatingsDiv.appendChild(voteAvergeSpan);
                    resultRatingsDiv.appendChild(voteCountSpan);

                    //Add movie description
                        //Create subparent div to add movie description
                    let resultDescriptionDiv = document.createElement("div");
                    resultDescriptionDiv.classList.add("resultDescription");
                    let resultDescriptionText = data.results[i].overview;
                    resultDescriptionDiv.appendChild(document.createTextNode(resultDescriptionText));

                    //Add show more button
                    let resultButton = document.createElement("button");
                    resultButton.classList.add("resultButton");
                    resultButton.appendChild(document.createTextNode("Show more"));
                    resultButton.setAttribute("onclick","showMore("+i+ "," + id +")");

                    //Append children to resultTextdiv
                    resultTextdiv.appendChild(resultRatingsDiv);
                    resultTextdiv.appendChild(resultDescriptionDiv);
                    resultTextdiv.appendChild(resultButton);

                    //Add modal div
                    let modalDiv = document.createElement("div");
                    let modalDivId = "resultModal" + i;
                    modalDiv.setAttribute("id",modalDivId);
                    modalDiv.classList.add("modal");
                        //Create modal content div
                    let modalContentDiv = document.createElement("div");
                    modalContentDiv.setAttribute("id","modalContentDiv" + i);
                    modalContentDiv.classList.add("modalContent");
                        //Create close span
                    let closeSpan = document.createElement("span");
                    let closeSpanId = "closeSpan" + i;
                    closeSpan.setAttribute("id",closeSpanId);
                    closeSpan.classList.add("close");
                    closeSpan.setAttribute("onclick","closeModal("+i+")");
                    closeSpan.appendChild(document.createTextNode('✖'));
                        //Append children to modalContentDiv
                    modalContentDiv.appendChild(closeSpan);
                    // modalContentDiv.appendChild(pText);
                        //Append modalContentDiv to modalDiv
                    modalDiv.appendChild(modalContentDiv);

                    //Append to parentDiv
                    parentDiv.appendChild(img);
                    parentDiv.appendChild(resultTextdiv);
                    parentDiv.appendChild(modalDiv);

                    //Append parentDiv to searchSectionBox
                    document.getElementById("rootDiv").appendChild(parentDiv);

                    // console.log(data.results[i].id);
                }
            }
        }
    );
}

function search(id){
    let keyword = document.getElementById("keyword").value;
    let category = document.getElementById("category").value;
    //Check if the values are empty
    if(!keyword || !category){
        alert("Please enter valid values.");
    }
    //Replace spaces in keyword with %20
    let finalizedKeyword = keyword.replace(" ","%20");

    // document.getElementById("searchSectionBox").removeChild(footer);
    //Execute Search Movie Endpoint
    if(category==="Movies"){
        searchMovies(finalizedKeyword);
    }
    else if(category==="TV Shows"){
        searchTvShows(finalizedKeyword);
    }
    else{
        searchMoviesAndTvShows(finalizedKeyword);
    }

}

function clearInput(){
    document.getElementById("keyword").value = "";
    document.getElementById("category").value = "";
    let rootDiv = document.getElementById("rootDiv");
    //Delete rootDiv if it exists
    if(rootDiv!=null){
        let searchSectionBoxDiv = document.getElementById("searchSectionBox");
        searchSectionBoxDiv.removeChild(rootDiv);
    }
}



function activateWindow(id){
    let homeSection = document.getElementById("homeSection");
    let searchSection = document.getElementById("searchSectionBox");
    //Check if id clicked is already active
    if(!document.getElementById(id).classList.contains("active")){
        //Check if id clicked is home. 
        if(id==="home"){
            //If yes, check if homesection has hide
            if(homeSection.classList.contains("hide")){
                //If yes, toggle homesection. Else, do nothing
                homeSection.classList.toggle("hide");
                //toggle search section
                searchSection.classList.toggle("hide");
                
            }
            //Make home menu active and search menu not active
            document.getElementById("home").classList.toggle("active");
            document.getElementById("search").classList.toggle("active");
        }
        //else, id clicked is search
        else{
            //Check if searchSection has hide
            if(searchSection.classList.contains("hide")){
                //If yes, toggle searchSection.Else, do nothing
                searchSection.classList.toggle("hide");
                //toggle home section
                homeSection.classList.toggle("hide");
            }
            //Make search menu active and home menu not active
            document.getElementById("search").classList.toggle("active");
            document.getElementById("home").classList.toggle("active");
        }
    }
}

function defaultHome(){
    console.log("home");
}