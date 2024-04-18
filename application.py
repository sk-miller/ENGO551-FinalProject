import os
from flask import Flask, session, request, render_template, redirect, url_for, jsonify
from flask_session import Session
from sqlalchemy import create_engine, text
from sqlalchemy.orm import scoped_session, sessionmaker
import requests

app = Flask(__name__)

# Check for environment variable
if not os.getenv("DATABASE_URL"):
    raise RuntimeError("DATABASE_URL is not set")

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app) # I need to make sure that I have a session going so that I can have active usernames. 

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine)) # This loads the connection to my database


@app.route("/signup", methods = ['GET','POST']) # I need the get and post because users will need to add info
def signup():
    if request.method =='POST':
        username = request.form.get('username') # I need one username
        password1 = request.form.get('password1') # I need to get two passwords that need to match
        password2 = request.form.get('password2')
        stravauser = request.form.get('stravauser')
        stravapass = request.form.get('stravapass')
        if password1 != password2:
            return render_template('signup.html', message = "Password did not match.") # The message goes to the message in the html
        try:

            user = db.execute(text("INSERT into users (username, password, stravauser, stravapass) values (:username, :password, :stravauser, :stravapass)"), {'username':username, 'password':password1, 'stravauser' :stravauser, 'stravapass' :stravapass})
            db.commit() # I need to add the new info to the database so that they can log in again.
            session['logged_in'] = True
            session['username'] = username
            return redirect(url_for("index"))
        
        except:
            return render_template('signup.html', message = "Username already exists, please try another") # If you try and insert a username again then it won't work.
        

    return render_template('signup.html')

@app.route("/login", methods = ['GET', 'POST']) # This page will have input and output
def login():
    if request.method == 'POST': # This is the section about when the user wants to add information to the database
        username = request.form.get('username') # I need to get the username and password from the user. Then I add this information to the database.
        password = request.form.get('password')
        user = db.execute(text("select * from users where username = :username and password = :password;"), {'username':username, 'password':password})
        if user.rowcount == 0: # This happens if there is no database entry where the usernames and database match the same id number.
            return render_template('loginerror.html')
        session['logged_in']=True # The website changes when a user is logged in
        session['username'] = request.form['username'] # I need this so that I can make sure that a user can't add a new review for the same book 
        return redirect(url_for("index")) # This is the main page
    
    return render_template('login.html') 


@app.route("/")
def index():
    return render_template('index.html') 

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index")) # I need logout functionality so that the user can end the session.

    #In order to run the code type python -m flask run in the command line
    # run this first at the beginning of the session  $env:FLASK_APP = "application.py"
    # In order to run the server, you must download node.js, and run server.js using this method. Make sure that the ports match between the server.js and index.js files.