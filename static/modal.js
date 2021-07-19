async function fetchMovieDetails(movieId){
    let url = "/getMovieDetails?movieId=" + movieId;
    //await and get promise 
    const response = await fetch(url);
    //Convert to json object
    const obj = await response.json();
    // waits until the request completes...
    return obj;
}

async function fetchTvDetails(tvId){
    let url = "/getTvDetails?tvId=" + tvId;
    //await and get promise 
    const response = await fetch(url);
    //Convert to json object
    const obj = await response.json();
    // waits until the request completes...
    return obj;
}

async function fetchMovieCredits(movieId){
    let url = "/getMovieCredits?movieId=" + movieId;
    //await and get promise 
    const response = await fetch(url);
    //Convert to json object
    const obj = await response.json();
    // waits until the request completes...
    return obj;
}

async function fetchTvCredits(tvId){
    let url = "/getTvCredits?tvId=" + tvId;
    //await and get promise 
    const response = await fetch(url);
    //Convert to json object
    const obj = await response.json();
    // waits until the request completes...
    return obj;
}

async function fetchMovieReviews(movieId){
    let url = "/getMovieReviews?movieId=" + movieId;
    //await and get promise 
    const response = await fetch(url);
    //Convert to json object
    const obj = await response.json();
    // waits until the request completes...
    return obj;
}

async function fetchTvReviews(tvId){
    let url = "/getTvReviews?tvId=" + tvId;
    //await and get promise 
    const response = await fetch(url);
    //Convert to json object
    const obj = await response.json();
    // waits until the request completes...
    return obj;
}

function showMore(resultId,movieId){
    //Get Modal
    window.modal = document.getElementsByClassName("modal")[resultId];
    window.modal.style.display = "block";

    //Execute Fetch movie details API
    fetchMovieDetails(movieId).then(
        function(data){
            //Retrieve modal content div
            let modalContentDiv = document.getElementById("modalContentDiv" + resultId);
            //Append elements in modal content div
                //Create backdrop image
            let img = document.createElement("img");
            if(data.backdrop_path!=null){
                //Image is not null
                let backdropPath = "https://image.tmdb.org/t/p/original" + data.backdrop_path;
                img.setAttribute("src",backdropPath);
            }
            else{
                //Image is null
                img.setAttribute("src","static/movie-placeholder.jpg");
            }
            img.classList.add("moreResultImage");
            modalContentDiv.appendChild(img);
            //Create resultDescriptionDiv
            let resultDescriptionDiv = document.createElement("div");
            resultDescriptionDiv.classList.add("resultDescriptionDiv");
            modalContentDiv.appendChild(resultDescriptionDiv);
                //Add header
            let header = document.createElement("h2");
            header.classList.add("h2ShowMore");
            let headerText = document.createTextNode(data.title);
            header.appendChild(headerText);
            resultDescriptionDiv.appendChild(header);
                //Add info symbol link
            let infoSymbolLink = document.createElement("a");
            infoSymbolLink.setAttribute("href","https://www.themoviedb.org/movie/"+movieId);
            infoSymbolLink.classList.add("infoSymbol");
            infoSymbolLink.setAttribute("target","_blank");
            infoSymbolLink.appendChild(document.createTextNode("ⓘ"));
            resultDescriptionDiv.appendChild(infoSymbolLink);
                //Add year and genres
            let resultP = document.createElement("p");
            resultP.classList.add("resultYearGenres");
            let yearGenreText = "";
                //Year
            yearGenreText = yearGenreText + data.release_date.substring(0,4);
                //Genre list
            let genreListIdNames = data.genres
                //Check if genre list is not empty
            if(genreListIdNames.length!=0){
                if(yearGenreText){
                    yearGenreText += " | ";
                }
                let genreList = [];
                let genreDictPromise = fetchMoveGenres();
                genreDictPromise.then(
                    function(genreDict){
                        //Iterate through each genre id in genreListIdNames
                        for(let j=0;j<genreListIdNames.length;j++){
                            let currentGenreId = genreListIdNames[j].id;
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
            resultDescriptionDiv.appendChild(resultP);
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
            let voteAverage = " " + (data.vote_average/2) + "/5";
            voteAvergeSpan.appendChild(document.createTextNode(voteAverage));
            voteAvergeSpan.classList.add("starText");
                //Create vote count
            let voteCountSpan = document.createElement("span");
            voteCountSpan.classList.add("voteCount");
            let voteCountText = " " + data.vote_count + " votes";
            voteCountSpan.appendChild(document.createTextNode(voteCountText));     
            
            resultDescriptionDiv.appendChild(starSpan);
            resultDescriptionDiv.appendChild(voteAvergeSpan);
            resultDescriptionDiv.appendChild(voteCountSpan);

                //Add movie description
                //Create subparent div to add movie description
            let resultMovieDescriptionDiv = document.createElement("div");
            resultMovieDescriptionDiv.classList.add("resultMoveDescriptionDiv");
            let resultDescriptionText = data.overview;
            resultMovieDescriptionDiv.appendChild(document.createTextNode(resultDescriptionText));
            resultDescriptionDiv.appendChild(resultMovieDescriptionDiv);

                //Add Spoken languages
            let spokenLanguagesP = document.createElement("p");
            spokenLanguagesP.classList.add("spokenLanguages");
            let spokenLanguagesText = "Spoken languages: ";
            let spokenLanguagesRecordList = data.spoken_languages;
                //Check if spokenLanguagesRecordList is not null
            if(spokenLanguagesRecordList!=null){
                //Iterate through each record and add it to tempLangList
                let tempLangList = [];
                for(let i=0;i<spokenLanguagesRecordList.length;i++){
                    tempLangList.push(spokenLanguagesRecordList[i].english_name);
                }
                //Iterate through each record of tempLangList before last is reached
                for(let i=0;i<tempLangList.length-1;i++){
                    spokenLanguagesText += tempLangList[i] + ", ";
                }
                //Add last language
                spokenLanguagesText += tempLangList[tempLangList.length-1];
            }
            else{
                spokenLanguagesText += "N/A";
            }
            spokenLanguagesP.appendChild(document.createTextNode(spokenLanguagesText));
            resultDescriptionDiv.appendChild(spokenLanguagesP);

            //Create Cast p
            let pElement = document.createElement("p");
            pElement.appendChild(document.createTextNode("Cast"));
            pElement.classList.add("pElement");
            resultDescriptionDiv.appendChild(pElement);

            //Create castParentGrid
            let castParentGrid = document.createElement("div");
            castParentGrid.classList.add("castParentGrid");
            resultDescriptionDiv.appendChild(castParentGrid);

            //Create castDiv for each cast - At most 8
            fetchMovieCredits(movieId).then(
                function(dataCredits){
                    let castList = dataCredits.cast;
                    for(let k=0;k<castList.length;k++){
                        if(k===8){
                            break;
                        }
                        //Create castDiv
                        let castDiv = document.createElement("div");
                        castDiv.classList.add("castDiv");
                        resultDescriptionDiv.appendChild(castDiv);
                        //Create image
                        let castImage = document.createElement("img");
                        if(castList[k].profile_path!=null){
                            let currentCastPic = "https://image.tmdb.org/t/p/original" + castList[k].profile_path;
                            castImage.setAttribute("src",currentCastPic);
                        }
                        else{
                            castImage.setAttribute("src","static/person-placeholder.png");
                        }
                        castImage.classList.add("castImage");
                        castDiv.appendChild(castImage);

                        //Create cast description div
                        let castDescriptionDiv = document.createElement("div");
                        castDescriptionDiv.classList.add("castDescriptionDiv");
                        castDiv.appendChild(castDescriptionDiv);
                            //Add cast Name
                        let castNameP = document.createElement("p");
                        castNameP.classList.add("castNameP");
                        castNameP.appendChild(document.createTextNode(castList[k].name));
                        castDescriptionDiv.appendChild(castNameP);
                            //AS
                        let castNameP2 = document.createElement("p");
                        castNameP2.classList.add("castNameP2");
                        castNameP2.appendChild(document.createTextNode("AS"));
                        castDescriptionDiv.appendChild(castNameP2);
                            //Cast Character name
                        let castNameP3 = document.createElement("p");
                        castNameP3.classList.add("castNameP2");
                        castNameP3.appendChild(document.createTextNode(castList[k].character));                       
                        castDescriptionDiv.appendChild(castNameP3);

                        castParentGrid.appendChild(castDiv);
                    }
                }
            );

            //Create Reviews
            let pReviewsElement = document.createElement("p");
            pReviewsElement.appendChild(document.createTextNode("Reviews"));
            pReviewsElement.classList.add("pReviewsElement");
            resultDescriptionDiv.appendChild(pReviewsElement);

            fetchMovieReviews(movieId).then(
                function(reviews){
                    let reviewResultsList = reviews.results;
                    if(reviewResultsList.length!=0){
                        for(let r=0;r<reviewResultsList.length;r++){
                            if(r===5){
                                //At most 5 reviews
                                break;
                            }
                            //Create review div
                            let reviewDiv = document.createElement("div");
                            reviewDiv.classList.add("reviewDiv");
                            let username = reviewResultsList[r].author_details.username;
                            let createdAt = "" + reviewResultsList[r].created_at.substring(5,7) + "/" + reviewResultsList[r].created_at.substring(8,10) + "/" + reviewResultsList[r].created_at.substring(0,4);
                            let usernameSpan = document.createElement("span");
                            usernameSpan.classList.add("usernameSpan");
                            usernameSpan.appendChild(document.createTextNode(username));
                            reviewDiv.appendChild(usernameSpan);
                            let onCreatedAtSpan = document.createElement("span");
                            onCreatedAtSpan.classList.add("onCreatedAtSpan");
                            onCreatedAtSpan.appendChild(document.createTextNode(" on " + createdAt));
                            let userNameOnCreatedAtDiv = document.createElement("div");
                            userNameOnCreatedAtDiv.classList.add("userNameOnCreatedAtDiv");
                            userNameOnCreatedAtDiv.appendChild(usernameSpan);
                            userNameOnCreatedAtDiv.appendChild(onCreatedAtSpan);
                            reviewDiv.appendChild(userNameOnCreatedAtDiv);
                            
                            //review rating if any
                            if(reviewResultsList[r].author_details.rating!=null){
                                //Create div for rating
                                let ratingDiv = document.createElement("div");
                                ratingDiv.classList.add("ratingDiv");
                                reviewDiv.appendChild(ratingDiv);
                                let starReviewSpan = document.createElement("span");
                                starReviewSpan.classList.add("star");
                                starReviewSpan.appendChild(document.createTextNode("★"));
                                //Create vote average
                                let voteReviewAvergeSpan = document.createElement("span");
                                let voteReviewAvergeText = " " + (reviewResultsList[r].author_details.rating/2) + "/5";
                                voteReviewAvergeSpan.appendChild(document.createTextNode(voteReviewAvergeText));
                                voteReviewAvergeSpan.classList.add("starText");
                                ratingDiv.appendChild(starReviewSpan);
                                ratingDiv.appendChild(voteReviewAvergeSpan);
                            }
                            //review description
                            let reviewDescriptionP = document.createElement("p");
                            reviewDescriptionP.classList.add("reviewDescriptionP");
                            reviewDescriptionP.appendChild(document.createTextNode(reviewResultsList[r].content));
                            reviewDiv.appendChild(reviewDescriptionP);
                            //Append child to parent result div
                            resultDescriptionDiv.appendChild(reviewDiv);
                        }
                    }
                    else{
                        //No reviews
                        let noReviewsP = document.createElement("p");
                        noReviewsP.appendChild(document.createTextNode("N/A"));
                        resultDescriptionDiv.appendChild(noReviewsP);
                    }
                }
            );
        }
    );

}

function showMoreTv(resultId,tvId){
    //Get Modal
    window.modal = document.getElementsByClassName("modal")[resultId];
    window.modal.style.display = "block";

    //Execute Fetch Tv details API
    fetchTvDetails(tvId).then(
        function(data){
            //Retrieve modal content div
            let modalContentDiv = document.getElementById("modalContentDiv" + resultId);
            //Append elements in modal content div
                //Create backdrop image
            let img = document.createElement("img");
            if(data.backdrop_path!=null){
                //Image is not null
                let backdropPath = "https://image.tmdb.org/t/p/original" + data.backdrop_path;
                img.setAttribute("src",backdropPath);
            }
            else{
                //Image is null
                img.setAttribute("src","static/movie-placeholder.jpg");
            }
            img.classList.add("moreResultImage");
            modalContentDiv.appendChild(img);
            //Create resultDescriptionDiv
            let resultDescriptionDiv = document.createElement("div");
            resultDescriptionDiv.classList.add("resultDescriptionDiv");
            modalContentDiv.appendChild(resultDescriptionDiv);
                //Add header
            let header = document.createElement("h2");
            header.classList.add("h2ShowMore");
            let headerText = document.createTextNode(data.name);
            header.appendChild(headerText);
            resultDescriptionDiv.appendChild(header);
                //Add info symbol link
            let infoSymbolLink = document.createElement("a");
            infoSymbolLink.setAttribute("href","https://www.themoviedb.org/tv/"+tvId);
            infoSymbolLink.classList.add("infoSymbol");
            infoSymbolLink.setAttribute("target","_blank");
            infoSymbolLink.appendChild(document.createTextNode("ⓘ"));
            resultDescriptionDiv.appendChild(infoSymbolLink);
                //Add year and genres
            let resultP = document.createElement("p");
            resultP.classList.add("resultYearGenres");
            let yearGenreText = "";
                //Year
            if(data.first_air_date!=null){
                yearGenreText = yearGenreText + data.first_air_date.substring(0,4);
            }
                //Genre list
            let genreListIdNames = data.genres
                //Check if genre list is not empty
            if(genreListIdNames.length!=0){
                if(yearGenreText){
                    yearGenreText += " | ";
                }
                let genreList = [];
                let genreDictPromise = fetchTvGenres();
                genreDictPromise.then(
                    function(genreDict){
                        //Iterate through each genre id in genreListIdNames
                        for(let j=0;j<genreListIdNames.length;j++){
                            let currentGenreId = genreListIdNames[j].id;
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
            resultDescriptionDiv.appendChild(resultP);
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
            let voteAverage = " " + (data.vote_average/2) + "/5";
            voteAvergeSpan.appendChild(document.createTextNode(voteAverage));
            voteAvergeSpan.classList.add("starText");
                //Create vote count
            let voteCountSpan = document.createElement("span");
            voteCountSpan.classList.add("voteCount");
            let voteCountText = " " + data.vote_count + " votes";
            voteCountSpan.appendChild(document.createTextNode(voteCountText));     
            
            resultDescriptionDiv.appendChild(starSpan);
            resultDescriptionDiv.appendChild(voteAvergeSpan);
            resultDescriptionDiv.appendChild(voteCountSpan);

                //Add movie description
                //Create subparent div to add movie description
            let resultMovieDescriptionDiv = document.createElement("div");
            resultMovieDescriptionDiv.classList.add("resultMoveDescriptionDiv");
            let resultDescriptionText = data.overview;
            resultMovieDescriptionDiv.appendChild(document.createTextNode(resultDescriptionText));
            resultDescriptionDiv.appendChild(resultMovieDescriptionDiv);

                //Add Spoken languages
            let spokenLanguagesP = document.createElement("p");
            spokenLanguagesP.classList.add("spokenLanguages");
            let spokenLanguagesText = "Spoken languages: ";
            let spokenLanguagesRecordList = data.spoken_languages;
                //Check if spokenLanguagesRecordList is not null
            if(spokenLanguagesRecordList!=null){
                //Iterate through each record and add it to tempLangList
                let tempLangList = [];
                for(let i=0;i<spokenLanguagesRecordList.length;i++){
                    tempLangList.push(spokenLanguagesRecordList[i].english_name);
                }
                //Iterate through each record of tempLangList before last is reached
                for(let i=0;i<tempLangList.length-1;i++){
                    spokenLanguagesText += tempLangList[i] + ", ";
                }
                //Add last language
                spokenLanguagesText += tempLangList[tempLangList.length-1];
            }
            else{
                spokenLanguagesText += "N/A";
            }
            spokenLanguagesP.appendChild(document.createTextNode(spokenLanguagesText));
            resultDescriptionDiv.appendChild(spokenLanguagesP);

            //Create Cast p
            let pElement = document.createElement("p");
            pElement.appendChild(document.createTextNode("Cast"));
            pElement.classList.add("pElement");
            resultDescriptionDiv.appendChild(pElement);

            //Create castParentGrid
            let castParentGrid = document.createElement("div");
            castParentGrid.classList.add("castParentGrid");
            resultDescriptionDiv.appendChild(castParentGrid);

            //Create castDiv for each cast - At most 8
            fetchTvCredits(tvId).then(
                function(dataCredits){
                    let castList = dataCredits.cast;
                    for(let k=0;k<castList.length;k++){
                        if(k===8){
                            break;
                        }
                        //Create castDiv
                        let castDiv = document.createElement("div");
                        castDiv.classList.add("castDiv");
                        resultDescriptionDiv.appendChild(castDiv);
                        //Create image
                        let castImage = document.createElement("img");
                        
                        if(castList[k].profile_path!=null){
                            let currentCastPic = "https://image.tmdb.org/t/p/original" + castList[k].profile_path;
                            castImage.setAttribute("src",currentCastPic);
                        }
                        else{
                            castImage.setAttribute("src","static/person-placeholder.png");
                        }
                        castImage.classList.add("castImage");
                        castDiv.appendChild(castImage);

                        //Create cast description div
                        let castDescriptionDiv = document.createElement("div");
                        castDescriptionDiv.classList.add("castDescriptionDiv");
                        castDiv.appendChild(castDescriptionDiv);
                            //Add cast Name
                        let castNameP = document.createElement("p");
                        castNameP.classList.add("castNameP");
                        castNameP.appendChild(document.createTextNode(castList[k].name));
                        castDescriptionDiv.appendChild(castNameP);
                            //AS
                        let castNameP2 = document.createElement("p");
                        castNameP2.classList.add("castNameP2");
                        castNameP2.appendChild(document.createTextNode("AS"));
                        castDescriptionDiv.appendChild(castNameP2);
                            //Cast Character name
                        let castNameP3 = document.createElement("p");
                        castNameP3.classList.add("castNameP2");
                        castNameP3.appendChild(document.createTextNode(castList[k].character));                       
                        castDescriptionDiv.appendChild(castNameP3);

                        castParentGrid.appendChild(castDiv);
                    }
                }
            );
            //Create Reviews
            let pReviewsElement = document.createElement("p");
            pReviewsElement.appendChild(document.createTextNode("Reviews"));
            pReviewsElement.classList.add("pReviewsElement");
            resultDescriptionDiv.appendChild(pReviewsElement);

            fetchTvReviews(tvId).then(
                function(reviews){
                    let reviewResultsList = reviews.results;
                    if(reviewResultsList.length!=0){
                        for(let r=0;r<reviewResultsList.length;r++){
                            if(r===5){
                                //At most 5 reviews
                                break;
                            }
                            //Create review div
                            let reviewDiv = document.createElement("div");
                            reviewDiv.classList.add("reviewDiv");
                            let username = reviewResultsList[r].author_details.username;
                            let createdAt = "" + reviewResultsList[r].created_at.substring(5,7) + "/" + reviewResultsList[r].created_at.substring(8,10) + "/" + reviewResultsList[r].created_at.substring(0,4);
                            let usernameSpan = document.createElement("span");
                            usernameSpan.classList.add("usernameSpan");
                            usernameSpan.appendChild(document.createTextNode(username));
                            reviewDiv.appendChild(usernameSpan);
                            let onCreatedAtSpan = document.createElement("span");
                            onCreatedAtSpan.classList.add("onCreatedAtSpan");
                            onCreatedAtSpan.appendChild(document.createTextNode(" on " + createdAt));
                            let userNameOnCreatedAtDiv = document.createElement("div");
                            userNameOnCreatedAtDiv.classList.add("userNameOnCreatedAtDiv");
                            userNameOnCreatedAtDiv.appendChild(usernameSpan);
                            userNameOnCreatedAtDiv.appendChild(onCreatedAtSpan);
                            reviewDiv.appendChild(userNameOnCreatedAtDiv);
                            
                            //review rating if any
                            if(reviewResultsList[r].author_details.rating!=null){
                                //Create div for rating
                                let ratingDiv = document.createElement("div");
                                ratingDiv.classList.add("ratingDiv");
                                reviewDiv.appendChild(ratingDiv);
                                let starReviewSpan = document.createElement("span");
                                starReviewSpan.classList.add("star");
                                starReviewSpan.appendChild(document.createTextNode("★"));
                                //Create vote average
                                let voteReviewAvergeSpan = document.createElement("span");
                                let voteReviewAvergeText = " " + (reviewResultsList[r].author_details.rating/2) + "/5";
                                voteReviewAvergeSpan.appendChild(document.createTextNode(voteReviewAvergeText));
                                voteReviewAvergeSpan.classList.add("starText");
                                ratingDiv.appendChild(starReviewSpan);
                                ratingDiv.appendChild(voteReviewAvergeSpan);
                            }
                            //review description
                            let reviewDescriptionP = document.createElement("p");
                            reviewDescriptionP.classList.add("reviewDescriptionP");
                            reviewDescriptionP.appendChild(document.createTextNode(reviewResultsList[r].content));
                            reviewDiv.appendChild(reviewDescriptionP);
                            //Append child to parent result div
                            resultDescriptionDiv.appendChild(reviewDiv);
                        }
                    }
                    else{
                        //No reviews
                        let noReviewsP = document.createElement("p");
                        noReviewsP.appendChild(document.createTextNode("N/A"));
                        resultDescriptionDiv.appendChild(noReviewsP);
                    }                   
                }
            );
        }
    );

}

function showMoreMovieTv(resultId,movieTvId,mediaType){
    //Get Modal
    window.modal = document.getElementsByClassName("modal")[resultId];
    window.modal.style.display = "block";

    let fetchDetailsPromise = null;
    if(mediaType==="movie"){
        fetchDetailsPromise = fetchMovieDetails(movieTvId);
    }
    else{
        fetchDetailsPromise = fetchTvDetails(movieTvId);
    }

    //Execute Fetch movie details API
    fetchDetailsPromise.then(
        function(data){
            //Retrieve modal content div
            let modalContentDiv = document.getElementById("modalContentDiv" + resultId);
            //Append elements in modal content div
                //Create backdrop image
            let img = document.createElement("img");
            if(data.backdrop_path!=null){
                //Image is not null
                let backdropPath = "https://image.tmdb.org/t/p/original" + data.backdrop_path;
                img.setAttribute("src",backdropPath);
            }
            else{
                //Image is null
                img.setAttribute("src","static/movie-placeholder.jpg");
            }
            img.classList.add("moreResultImage");
            modalContentDiv.appendChild(img);
            //Create resultDescriptionDiv
            let resultDescriptionDiv = document.createElement("div");
            resultDescriptionDiv.classList.add("resultDescriptionDiv");
            modalContentDiv.appendChild(resultDescriptionDiv);
                //Add header
            let header = document.createElement("h2");
            header.classList.add("h2ShowMore");
            let headerText = document.createTextNode(data.title);
            header.appendChild(headerText);
            resultDescriptionDiv.appendChild(header);
                //Add info symbol link
            let infoSymbolLink = document.createElement("a");
            if(mediaType==="movie"){
                infoSymbolLink.setAttribute("href","https://www.themoviedb.org/movie/"+movieTvId);
            }
            else{
                infoSymbolLink.setAttribute("href","https://www.themoviedb.org/tv/"+movieTvId);
            }

            infoSymbolLink.classList.add("infoSymbol");
            infoSymbolLink.setAttribute("target","_blank");
            infoSymbolLink.appendChild(document.createTextNode("ⓘ"));
            resultDescriptionDiv.appendChild(infoSymbolLink);
                //Add year and genres
            let resultP = document.createElement("p");
            resultP.classList.add("resultYearGenres");
            let yearGenreText = "";
                //Year
            if(data.release_date!=null){
                if(mediaType==="movie"){
                    yearGenreText = yearGenreText + data.release_date.substring(0,4);
                }
                else{
                    yearGenreText = yearGenreText + data.first_air_date.substring(0,4);
                }
            }
                //Genre list
            let genreListIdNames = data.genres
                //Check if genre list is not empty
            if(genreListIdNames.length!=0){
                if(yearGenreText){
                    yearGenreText += " | ";
                }
                let genreList = [];
                let genreDictPromise = null;
                if(mediaType==="movie"){
                    genreDictPromise = fetchMoveGenres();
                }
                else{
                    genreDictPromise = fetchTvGenres();
                }
                genreDictPromise.then(
                    function(genreDict){
                        //Iterate through each genre id in genreListIdNames
                        for(let j=0;j<genreListIdNames.length;j++){
                            let currentGenreId = genreListIdNames[j].id;
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
            resultDescriptionDiv.appendChild(resultP);
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
            let voteAverage = " " + (data.vote_average/2) + "/5";
            voteAvergeSpan.appendChild(document.createTextNode(voteAverage));
            voteAvergeSpan.classList.add("starText");
                //Create vote count
            let voteCountSpan = document.createElement("span");
            voteCountSpan.classList.add("voteCount");
            let voteCountText = " " + data.vote_count + " votes";
            voteCountSpan.appendChild(document.createTextNode(voteCountText));     
            
            resultDescriptionDiv.appendChild(starSpan);
            resultDescriptionDiv.appendChild(voteAvergeSpan);
            resultDescriptionDiv.appendChild(voteCountSpan);

                //Add movie description
                //Create subparent div to add movie description
            let resultMovieDescriptionDiv = document.createElement("div");
            resultMovieDescriptionDiv.classList.add("resultMoveDescriptionDiv");
            let resultDescriptionText = data.overview;
            resultMovieDescriptionDiv.appendChild(document.createTextNode(resultDescriptionText));
            resultDescriptionDiv.appendChild(resultMovieDescriptionDiv);

                //Add Spoken languages
            let spokenLanguagesP = document.createElement("p");
            spokenLanguagesP.classList.add("spokenLanguages");
            let spokenLanguagesText = "Spoken languages: ";
            let spokenLanguagesRecordList = data.spoken_languages;
                //Check if spokenLanguagesRecordList is not null
            if(spokenLanguagesRecordList!=null){
                //Iterate through each record and add it to tempLangList
                let tempLangList = [];
                for(let i=0;i<spokenLanguagesRecordList.length;i++){
                    tempLangList.push(spokenLanguagesRecordList[i].english_name);
                }
                //Iterate through each record of tempLangList before last is reached
                for(let i=0;i<tempLangList.length-1;i++){
                    spokenLanguagesText += tempLangList[i] + ", ";
                }
                //Add last language
                spokenLanguagesText += tempLangList[tempLangList.length-1];
            }
            else{
                spokenLanguagesText += "N/A";
            }
            spokenLanguagesP.appendChild(document.createTextNode(spokenLanguagesText));
            resultDescriptionDiv.appendChild(spokenLanguagesP);

            //Create Cast p
            let pElement = document.createElement("p");
            pElement.appendChild(document.createTextNode("Cast"));
            pElement.classList.add("pElement");
            resultDescriptionDiv.appendChild(pElement);

            //Create castParentGrid
            let castParentGrid = document.createElement("div");
            castParentGrid.classList.add("castParentGrid");
            resultDescriptionDiv.appendChild(castParentGrid);

            let fetchCreditsPromise = null;
            if(mediaType==="movie"){
                fetchCreditsPromise = fetchMovieCredits(movieTvId);
            }
            else{
                fetchCreditsPromise = fetchTvCredits(movieTvId);
            }
            //Create castDiv for each cast - At most 8
            fetchCreditsPromise.then(
                function(dataCredits){
                    let castList = dataCredits.cast;
                    for(let k=0;k<castList.length;k++){
                        if(k===8){
                            break;
                        }
                        //Create castDiv
                        let castDiv = document.createElement("div");
                        castDiv.classList.add("castDiv");
                        resultDescriptionDiv.appendChild(castDiv);
                        //Create image
                        let castImage = document.createElement("img");
                        if(castList[k].profile_path!=null){
                            let currentCastPic = "https://image.tmdb.org/t/p/original" + castList[k].profile_path;
                            castImage.setAttribute("src",currentCastPic);
                        }
                        else{
                            castImage.setAttribute("src","static/person-placeholder.png");
                        }
                        castImage.classList.add("castImage");
                        castDiv.appendChild(castImage);

                        //Create cast description div
                        let castDescriptionDiv = document.createElement("div");
                        castDescriptionDiv.classList.add("castDescriptionDiv");
                        castDiv.appendChild(castDescriptionDiv);
                            //Add cast Name
                        let castNameP = document.createElement("p");
                        castNameP.classList.add("castNameP");
                        castNameP.appendChild(document.createTextNode(castList[k].name));
                        castDescriptionDiv.appendChild(castNameP);
                            //AS
                        let castNameP2 = document.createElement("p");
                        castNameP2.classList.add("castNameP2");
                        castNameP2.appendChild(document.createTextNode("AS"));
                        castDescriptionDiv.appendChild(castNameP2);
                            //Cast Character name
                        let castNameP3 = document.createElement("p");
                        castNameP3.classList.add("castNameP2");
                        castNameP3.appendChild(document.createTextNode(castList[k].character));                       
                        castDescriptionDiv.appendChild(castNameP3);

                        castParentGrid.appendChild(castDiv);
                    }
                }
            );
            //Create Reviews
            let pReviewsElement = document.createElement("p");
            pReviewsElement.appendChild(document.createTextNode("Reviews"));
            pReviewsElement.classList.add("pReviewsElement");
            resultDescriptionDiv.appendChild(pReviewsElement);
            if(mediaType==="movie"){
                fetchMovieReviews(movieTvId).then(
                    function(reviews){
                        let reviewResultsList = reviews.results;
                        if(reviewResultsList.length!=0){
                            for(let r=0;r<reviewResultsList.length;r++){
                                if(r===5){
                                    //At most 5 reviews
                                    break;
                                }
                                //Create review div
                                let reviewDiv = document.createElement("div");
                                reviewDiv.classList.add("reviewDiv");
                                let username = reviewResultsList[r].author_details.username;
                                let createdAt = "" + reviewResultsList[r].created_at.substring(5,7) + "/" + reviewResultsList[r].created_at.substring(8,10) + "/" + reviewResultsList[r].created_at.substring(0,4);
                                let usernameSpan = document.createElement("span");
                                usernameSpan.classList.add("usernameSpan");
                                usernameSpan.appendChild(document.createTextNode(username));
                                reviewDiv.appendChild(usernameSpan);
                                let onCreatedAtSpan = document.createElement("span");
                                onCreatedAtSpan.classList.add("onCreatedAtSpan");
                                onCreatedAtSpan.appendChild(document.createTextNode(" on " + createdAt));
                                let userNameOnCreatedAtDiv = document.createElement("div");
                                userNameOnCreatedAtDiv.classList.add("userNameOnCreatedAtDiv");
                                userNameOnCreatedAtDiv.appendChild(usernameSpan);
                                userNameOnCreatedAtDiv.appendChild(onCreatedAtSpan);
                                reviewDiv.appendChild(userNameOnCreatedAtDiv);
                                
                                //review rating if any
                                if(reviewResultsList[r].author_details.rating!=null){
                                    //Create div for rating
                                    let ratingDiv = document.createElement("div");
                                    ratingDiv.classList.add("ratingDiv");
                                    reviewDiv.appendChild(ratingDiv);
                                    let starReviewSpan = document.createElement("span");
                                    starReviewSpan.classList.add("star");
                                    starReviewSpan.appendChild(document.createTextNode("★"));
                                    //Create vote average
                                    let voteReviewAvergeSpan = document.createElement("span");
                                    let voteReviewAvergeText = " " + (reviewResultsList[r].author_details.rating/2) + "/5";
                                    voteReviewAvergeSpan.appendChild(document.createTextNode(voteReviewAvergeText));
                                    voteReviewAvergeSpan.classList.add("starText");
                                    ratingDiv.appendChild(starReviewSpan);
                                    ratingDiv.appendChild(voteReviewAvergeSpan);
                                }
                                //review description
                                let reviewDescriptionP = document.createElement("p");
                                reviewDescriptionP.classList.add("reviewDescriptionP");
                                reviewDescriptionP.appendChild(document.createTextNode(reviewResultsList[r].content));
                                reviewDiv.appendChild(reviewDescriptionP);
                                //Append child to parent result div
                                resultDescriptionDiv.appendChild(reviewDiv);
                            }
                        }
                        else{
                            //No reviews
                            let noReviewsP = document.createElement("p");
                            noReviewsP.appendChild(document.createTextNode("N/A"));
                            resultDescriptionDiv.appendChild(noReviewsP);
                        }
                    }
                );
            }
            else{
                fetchTvReviews(movieTvId).then(
                    function(reviews){
                        let reviewResultsList = reviews.results;
                        if(reviewResultsList.length!=0){
                            for(let r=0;r<reviewResultsList.length;r++){
                                if(r===5){
                                    //At most 5 reviews
                                    break;
                                }
                                //Create review div
                                let reviewDiv = document.createElement("div");
                                reviewDiv.classList.add("reviewDiv");
                                let username = reviewResultsList[r].author_details.username;
                                let createdAt = "" + reviewResultsList[r].created_at.substring(5,7) + "/" + reviewResultsList[r].created_at.substring(8,10) + "/" + reviewResultsList[r].created_at.substring(0,4);
                                let usernameSpan = document.createElement("span");
                                usernameSpan.classList.add("usernameSpan");
                                usernameSpan.appendChild(document.createTextNode(username));
                                reviewDiv.appendChild(usernameSpan);
                                let onCreatedAtSpan = document.createElement("span");
                                onCreatedAtSpan.classList.add("onCreatedAtSpan");
                                onCreatedAtSpan.appendChild(document.createTextNode(" on " + createdAt));
                                let userNameOnCreatedAtDiv = document.createElement("div");
                                userNameOnCreatedAtDiv.classList.add("userNameOnCreatedAtDiv");
                                userNameOnCreatedAtDiv.appendChild(usernameSpan);
                                userNameOnCreatedAtDiv.appendChild(onCreatedAtSpan);
                                reviewDiv.appendChild(userNameOnCreatedAtDiv);
                                
                                //review rating if any
                                if(reviewResultsList[r].author_details.rating!=null){
                                    //Create div for rating
                                    let ratingDiv = document.createElement("div");
                                    ratingDiv.classList.add("ratingDiv");
                                    reviewDiv.appendChild(ratingDiv);
                                    let starReviewSpan = document.createElement("span");
                                    starReviewSpan.classList.add("star");
                                    starReviewSpan.appendChild(document.createTextNode("★"));
                                    //Create vote average
                                    let voteReviewAvergeSpan = document.createElement("span");
                                    let voteReviewAvergeText = " " + (reviewResultsList[r].author_details.rating/2) + "/5";
                                    voteReviewAvergeSpan.appendChild(document.createTextNode(voteReviewAvergeText));
                                    voteReviewAvergeSpan.classList.add("starText");
                                    ratingDiv.appendChild(starReviewSpan);
                                    ratingDiv.appendChild(voteReviewAvergeSpan);
                                }
                                //review description
                                let reviewDescriptionP = document.createElement("p");
                                reviewDescriptionP.classList.add("reviewDescriptionP");
                                reviewDescriptionP.appendChild(document.createTextNode(reviewResultsList[r].content));
                                reviewDiv.appendChild(reviewDescriptionP);
                                //Append child to parent result div
                                resultDescriptionDiv.appendChild(reviewDiv);
                            }
                        }
                        else{
                            //No reviews
                            let noReviewsP = document.createElement("p");
                            noReviewsP.appendChild(document.createTextNode("N/A"));
                            resultDescriptionDiv.appendChild(noReviewsP);
                        }                   
                    }
                );
            }
        }
    );

}

function closeModal(resultId){
    window.modal = document.getElementsByClassName("modal")[resultId];
    window.modal.style.display = "none";
}

//Get Modal
// let modal = document.getElementById("resultModal");
// let modal = document.getElementsByClassName("modal")[0];
//Get button that opens the modal
// let button = document.getElementById("showMoreButton");
//Get <span> element that closes the modal
// let span = document.getElementById("closeSpan");

//Anonymous functions

// button.onclick = function(){
//     modal.style.display = "block";
// }

//Close modal when <span> is clicked
// span.onclick = function(){
//     modal.style.display = "none";
// }

//Close when anywhere outside modal is clicked
window.onclick = function(event){
    if(event.target == window.modal){
        window.modal.style.display = "none";
    }
}