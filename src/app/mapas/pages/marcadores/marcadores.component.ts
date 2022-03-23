import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarcadorPersonalizado{
  color:string,
  marker?:mapboxgl.Marker,
  centro?:[number, number]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [ `
    .mapa-container{
    width:100%;
    height:100%;
  }
  .list-group{
    position:fixed;
    top: 20px;
    right:20px;
    z-index: 999;
  
  }
  li{
    cursor: pointer;
  }
  `
  ]
})
export class MarcadoresComponent implements AfterViewInit {
  @ViewChild("mapa") divMapa!:ElementRef;
  mapa!:mapboxgl.Map;
  zoomLevel:number =16;
  center:[number,number]=[-103.40318173405522,20.654654638742954];
  marcadores:MarcadorPersonalizado[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: this.center,
      zoom: this.zoomLevel
    });

    // const markerHtml: HTMLElement = document.createElement("div");
    // markerHtml.innerHTML= "Kiuuuubo"

    // const marker= new mapboxgl.Marker({
    //   element: markerHtml
    // }).setLngLat(this.center).addTo(this.mapa);
    this.leerMarcadoresLS();

  }
  irMarcador(marcador:mapboxgl.Marker){
    this.mapa.flyTo({
      center: marcador.getLngLat()
    });
  }

  agregarMarcador(){
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));


    const nuevoMarcador = new mapboxgl.Marker({
      color,
      draggable: true
    }).setLngLat(this.mapa.getCenter()).addTo(this.mapa);

    this.marcadores.push({
      color,
      marker: nuevoMarcador
    });
    this.guardarMarcadoresLS();
      nuevoMarcador.on("dragend", () => {
      this.guardarMarcadoresLS();
    })
  }

  guardarMarcadoresLS(){
    const lngLatArr: MarcadorPersonalizado[] =[];
    this.marcadores.forEach(m=>{
      const color =m.color;
      const {lng,lat}=m.marker!.getLngLat();
      lngLatArr.push({
        color,
        centro: [lng, lat]
      })
    });
    localStorage.setItem("marcadores", JSON.stringify(lngLatArr))
  }
  leerMarcadoresLS(){
    if(!localStorage.getItem("marcadores")){
      return;
    }
    const lnglarArr: MarcadorPersonalizado[] = JSON.parse(localStorage.getItem("marcadores")!);
    
    lnglarArr.forEach(m=>{
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable:true
      }).setLngLat(m.centro!)
        .addTo(this.mapa)

        this.marcadores.push({
          marker: newMarker,
          color: m.color
        });

        newMarker.on("dragend", () => {
          this.guardarMarcadoresLS();
        })
    })
  }
  borrarMarcador(index:number){
    this.marcadores[index].marker?.remove();
    this.marcadores.splice(index,1);
    this.guardarMarcadoresLS();
  }
}
