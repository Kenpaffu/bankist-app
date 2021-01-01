'use strict';

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContnet = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

/////////// IMPLEMENTING SMOOTH SCROLLING

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();

  // Modern way of scrolling to section (only supported by newer browsers)
  section1.scrollIntoView({ behavior: 'smooth' });

  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);
  // Old way of scrolling to section
  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
});

////////// EVENT DELEGATION: IMPLEMENTING PAGE NAVIGATION

// With Event Delegation
// 1. Add event listener to common parent element.
// 2. Determine what element originated the event.

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Without Event Delegation
// document.querySelectorAll('.nav__link').forEach(el => {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

/////////////// BUILDING A TABBED COMPONENT

// tabbed component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  // Guard Clause
  if (!clicked) return;

  // Remove active Classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContnet.forEach(c => c.classList.remove('operations__content--active'));

  // Active Tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  // console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//////////////// PASSING ARGUMENTS TO EVENT HANDLERS

///// MENU FADE ANIMATION

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing an "argument" into a handler
nav.addEventListener('mouseover', handleHover.bind(0.4));

nav.addEventListener('mouseout', handleHover.bind(1));

/*
///////////// IMPLEMENTING STICKY NAV: THE SCROLL EVENT
const initialCoords = section1.getBoundingClientRect();

window.addEventListener('scroll', function (e) {
  console.log(window.scrollY);

  if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

/////////// A BETTER WAY: THE INTERESECTION OBSERVER API

//// Sticky nav

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//////// Reveal Sections
const allSections = document.querySelectorAll('.section');

const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

///////////////// LAZY LOADING IMAGES

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  //replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

////////////// BUILDING A SLIDER COMPONENT

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length - 1;

  // Functions
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };

  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};

slider();

//////////////////////////////////////////////////////////
//////////////////// ADVANCED DOM ////////////////////////
//////////////////////////////////////////////////////////

/*
/////////////// Selecting, Creating and Deleting Elements

// Selecting elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);

///// just one element
const header = document.querySelector('.header');

///// multiple elements (in a node list [that can act as an array])
const allSections = document.querySelectorAll('.section');

document.getElementById('section--1');

///// by tag name returns an HTML collection (it updates as the DOM does)
const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

////// Also returns a live HTML Collection
// console.log(document.getElementsByClassName('btn'));

//////// Creating and insterting elements

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies for imporoved functionality and analytics';
message.innerHTML =
  'We use cookies for imporoved functionality and analytics <button class="btn btn--close-cookie"> Got it! </button>';

/////// DOM elements are unique and will be moved. To have more than one you have to clone it.
header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

//////////// Delete Elements
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // new way
    message.remove();

    // old way
    // message.parentElement.removeChild(message);
  });

///////////////// STYLES ATTRIBUES AND CLASSES

/////////// Styles
// creates inline styles
message.style.backgroundColor = '#37383d';
message.style.width = '105%';

// You can only log styles that you have created as an inline style in the DOM
// console.log(message.style.height);
// console.log(message.style.backgroundColor);

// You can still log styles with getComputedStyle
// console.log(getComputedStyle(message).color);
// console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

/////////// Attributes

// Standard
const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

// Non-standard
// console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

// pic attributes
// console.log(logo.src);
// console.log(logo.getAttribute('src'));

//link attributes
const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// data attributes
// console.log(logo.dataset.versionNumber);

//////////// Classes

//
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// Don't use. (Only one class and it overwrites any other classes)
logo.className = 'jonas';
*/

/*
////////// TYPES OF EVENTS AND EVENT HANDLERS

const h1 = document.querySelector('h1');

const alertH1 = function () {
  alert('addEventListener: Great! You are reading the headin :D');

  h1.removeEventListener('mouseenter', alertH1);
};

// (more common)
h1.addEventListener('mouseenter', alertH1);

// (old way of doing it, mostly done with addEventListener)
// h1.onmouseenter = function () {
//   alert('onmouseenter: Great! You are reading the headin :D');
// };
*/

/////////////// EVENT PROPOGATION: BUBBLING AND CAPTURING
/*
// rgb(//255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rbg(${randomInt(0, 255)},${randomInt(0, 255)}${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor;

  // Stop the event propogation (not a good idea in practice)
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor;
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor;
});
*/

/*
///////////////// DOM TRAVERSING

const h1 = document.querySelector('h1');

// Going Downards: Child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'black';

// Going upwards: Parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going Sideways: Siblings
// Can only access direct siblings

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

// a trick to access all siblings (going up to parent and back down to children)
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    el.style.transform = 'scale(0.5)';
  }
});
*/

///////////// LIFECYLCE DOM EVENTS
