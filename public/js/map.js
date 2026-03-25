mapboxgl.accessToken = maptoken;
            const map = new mapboxgl.Map({
            container: 'map',
            center: geometry.coordinates,
            zoom: 10 
            });
            const el = document.createElement('div');
            el.innerHTML = '<i class="fa-regular fa-compass"></i>';
            el.style.transform = 'translate(-50%, -100%)';
            console.log(geometry);
            const marker = new mapboxgl.Marker(el)
            .setLngLat(geometry.coordinates)
            .setPopup(new mapboxgl.Popup({offset:25}).setHTML(`<h6>${data.location}</h6>`))
            .addTo(map);