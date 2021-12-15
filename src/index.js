import './sass/main.scss';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayClient from "./pixabayClient";
import SimpleLightbox from "simplelightbox";
import Notiflix from 'notiflix';



const ref = {
    searchForm: document.querySelector('#search-form'),
    // moreButton: document.querySelector('button'),
    input: document.querySelector('#search-form input'),
    gallery: document.querySelector('.gallery')
    
}
ref.searchForm.addEventListener("submit", SearchHandler);

let lightbox = new SimpleLightbox('.gallery a');
const client = new PixabayClient("24796003-16c88a69f4f4f22b063121d0b");
let page = 1;
let totalHits = 0;
const pageSize = 40;
let busy = false;
async function Search(q){
    if(busy) return;
    busy = true;
    page = 1;
    ClearItems();
    AddItems(await client.getImages(q, page, ShowHits,ShowError));
    busy = false;
}

function ClearItems(){
    ref.gallery.innerHTML = "";
}

function AddItems(items){
    let total = "";
    console.log(items);
    for(let i =0; i < items.length; i++)
    {
        let template = `<div class="photo-card">
        <a href="${items[i].largeImageURL}"><img src="${items[i].previewURL}" alt="" loading="lazy" /></a>
        <div class="info">
        <p class="info-item">
        <b>${items[i].likes} Likes</b>
        </p>
        <p class="info-item">
        <b>${items[i].views} Views</b>
        </p>
        <p class="info-item">
        <b>${items[i].comments} Comments</b>
        </p>
        <p class="info-item">
        <b>${items[i].downloads} Downloads</b>
        </p>
        </div>
        </div>`;
        ref.gallery.insertAdjacentHTML('beforeend', template); 
    }
    lightbox.refresh();
}
    
async function NextPage(q){
    if(busy) return;
    busy = true;
    AddItems(await client.getImages(q, ++page, blank, ShowError));
    busy = false;
}

function SearchHandler(e){
    e.preventDefault();
    Search(ref.input.value);
    
}

function NextPageHandler(){
    //e.preventDefault();
    if(page+1*pageSize <= totalHits)
    NextPage(ref.input.value);
}

window.onscroll = function(ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        NextPageHandler();
    }
};
function blank(){

}
function ShowHits(hits) {
    Notiflix.Notify.success(`Hooray! We found ${hits.total} images.`);
    totalHits = hits.total;
 //    if(apiPixabay.totalHits>40) {
 
 //    }
 }

 function ShowError(){
    Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
 }