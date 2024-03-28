<script>
import SearchItem from './SearchItem.vue'
import axios from 'axios';
import { Pie } from 'vue-chartjs'
import { Bar } from 'vue-chartjs'
export default {
    components: {
        SearchItem,
        Pie,
        Bar
    },
    data() {
        return {
            main_chart_data: {},
            chart_one_data: {
                labels: ['Loading...'],
                datasets: [
                    {
                        backgroundColor: ['#41B883'],
                        data: [0]
                    }
                ]
            },
            chart_two_data: {
                labels: ['Loading...'],
                datasets: [
                    {
                        backgroundColor: ['#41B883'],
                        data: [0]
                    }
                ]
            },
            chart_three_data: {
                labels: ['Loading...'],
                datasets: [
                    {
                        backgroundColor: ['#41B883'],
                        data: [0]
                    }
                ]
            },
            chart_four_data: {
                labels: ['Loading...'],
                datasets: [
                    {
                        backgroundColor: ['#41B883'],
                        data: [0]
                    }
                ]
            },
            chart_five_data: {
                labels: ['Loading...'],
                datasets: [
                    {
                        backgroundColor: ['#41B883'],
                        data: [0]
                    }
                ]
            },
            chart_options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: [
                        {
                            ticks: {
                                beginAtZero: false,
                                padding: 0,
                            }
                        }
                    ]
                }
            },
            barchart_data: {
                labels: [
                    'Loading...'
                ],
                datasets: [
                    {
                        label: 'Top Hotels',
                        backgroundColor: '#f87979',
                        data: [0]
                    }
                ]
            },
            color_pallet: [
                ["#F3696E","#F47953","#F68938","#F7991D","#F8A902"],
                ['#243748',"#2E465E","#385674","#416589","#4B749F"],
                ['#F0073B',"#E21852","#D52A6A","#C73B81","#B94C98"],
                ['#CF203E',"#AF2F57","#903F6F","#704E88","#505DA0"],
                ['#EA5459',"#ED6E4E","#F18743","#F4A137","#F7BA2C"]
            ]
        }
    },
    created() {
    },
    methods: {
        async getChartData() {
            try {
                const response = await axios.get('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/charts/top-hotels');
                this.main_chart_data = response.data.data;
                this.chart_one_data = this.getPieChartData(this.main_chart_data.galle, 0);
                this.chart_two_data = this.getPieChartData(this.main_chart_data.colombo, 1);
                this.chart_three_data = this.getPieChartData(this.main_chart_data.negombo, 2);
                this.chart_four_data = this.getPieChartData(this.main_chart_data.kandy, 3);
                this.chart_five_data = this.getPieChartData(this.main_chart_data['nuwara eliya'], 4);
                this.barchart_data = this.getBarChartData(this.main_chart_data.barChart);
            } catch (error) {
                console.log(error);
            }
        },
        getPieChartData(data, color) {
            let dynamicRecord = {
                labels: data.map(item => item.hotelName),
                datasets: [
                    {
                        backgroundColor: this.color_pallet[color],
                        data: data.map(item => parseFloat(item.predicted_proba))
                    }
                ]
            }
            return dynamicRecord;
        },
        getBarChartData(data) {
            let dynamicRecord = {
                labels: data.map(item => item.name),
                datasets: [
                    {
                        label: 'Top Hotels',
                        backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16', '#41B883'],
                        data: data.map(item => parseFloat(item.count))
                    }
                ]
            }
            return dynamicRecord;
        }
    },
    mounted() {
        this.getChartData();
    },
}
</script>

<template>
    <div class="chart">
        <Bar id="barchart" :data="barchart_data" :options="chart_options" />
    </div>
    <div class="chart">
        <Pie id="chart1" :data="chart_one_data" :options="chart_options" />
    </div>
    <div class="chart">
        <Pie id="chart2" :data="chart_two_data" :options="chart_options" />
    </div>
    <div class="chart">
        <Pie id="chart3" :data="chart_three_data" :options="chart_options" />
    </div>
    <div class="chart">
        <Pie id="chart4" :data="chart_four_data" :options="chart_options" />
    </div>
    <div class="chart">
        <Pie id="chart5" :data="chart_five_data" :options="chart_options" />
    </div>

</template>

<style scoped>
.search-results {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
}
.chart{
    margin: 20px 0px 40px 0px;
}
</style>
