import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import TileWMS from 'ol/source/TileWMS.js';
import TileLayer 'ol/layer/Tile.js';
import TileGrid 'ol/tilegrid/TileGrid.js';
import {get as getProjection} from 'ol/proj.js';
import {getWidth} from 'ol/extent.js';

const projExtent = getProjection('ESPG:3857').getExtent();
const startResolution = getWidth(projExtent) / 256;
const resolutions = new Array(22);
for (let i = 0, ii = resolutions.length; i < ii; ++i)
{
	resolutions[i] = startResolution / Math.pow(2, i);
}
const tileGrid = new TileGrid({
	extent: [-13884991, 2870341, -7455066, 6338219],
	resolutions: resolutions,
	tileSize: [512, 256],
});

const layers = [
	new TileLayer({
		source: new OSM()
	}),
	new TileLayer({
		source: new TileWMS({
			url: 'https://ahocevar.com/geoserver/wms',
			params: {'LAYERS': 'topp:states', 'TILED': true},
			servertype: 'geoserver',
			tileGrid: tileGrid,
		}),
	})];	

const map = new Map({
	layers: layers,
	target: 'map',
	view: new View({
		center: [-10997148, 4569099],
		zoom: 4
	}),
});


/*
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});
*/
