import {
  AfterViewInit,
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  environment
} from '../../../environments/environment';

declare var mapboxgl;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute) {}

  lat: number;
  lng: number;

  ngOnInit() {
    let geo: any = this.route.snapshot.paramMap.get('geo');
    geo = geo.substr(4);
    geo = geo.split(',');

    this.lat = Number(geo[0]);
    this.lng = Number(geo[1]);
  }

  ngAfterViewInit() {
    mapboxgl.accessToken = environment.ApiKeyMapBox;
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true
    });

    map.on('load', () => {

      map.resize();

      // Insert the layer beneath any symbol layer.
      var layers = map.getStyle().layers;

      var labelLayerId;
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
          labelLayerId = layers[i].id;
          break;
        }
      }

      new mapboxgl.Marker()
      .setLngLat([this.lng, this.lat])
      .addTo(map);

      map.addLayer({
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );
    });


  }



}