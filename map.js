let map = L.map('map').setView([51.0447, -114.0719], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

//Custom icons for all facility types
let drinkingFountainIcon = L.icon({
    iconUrl: 'https://cdn.pixabay.com/photo/2021/11/06/05/24/water-fountain-sign-6772459_1280.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15], 
    popupAnchor: [0, -15]
});

let washroomIcon = L.icon({
    iconUrl: 'https://www.freeiconspng.com/thumbs/restroom-icon/man-and-women-restroom-icon-12.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15], 
    popupAnchor: [0, -15]
});

let doggieFountainIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/256/3822/3822732.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15], 
    popupAnchor: [0, -15]
});

let showersIcon = L.icon({
    iconUrl: 'https://www.clipartmax.com/png/middle/201-2012320_shower-facilities-shower-icon.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15], 
    popupAnchor: [0, -15]
});

let parkBenchesIcon = L.icon({
    iconUrl: 'https://www.pngall.com/wp-content/uploads/10/Park-Furniture-Silhouette-PNG.png',
    iconSize: [45, 30],
    iconAnchor: [15, 15], 
    popupAnchor: [0, -15]
});

let picnicTablesIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/4433/4433038.png',
    iconSize: [30, 30],
    iconAnchor: [15, 15], 
    popupAnchor: [0, -15]
});

//Cluster like master types
let markers = {
    'DRINKING FOUNTAIN': L.markerClusterGroup(),
    'WASHROOM': L.markerClusterGroup(),
    'DOGGIE FOUNTAIN': L.markerClusterGroup(),
    'SHOWER': L.markerClusterGroup(),
    'BENCH': L.markerClusterGroup(),
    'PICNIC TABLE': L.markerClusterGroup()
};

//Set default state of all markers to false
let assetState = {
    'DRINKING FOUNTAIN': false,
    'WASHROOM': false,
    'DOGGIE FOUNTAIN': false,
    'SHOWER': false,
    'BENCH': false,
    'PICNIC TABLE': false
};

//Use spiderfier for when multiple points have the same co-ordinates
let oms = new OverlappingMarkerSpiderfier(map);

//Grab data from Open Calgary API
function fetchData(assetType) {
    let url = `https://data.calgary.ca/resource/jjkg-kv4n.json?$where=asset_type='${assetType}'&$select=asset_type,location_d,life_cycle,maintained,detail,seasonalit,point`;

    if (assetType === 'SHOWER') {
        url = `https://data.calgary.ca/resource/jjkg-kv4n.json?$where=asset_type='SHOWER' OR asset_type='OUTDOOR SHOWER'&$select=asset_type,location_d,life_cycle,maintained,detail,seasonalit,point`;
    }

    if (assetType === 'BENCH') {
        url = `https://data.calgary.ca/resource/ikeb-n5bc.json?$where=type_description='MEMORIAL BENCH' OR type_description='PARKS BENCH'&$select=type_description,finish_type,orientation,maintained_by,life_cycle_status,point`;
    }

    if (assetType === 'PICNIC TABLE') {
        url = `https://data.calgary.ca/resource/ikeb-n5bc.json?$where=type_description='MEMORIAL PICNIC TABLE' OR type_description='PICNIC TABLE'&$select=type_description,finish_type,orientation,maintained_by,life_cycle_status,point`;
    }

    if (assetState[assetType]) {
        map.removeLayer(markers[assetType]);
        assetState[assetType] = false;
    } else {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                markers[assetType].clearLayers();

                if (Array.isArray(data)) {
                    data.forEach(feature => {
                        let marker;
                        if (assetType === 'DRINKING FOUNTAIN') {
                            marker = L.marker([feature.point.coordinates[1], feature.point.coordinates[0]], {icon: drinkingFountainIcon});
                        } else if (assetType === 'WASHROOM') {
                            marker = L.marker([feature.point.coordinates[1], feature.point.coordinates[0]], {icon: washroomIcon});
                        } else if (assetType === 'DOGGIE FOUNTAIN') {
                            marker = L.marker([feature.point.coordinates[1], feature.point.coordinates[0]], {icon: doggieFountainIcon});
                        } else if (assetType === 'SHOWER') {
                            marker = L.marker([feature.point.coordinates[1], feature.point.coordinates[0]], {icon: showersIcon});
                        } else if (assetType === 'BENCH') {
                            marker = L.marker([feature.point.coordinates[1], feature.point.coordinates[0]], {icon: parkBenchesIcon});
                        } else if (assetType === 'PICNIC TABLE') {
                            marker = L.marker([feature.point.coordinates[1], feature.point.coordinates[0]], {icon: picnicTablesIcon});
                        } else {
                            marker = L.marker([feature.point.coordinates[1], feature.point.coordinates[0]]);
                        }
                        marker.bindPopup(`
                            <b>Type:</b> ${feature.asset_type || feature.type_description}<br>
                            <b>Location Detail:</b> ${feature.location_d}<br>
                            <b>Life Cycle Status:</b> ${feature.life_cycle || feature.life_cycle_status}<br>
                            <b>Maintained By:</b> ${feature.maintained || feature.maintained_by}<br>
                            <b>Detail:</b> ${feature.detail || feature.finish_type}<br>
                            <b>Orientation:</b> ${feature.orientation || ''}<br>
                            <b>Seasonality:</b> ${feature.seasonalit}
                        `);
                        oms.addMarker(marker);
                        markers[assetType].addLayer(marker);
                    });

                    map.addLayer(markers[assetType]);
                    assetState[assetType] = true;
                } else {
                    console.log('Unexpected response from the API:', data);
                }
            })
            .catch(e => {
                console.log('There was a problem with your fetch operation: ' + e.message);
            });
    }
}

//Hamburger menu button
document.getElementById('menuButton').addEventListener('click', function() {
    let menu = document.getElementById('menu');
    if (menu.style.width === '0px' || menu.style.width === '') {
        menu.style.width = '250px';
    } else {
        menu.style.width = '0px';
    }
});


//Checkbox event listeners for hanburger menu
document.getElementById('waterFountainCheckbox').addEventListener('change', function() {
    fetchData('DRINKING FOUNTAIN');
});

document.getElementById('washroomCheckbox').addEventListener('change', function() {
    fetchData('WASHROOM');
});

document.getElementById('doggieFountainCheckbox').addEventListener('change', function() {
    fetchData('DOGGIE FOUNTAIN');
});

document.getElementById('showerCheckbox').addEventListener('change', function() {
    fetchData('SHOWER');
});

document.getElementById('benchCheckbox').addEventListener('change', function() {
    fetchData('BENCH');
});

document.getElementById('picnicTableCheckbox').addEventListener('change', function() {
    fetchData('PICNIC TABLE');
});

