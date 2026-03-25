# Wander-Lust
Wander Lust is a travel discovery web application designed to inspire exploration and adventure.  It allows users to browse destinations, share experiences, and manage personalized itineraries. 

## Deployment Notes (Render)

- Required environment variables on Render:
	- `CLOUDINARY_CLOUD_NAME` — your Cloudinary cloud name
	- `CLOUDINARY_KEY` — your Cloudinary API key
	- `CLOUDINARY_SECRET` — your Cloudinary API secret
	- `DB_URL` — MongoDB connection string (e.g. `mongodb://127.0.0.1:27017/wander` for local)
	- `MAPBOX_TOKEN` — Mapbox API token used for geocoding
	- `SECRET_KEY` — session/crypto secret used by the app

- To debug uploads, enable logs and check `console.log(req.file)` output in the server logs after uploading a file.
