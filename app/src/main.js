import { createApp } from 'vue'
import router from './routes'

import './assets/main.css'

import App from './App.vue'

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import * as chartConfig from './chartConfig.js'

ChartJS.register(ArcElement, Tooltip, Legend)

// setting up the app and router together
createApp(App)
    .use(Pie)
    .use(router)
    .mount('#app')
