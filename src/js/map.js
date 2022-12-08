let myMap;
let zoom = $(window).width() > 480 ? 14 : 13;

const init = () => {
    myMap = new ymaps.Map("map", {
        center: [55.75, 37.60],
        zoom: zoom,
        controls: []
      });
      
      const coords = [
        [55.751657, 37.604571],
        [55.756545, 37.619789],
        [55.758524, 37.582562],
        [55.742871, 37.580297],
      ];

      const myCollection = new ymaps.GeoObjectCollection({}, {
        draggable: false,
        iconLayout: 'default#image',
        iconImageHref: '/image/pics/map/marker-map.svg', //Это нужно заменить
        iconImageSize: [46, 57],
        iconImageOffset: [-35, -52]
      });

      coords.forEach(coord => {
        myCollection.add(new ymaps.Placemark(coord));
      })
      
      myMap.geoObjects.add(myCollection);

      myMap.behaviors.disable('scrollZoom');
};
 
ymaps.ready(init);