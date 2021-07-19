from flask import Flask,request
from flask_cors import CORS



app = Flask(__name__)
CORS(app)
import requests
import json

@app.route("/")
def root():
    # # return "HELLO!!"
    # print("Executing /")
    return app.send_static_file("index.html")

@app.route("/trending")
def getTrending():
    # print("Get Trending")
    data = requests.get('https://api.themoviedb.org/3/trending/movie/week?api_key=528c7719235e9afc46cfb2d2a23bb56a').content

    response = app.response_class(
        response = data,
        status = 200,
        mimetype= 'application/json'
    )
    
    return response

@app.route("/airing")
def getAiring():
    # print("Get Airing Today")
    data = requests.get('https://api.themoviedb.org/3/tv/airing_today?api_key=528c7719235e9afc46cfb2d2a23bb56a').content

    response = app.response_class(
        response = data,
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route("/searchMovies")
def getSearchMovieResults():
    # print("search Movies")
    query = request.args.get('query')
    url = "https://api.themoviedb.org/3/search/movie?api_key=528c7719235e9afc46cfb2d2a23bb56a&language=en-US&query=" + query + "&page=1&include_adult=false"
    data = requests.get(url).content

    response = app.response_class(
        response = data,
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route("/searchTv")
def getSearchTvShowResults():
    # print("search Tv")
    query = request.args.get('query')
    url = "https://api.themoviedb.org/3/search/tv?api_key=528c7719235e9afc46cfb2d2a23bb56a&language=en-US&query=" + query + "&page=1&include_adult=false"
    data = requests.get(url).content

    response = app.response_class(
        response = data,
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route("/searchMoviesTv")
def getSearchMovieAndTvShowResults():
    query = request.args.get('query')
    url = "https://api.themoviedb.org/3/search/multi?api_key=528c7719235e9afc46cfb2d2a23bb56a&language=en-US&query=" + query + "&page=1&include_adult=false"
    data = requests.get(url).content

    response = app.response_class(
        response = data,
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route("/getMovieGenres")
def getMoveGenres():
    data = requests.get('https://api.themoviedb.org/3/genre/movie/list?api_key=528c7719235e9afc46cfb2d2a23bb56a&language=en-US').content
    #Decode json bytes to json list type
    json_data = json.loads(data)
    genreDict = {}
    genreIdNameList = json_data["genres"]
    for i in range(len(genreIdNameList)):
        currentGenreDict = genreIdNameList[i]
        #Add id and name to genreDict
        genreDict[currentGenreDict["id"]] = currentGenreDict["name"]
    #Encode back to json bytes type
    genreDict = json.dumps(genreDict)
    response = app.response_class(
        response = genreDict,
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route("/getTvGenres")
def getTvGenres():
    data = requests.get('https://api.themoviedb.org/3/genre/tv/list?api_key=528c7719235e9afc46cfb2d2a23bb56a&language=en-US').content
    #Decode json bytes to json list type
    json_data = json.loads(data)
    genreDict = {}
    genreIdNameList = json_data["genres"]
    for i in range(len(genreIdNameList)):
        currentGenreDict = genreIdNameList[i]
        #Add id and name to genreDict
        genreDict[currentGenreDict["id"]] = currentGenreDict["name"]
    #Encode back to json bytes type
    genreDict = json.dumps(genreDict)
    response = app.response_class(
        response = genreDict,
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route("/getMovieDetails")
def getMovieDetails():
    movieId = request.args.get('movieId')
    url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=528c7719235e9afc46cfb2d2a23bb56a&language=en-US"
    data = requests.get(url).content

    response = app.response_class(
        response = data,
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route("/getTvDetails")
def getTvDetails():
    tvId = request.args.get('tvId')
    url = "https://api.themoviedb.org/3/tv/" + tvId + "?api_key=528c7719235e9afc46cfb2d2a23bb56a&language=en-US"
    data = requests.get(url).content

    response = app.response_class(
        response = data,
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route("/getMovieCredits")
def getMovieCredits():
    movieId = request.args.get('movieId')
    url = "https://api.themoviedb.org/3/movie/" + movieId + "/credits?api_key=528c7719235e9afc46cfb2d2a23bb56a&language=en-US"
    data = requests.get(url).content

    response = app.response_class(
        response = data,
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route("/getTvCredits")
def getTvCredits():
    tvId = request.args.get('tvId')
    url = "https://api.themoviedb.org/3/tv/" + tvId + "/credits?api_key=528c7719235e9afc46cfb2d2a23bb56a&language=en-US"
    data = requests.get(url).content

    response = app.response_class(
        response = data,
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route("/getMovieReviews")
def getMovieReviews():
    movieId = request.args.get('movieId')
    url = "https://api.themoviedb.org/3/movie/" + movieId + "/reviews?api_key=528c7719235e9afc46cfb2d2a23bb56a&language=en-US"
    data = requests.get(url).content

    response = app.response_class(
        response = data,
        status = 200,
        mimetype = 'application/json'
    )
    return response

@app.route("/getTvReviews")
def getTvReviews():
    tvId = request.args.get('tvId')
    url = "https://api.themoviedb.org/3/tv/" + tvId + "/reviews?api_key=528c7719235e9afc46cfb2d2a23bb56a&language=en-US"
    data = requests.get(url).content

    response = app.response_class(
        response = data,
        status = 200,
        mimetype = 'application/json'
    )
    return response
