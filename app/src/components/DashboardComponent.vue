<script>
import SearchItem from './SearchItem.vue'
import axios from 'axios';
import { Pie } from 'vue-chartjs'
export default {
    components: {
        SearchItem,
        Pie
    },
    data() {
        return {
            chart_data: {
                labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
                datasets: [
                    {
                        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                        data: [40, 20, 80, 10]
                    }
                ]
            },
            chart_options: {
                responsive: true,
                maintainAspectRatio: false
            }
        }
    },
    created() {
    },
    methods: {
        async search() {
            if (this.selectedItem != null) {
                try {
                    this.search_results = [];
                    this.user_preferences_results = [];
                    this.page_title = this.msg_your_search_results;
                    this.page_sub_title = this.msg_loading;
                    
                    const calls = [];
                    calls.push(this.getTopHotels(this.search_text, this.selectedItem));
                    calls.push(this.getUserPreferences(this.selectedItem));
                    Promise.all(calls).then(() => {
                        console.log('search completed');
                    })
                } catch (error) {
                    console.log(error)
                }
            }
        },
        async getTopHotels (description = '', location = '') {
            try {
                this.page_title = this.msg_hot_picks_search;
                this.page_sub_title = this.msg_loading;
                
                const userEmail = localStorage.getItem('x-user');
                const response = await axios.get('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/hotels/top?description=' + description + '&location=' + location + '&email=' + userEmail);
                response.data.data.forEach(item => {
                    this.search_results.push({
                        hotelUrl: item["HotelUrl"],
                        imgUrl: item["ImgUrl"],
                        hotelName: item["Hotel Name"],
                        city: item["City"],
                        reviews: item["reviews"],
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
        async getUserPreferences (location) {
            try {
                this.page_title = this.msg_hot_picks_search;
                this.page_sub_title = this.msg_loading;
                
                const userEmail = localStorage.getItem('x-user');
                const response = await axios.get('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/hotels/user-preferences?email=' + userEmail + '&location=' + location);
                response.data.data.forEach(item => {
                    this.user_preferences_results.push({
                        hotelUrl: item["HotelUrl"],
                        imgUrl: item["ImgUrl"],
                        hotelName: item["Hotel Name"],
                        city: item["City"],
                        reviews: item["reviews"],
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
            this.page_title = this.msg_hot_picks_search;
            this.search_results = []
            this.search_text = ''
            this.selectedItem = null
            localStorage.removeItem('search')

            const calls = [];
            calls.push(this.getTopHotels());
            calls.push(this.getUserPreferences(this.selectedItem));
            Promise.all(calls).then(() => {
                console.log('search completed');
            })
        },
    },
    mounted() {
    },
}
</script>

<template>
    <div>
        <Pie id="chart1" :data="chart_data" :options="chart_options" />
    </div>
    <div>
        <Pie id="chart2" :data="chart_data" :options="chart_options" />
    </div>
    <div>
        <Pie id="chart3" :data="chart_data" :options="chart_options" />
    </div>
    <div>
        <Pie id="chart4" :data="chart_data" :options="chart_options" />
    </div>
    <div>
        <Pie id="chart5" :data="chart_data" :options="chart_options" />
    </div>
    
</template>

<style scoped>

.search-results{
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
</style>
