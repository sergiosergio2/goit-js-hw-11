import axios from "axios";
export default class PixabayClient
{
    constructor(key){
        this.key = key; 
        this.baseUrl = "https://pixabay.com/api/";
        this.perPage = 40;
        this.orientation = "horizontal";
        this.imageType = "foto";
        this.safesearch = "true";
    }

    async getImages (q, page, OnSuccess, OnError) {
        if(page < 1)
            page = 1;
        return await axios.get(`${this.baseUrl}?key=${this.key}&q=${q}&per_page=${this.perPage}&page=${page}&image_type=${this.imageType}&orientation=${this.orientation}&safesearch=${this.safesearch}`)
            .then(res => {
                //console.log(res.data);
                if(res.data.hits!==null && res.data.hits.length>0){

                    OnSuccess(res.data)
                    return res.data.hits;
                }
                OnError();
                return [];
            });
    }

    nextPage(q, page, ){
        this.getImages(q);
    }
    
}