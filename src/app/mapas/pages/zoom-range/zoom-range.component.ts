import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from "mapbox-gl";

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [`
  .mapa-container{
    width:100%;
    height:100%;
  }
  .row{
    background-color: white;
    border-radius: 5px;
    bottom: 50px;
    left: 50px;
    padding: 10px;
    position: fixed;
    z-index: 999;
    width: 500px
  }
  `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  constructor() { }
  @ViewChild("mapa") divMapa!:ElementRef;
  mapa!:mapboxgl.Map;
  zoomLevel:number =16;
  center:[number,number]=[-103.40318173405522,20.654654638742954];

  ngOnDestroy(): void {
    this.mapa.off("zoom", ()=>{});
    this.mapa.off("zoomend", ()=>{});
    this.mapa.off("move", ()=>{});
    
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement,
      style: "mapbox://styles/mapbox/streets-v11",
      center: this.center,
      zoom: this.zoomLevel
    });
    this.mapa.on("zoom", (ev)=> {
        this.zoomLevel = this.mapa.getZoom();
    });
    this.mapa.on("zoomend", (ev)=> {
      if(this.mapa.getZoom() > 18){
        this.mapa.zoomTo(18);
      }
      if(this.mapa.getZoom() < 1){
        this.mapa.zoomTo(1);
      }
    });
    this.mapa.on("move", (ev) =>{
      const target = ev.target;
      const {lng, lat} = target.getCenter();
      this.center = [lng,lat];
    })
  }

  zoomOut(){
    this.mapa.zoomOut();
  }
  zoomIn(){
    this.mapa.zoomIn();
  }
  zoomCambio(valor: string){
    this.mapa.zoomTo(Number(valor));
  }
} 
