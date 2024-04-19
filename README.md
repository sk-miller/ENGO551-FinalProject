# ENGO551-FinalProject

Thank you for looking at our final project for ENGO551 at the University of Calgary!

# Project: Public Facilities Map

This project is a web application that displays a map of public facilities in Calgary. The map includes various types of facilities such as drinking fountains, washrooms, doggie fountains, showers, park benches, and picnic tables. The data for these facilities is fetched from the Open Calgary API.

## Features

- **Interactive Map**: The map is interactive and allows users to zoom in and out and move around to explore different areas.
- **Custom Icons**: Each type of facility is represented by a custom icon on the map for easy identification.
- **Cluster Groups**: Facilities of the same type are grouped together into clusters to avoid overcrowding the map.
- **Spiderfier**: The Spiderfier feature is used to handle multiple facilities located at the exact same coordinates.
- **Dynamic Data Fetching**: Data for each type of facility is fetched dynamically from the Open Calgary API when the corresponding checkbox is checked.
- **User Authentication**: The application includes user authentication functionality, allowing users to sign up and log in.

## Files

- `Map.js`: This is the main JavaScript file that contains the logic for creating the map, fetching the data, and adding the facilities to the map.
- `stylesheet.css`: This file contains the CSS styles for the application.
- `index.html`: This is the main HTML file for the application. It includes the map and a menu for selecting which types of facilities to display.
- `login.html`: This HTML file provides a form for users to log in.
- `loginerror.html`: This HTML file is displayed when there is an error with the user login.
- `signup.html`: This HTML file provides a form for users to sign up.
- `application.py`: This is the main Python file for the Flask application. It handles user authentication and database operations.
- `import.py`: This Python file is used to create the user table in the database.
- `server.js`: This JavaScript file sets up the server for the application and handles the Strava OAuth process.

## Usage

UPDATE STEPS FOR USAGE

## Dependencies

This application uses the following libraries:

- Leaflet.js for creating the interactive map.
- Leaflet.markercluster for grouping facilities into clusters.
- OverlappingMarkerSpiderfier-Leaflet for handling overlapping markers.
- Mapbox Polyline for decoding polylines.
- Flask for the web application framework.
- SQLAlchemy for database operations.
- Express.js for setting up the server.
- Axios for making HTTP requests.
- Cors for handling Cross-Origin Resource Sharing.

## Note

This application is a school project and is not intended for use in a production environment.

It appears that there were no github commits last week, but this was because we were having difficulties logging in and pushing, so we had to use email for our version control. 

Here is an example of an email that was used.
![image](https://github.com/sk-miller/ENGO551-FinalProject/assets/72952297/80210c81-1bd2-48b0-90ca-5c38072aee70)



