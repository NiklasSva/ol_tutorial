import './style.css';
import {Map, View} from 'ol';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS.js';
import TileLayer from 'ol/layer/Tile.js';
import TileGrid from 'ol/tilegrid/TileGrid.js';
import {get as getProjection} from 'ol/proj.js';
import {getWidth} from 'ol/extent.js';
import {toLonLat} from 'ol/proj';

const projExtent = getProjection('EPSG:3857').getExtent();
const startResolution = getWidth(projExtent) / 256;
const resolutions = new Array(22);
for (let i = 0, ii = resolutions.length; i < ii; ++i)
	{resolutions[i] = startResolution / Math.pow(2, i);}

const tileGrid = new TileGrid({
	extent: [-13884991, 2870341, -7455066, 6338219],
	resolutions: resolutions,
	tileSize: [512, 256],
});

const wmsSource = new TileWMS({
	url: 'https://ahocevar.com/geoserver/wms',
	params: {'LAYERS': 'topp:states', 'TILED': true},	
	servertype: 'geoserver',
	tileGrid: tileGrid,
});

const layers = [
	new TileLayer({source: new OSM()}),
	new TileLayer({
		source: new TileWMS({
			url: 'https://ahocevar.com/geoserver/wms',
			params: {'LAYERS': 'topp:states', 'TILED': true},
			servertype: 'geoserver',
			tileGrid: tileGrid}),
	})
];	

const map = new Map(
	{
		layers: layers,
		target: 'map',
		view: new View({
			center: [-10997148, 4569099],
			zoom: 4})
	}
);

document.getElementById('search-button').addEventListener('click', () => 
	{
		const searchInput = document.getElementById('search-input').value;
		if (searchInput)
		{
			const viewResolution = map.getView().getResolution();
			const url = wmsSource.getFeatureInfoUrl(
				map.getView().getCenter(),
				viewResolution,
				'EPSG:3857',
				{'INFO_FORMAT': 'application/json', 'QUERY_LAYERS': 'topp:states', 'FEATURE_COUNT': 1}
			);
			
			if (url)
			{
				fetch(url)
					.then(response => response.json())
					.then(data => 
						{
							if (data.features.length > 0)
							{
								const feature = data.features[0];
								const coordinates = feature.geometry.coordinates;
								const lonLat = toLonLat(coordinates);
								map.getView().setCenter(coordinates);
								map.getView().setZoom(10);
								alert(`Feature found: ${feature.properties.name}`);
							}
							else
							{
								alert('No features found');
							}
						}
					);
			}
		}
	});

/*

document.getElementById('search-button').addEventListener('click', () => {
  const searchInput = document.getElementById('search-input').value;
  if (searchInput) {
    const viewResolution = map.getView().getResolution();
    const url = wmsSource.getFeatureInfoUrl(
      map.getView().getCenter(),
      viewResolution,
      'EPSG:3857',
      { 'INFO_FORMAT': 'application/json', 'QUERY_LAYERS': 'topp:states', 'FEATURE_COUNT': 1 }
    );
    if (url) {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.features.length > 0) {
            const feature = data.features[0];
            const coordinates = feature.geometry.coordinates;
            const lonLat = toLonLat(coordinates);
            map.getView().setCenter(coordinates);
            map.getView().setZoom(10);
            alert(`Feature found: ${feature.properties.name}`);
          } else {
            alert('No features found');
          }
        });
    }
  }
});

*/