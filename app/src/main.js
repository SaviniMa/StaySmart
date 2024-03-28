import { createApp } from 'vue'
import router from './routes'

import './assets/main.css'

import App from './App.vue'

import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { Bar } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend, Title, BarElement, CategoryScale, LinearScale)

// setting up the app and router together
createApp(App)
    .use(Pie)
    .use(Bar)
    .use(router)
    .mount('#app')
