"use strict";

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

document.addEventListener('DOMContentLoaded', function () {
    slider_func();
    add_remove_header();
    animation_main();
    createFormWrapper();

    //слайдер
    const sliders = document.querySelectorAll('.slider');
    for (let i = 0; i < sliders.length; i++) {
        createSlider(sliders[i]);
    }
});


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
            if (scrolledBack >= maxScrolledBack && hidden){
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

function createForm(form, mess) {
    const action = form.action;
    const elements = form.elements;

    if(!action || !elements.length) return;

    function validate(){
        let result = true;

        for(let i = 0; i< elements.length; i++){
            let el = elements[i];
            console.log(el.type);
            //if (!el.dataset.required) continue;
            if (el.type === 'text' || el.type === 'tel' || el.type === 'email' || el.tagName === 'textarea'){
                console.log(el.type);
                if (!el.value) {
                    el.classList.add('error');
                    console.log("error");
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
                    console.log("error");
                    el.addEventListener('change', removeClass);
                    result = false;
                }
            }
            else if (el.tagName.toLocaleLowerCase() ==='select' && !el.getAttribute('multiply')){
                if (el.selectedIndex === 0) {
                    el.classList.add('error');
                    console.log("error");
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
        console.log("submit");
        event.preventDefault();
        let div = document.createElement('div');
        let h2 = document.createElement('h2');
        let p = document.createElement('p');
        document.documentElement.classList.add("popupActive");
        const popup_inner = document.querySelector('.popup-inner');
        popup_inner.innerHTML = '';
        popup_inner.append(div);
        div.append(h2);
        div.append(p);

        if(!validate()) {
            h2.innerHTML = 'Ошибка!';
            p.innerHTML = 'Проверьте корректность вводимых данных'
            return;
        }
        h2.innerHTML = 'Поздравляем!';
        p.innerHTML = 'Вы записались на RDCLR.HOME'
        //mess.innerHTML = 'Отправлено';
    })
}

function createFormWrapper(){
    const forms = document.querySelectorAll('form');
    const messageField = document.querySelector('.message-text');
    const overlay = document.querySelector('.overlay');
    if (!messageField || !overlay) return;


    overlay.addEventListener('click', function () {
        document.documentElement.classList.remove('popupActive');
    });
    Array.from(forms).forEach(form => createForm(form, messageField))
}


/**
 * Меню бургер для мобилки
 */
document.addEventListener('DOMContentLoaded', function () {
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
});

