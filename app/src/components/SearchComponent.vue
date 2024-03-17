<script>
import SearchItem from './SearchItem.vue'
import axios from 'axios';
export default {
    components: {
        SearchItem,
    },
    data() {
        return {
            search_text: '',
            search_results: [],
            selectedItem: null,
            items: [
                { id: 'Galle', name: 'Galle' },
                { id: 'Kandy', name: 'Kandy' },
                { id: "Nuwara Eliya", name: 'Nuwara Eliya' },
                { id: "Negombo", name: 'Negombo' },
                { id: "Colombo", name: 'Colombo' }
            ],
            msg_hot_picks: 'Hot Picks',
            msg_your_search_results: 'Your search results',
            msg_no_items_found: 'No items found',
            msg_loading: 'Loading...',
            page_title: '',
            page_sub_title: '',
        }
    },
    created() {
        this.getTopHotels()
    },
    methods: {
        async search() {
            if (this.search_text != '') {
                try {
                    this.search_results = [];
                    this.page_title = this.msg_your_search_results;
                    this.page_sub_title = this.msg_loading;
                    await this.getTopHotels(this.search_text, this.selectedItem);
                } catch (error) {
                    console.log(error)
                }
            }
        },
        async getTopHotels (description = '', location = '') {
            try {
                this.page_title = this.msg_hot_picks;
                this.page_sub_title = this.msg_loading;
                
                const userEmail = localStorage.getItem('x-user');
                const response = await axios.get('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/hotels/top?description=' + description + '&location=' + location + '&email=' + userEmail);
                response.data.data.forEach(item => {
                    this.search_results.push({
                        hotelUrl: item["HotelUrl"],
                        imgUrl: item["ImgUrl"],
                        hotelName: item["Hotel Name"],
                        city: item["City"],
                        reviews: item["Review"],
                        date: item["Date"]
                    })
                });
                if (response.data.data.length === 0) {
                    this.page_sub_title = this.msg_no_items_found;
                }
            } catch (error) {
                this.page_sub_title = this.msg_no_items_found;
            }
        },
        searchOnEnter(e) {
            if (e.key == 'Enter') {
                this.search()
            }
        },
        clear() {
            this.page_title = this.msg_hot_picks;
            this.search_results = []
            this.search_text = ''
            this.selectedItem = null
            localStorage.removeItem('search')
            this.getTopHotels();
        },
    },
    mounted() {
        const search = localStorage.getItem('search')
        if (search) {
            this.search_text = search
            this.search()
        }
    },
}
</script>

<template>
    <div class="searchbar">
        <input
            @keydown="searchOnEnter($event)"
            v-model="search_text"
            type="text"
            placeholder="Enter your needs for your stay..."
        />
        <select class="city" v-model="selectedItem">
            <option disabled value="" selected>Select an City</option>
            <option v-for="item in items" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
        <button class="button" @click="search()">
            <img
                width="15"
                height="15"
                src="https://static.thenounproject.com/png/1012361-200.png"
                alt=""
            />
        </button>
        <button class="button" @click="clear()">
            <img
                width="15"
                height="15"
                src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-close-512.png"
                alt=""
            />
        </button>
    </div>
    <h2 class="title">{{ page_title }}</h2>
    <div v-if="search_results.length == 0">{{ page_sub_title }}</div>
    <SearchItem
        :key="item.id"
        :searchItem="item"
        v-for="item in search_results"
    >
    </SearchItem>
</template>

<style scoped>
.searchbar {
    display: flex;
    padding: 20px 0px;
    color: aliceblue;
}
.title{
    margin-bottom: 20px;
}

.city{
    width: 250px;
    margin-left: 10px;
    margin-right: 10px;
}

.button {
    padding: 0px 15px;
}

.searchbar input[type='text'], .searchbar input[type='select']  {
    width: 100%;
    box-sizing: border-box;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
    background-color: white;
    background-image: url('https://www.w3schools.com/css/searchicon.png');
    background-position: 10px 10px;
    background-repeat: no-repeat;
    padding: 12px 20px 12px 40px;
}
</style>
