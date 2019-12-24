"use strict";

document.addEventListener('DOMContentLoaded', function () {
    slider_func();
    if (window.innerWidth > 700) add_remove_header();
    animation_main();
    createFormWrapper();
    makeBurger();
    scrollUp();
    initMap();

    //слайдер
    const sliders = document.querySelectorAll('.slider');
    for (let i = 0; i < sliders.length; i++) {
        createSlider(sliders[i]);
    }
});

/*инициализация карты*/
function initMap() {

    // В переменной map создаем объект карты GoogleMaps и вешаем эту переменную на <div id="map"></div>
    const map = new google.maps.Map(document.getElementById('map'), {
        // При создании объекта карты необходимо указать его свойства
        // center - определяем точку на которой карта будет центрироваться
        center: {lat: 51.68602324, lng: 39.16879714},
        // zoom - определяет масштаб. 0 - видно всю платнеу. 18 - видно дома и улицы города.
        zoom: 16,

        //Добавляем свои стили для отображения карты
        styles: [
            {"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},
            {"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},
            {"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},
            {"featureType":"road","elementType":"all","stylers":[{"saturation":-100}, {"lightness":45}]},
            {"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},
            {"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},
            {"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},
            {"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    });

    // Создаем маркер на карте
    const marker = new google.maps.Marker({

        // Определяем позицию маркера
        position: {lat: 55.760186, lng: 37.618711},

        // Указываем на какой карте он должен появится. (На странице ведь может быть больше одной карты)
        map: map,

        // Пишем название маркера - появится если навести на него курсор и немного подождать
        title: 'Red Collar',

        // Укажем свою иконку для маркера
        icon: 'https://img1.freepng.ru/20180508/ayw/kisspng-drawing-pin-computer-icons-clip-art-5af20b12b830a6.6337267515258119867545.jpg'
    });

    // Создаем наполнение для информационного окна
    // const contentString = '<div id="content">'+
    //     '<div id="siteNotice">'+
    //     '</div>'+
    //     '<h1 id="firstHeading" class="firstHeading">Большой театр</h1>'+
    //     '<div id="bodyContent">'+
    //     '<p>Госуда́рственный академи́ческий Большо́й теа́тр Росси́и, или просто Большой театр — один из крупнейших' +
    //     'в России и один из самых значительных в мире театров оперы и балета.</p>'+
    //     '<p><b>Веб-сайт:</b> <a href="http://www.bolshoi.ru/" target="_blank">bolshoi.ru</a>'+
    //     '</p>'+
    //     '</div>'+
    //     '</div>';
    //
    // // Создаем информационное окно
    // const infowindow = new google.maps.InfoWindow({
    //     content: contentString,
    //     maxWidth: 400
    // });

    // Создаем прослушивание, по клику на маркер - открыть инфо-окно infowindow
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

}

//событие стрелки вверх
function scrollUp() {
    const up = document.getElementById("up");
    if (!up) return;
    up.addEventListener('click', () => {
        window.scrollTo(0,0);
    });
}

/**
 * Слайдер
 */
function slider_func(){
    const sliders = document.querySelectorAll('.slider');

    for (let i = 0; i < sliders.length; i++) {
        createSlider(sliders[i]);
    }
}

function createSlider(slider) {
    const slides = slider.querySelectorAll('.slide');

    if (slides.length < 2) return;

    const wrapper = slider.querySelector('.slider-wrapper');
    const prevButton = slider.querySelector('.prev-button');
    const nextButton = slider.querySelector('.next-button');

    if (!prevButton && !nextButton) return;

    let width = 0;
    let no_numbers = false;
    let photo_number = document.getElementById('photo_number');
    const photo_amount = document.getElementById('photo_amount');
    if (!photo_number || !photo_amount){
        no_numbers = true;
    }
    else{
        photo_amount.innerText = slides.length.toString();
    }

    function resize() {
        width = slider.scrollWidth;
    }
    resize();
    document.addEventListener('resize', resize);

    let activeSlide = 0;

    slides[activeSlide].classList.add('active');

    if (prevButton) prevButton.addEventListener('click', function () {
        activeSlide--;
        if (activeSlide < 0) activeSlide = slides.length - 1;

        wrapper.style.transform = `translate3d(-${width * activeSlide}px, 0, 0)`;
        photo_number.innerText=(activeSlide+1).toString();
    });

    if (nextButton) nextButton.addEventListener('click', function () {
        activeSlide++;
        if (activeSlide > slides.length - 1) activeSlide = 0;

        wrapper.style.transform = `translate3d(-${width * activeSlide}px, 0, 0)`;
        photo_number.innerText=(activeSlide+1).toString();
    })
}

/**
 * Скрытие/показ хедера
 */
function add_remove_header(){
    const header = document.querySelector('header');
    if (!header) return;
    let hidden = false;
    let lastScrollTop = 0;
    let maxScrolledBack = 50;
    let scrolledBack = 0;
    function handleScroll() {
        const scrolled = window.scrollY;
        if (lastScrollTop < scrolled) {
            scrolledBack = 0;
            if(!hidden){
                header.classList.add('hidden');
                hidden = true;
            }
        }
        else {
            scrolledBack +=(lastScrollTop - scrolled);
            if ((scrolledBack >= maxScrolledBack && hidden) || scrolled <= 50) {
                header.classList.remove('hidden');
                hidden = false;
            }
        }
        lastScrollTop = scrolled;
    }
    window.addEventListener('scroll', handleScroll);
}

/**
 * Анимация RDCLR.HOME
 */
function animation_main(){
    let rdclr_shade = document.getElementById("rdclr_shade");
    let home_shade = document.getElementById("home_shade");
    if (!rdclr_shade && !home_shade) return;

    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    let left = 0;
    let top = 0;
    let nLeft = 0;
    let nTop = 0;

    function animate() {

        left += (nLeft - left) / 20;
        top += (nTop - top) / 20;
        rdclr_shade.style.transform = 'translate(' + left + 'px,'
            + top + 'px)';
        home_shade.style.transform = 'translate(' + left + 'px,'
            + top + 'px)';
        requestAnimationFrame(animate);
    }
    animate();

    document.addEventListener('mousemove', function (event) {
        nLeft = (event.clientX - windowWidth / 2) / 47 * (-1);
        nTop = (event.clientY - windowHeight / 2) / 25 * (-1);
    });
}
/**
 * События формы
 */
function createForm(form) {
    const action = form.action;
    const elements = form.elements;

    if(!action || !elements.length) return;

    function validate(){
        let result = true;

        for(let i = 0; i< elements.length; i++){
            let el = elements[i];
            //if (!el.dataset.required) continue;
            if (el.type === 'text' || el.type === 'tel' || el.type === 'email' || el.tagName === 'textarea'){
                if (!el.value) {
                    el.classList.add('error');
                    el.addEventListener('input', removeClass);
                    result = false;
                }
            }
             if (el.type === 'select'){
                console.log(el.type);
                if (!el.value) {
                    el.classList.add('error');
                    console.log("error");
                    el.addEventListener('input', removeClass);
                    result = false;
                }
            }
            else if (el.type === 'checkbox' || el.type === 'radio'){
                if(!el.checked) {
                    el.classList.add('error');
                    el.addEventListener('change', removeClass);
                    result = false;
                }
            }
            else if (el.tagName.toLocaleLowerCase() ==='select' && !el.getAttribute('multiply')){
                if (el.selectedIndex === 0) {
                    el.classList.add('error');
                    el.addEventListener('change', removeClass);
                    result = false;
                }
            }
        }

        function removeClass(){
            this.classList.remove('error');
        }

        return result;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let btn_close = document.createElement('button');
        let div = document.createElement('div');
        let h2 = document.createElement('h2');
        let p = document.createElement('p');
        document.documentElement.classList.add("popupActive");
        const popup_inner = document.querySelector('.popup-inner');
        popup_inner.innerHTML = '';
        popup_inner.append(btn_close);
        btn_close.setAttribute("id", "close");
        popup_inner.append(div);
        div.append(h2);
        div.append(p);

        btn_close.addEventListener('click', function () {
            document.documentElement.classList.remove('popupActive');
        });

        if(!validate()) {
            h2.innerHTML = 'Ошибка!';
            p.innerHTML = 'Проверьте корректность вводимых данных';
            p.style.color = '#EC3332';
            return;
        }
        h2.innerHTML = 'Поздравляем!';
        p.innerHTML = 'Вы записались на RDCLR.HOME';
        h2.style.color = '#000000';
    })
}

function createFormWrapper(){
    const forms = document.querySelectorAll('form');
    const overlay = document.querySelector('.overlay');
    if (!forms || !overlay) return;


    overlay.addEventListener('click', function () {
        document.documentElement.classList.remove('popupActive');
    });

    Array.from(forms).forEach(form => createForm(form))
}


/**
 * Меню бургер для мобилки
 */
function makeBurger(){
    let button = document.querySelector(".burger");
    let menu = document.querySelector("nav");
    if (!button || !menu) return;
    let active = false;

    button.addEventListener("click", function () {
        if (!active) {
            menu.classList.add("active");
            active = true
        }
        else{
            menu.classList.remove("active");
            active = false
        }
    });
    /*считаем ширину строки, ширину враппера и каждый раз увеличиваем на 1*/
}

