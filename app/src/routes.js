import { createWebHistory, createRouter } from 'vue-router'

// defining route components
import MainPage from './components/MainPage.vue'
import DashboardPage from './components/DashboardPage.vue'
import LoginPage from './components/login/LoginPage.vue'
import SignupPage from './components/login/SignUpPage.vue'
import ProfilePage from './components/ProfilePage.vue'

// definging the routes
const routes = [
    { path: '/', name: 'HomePage', component: MainPage },
    { path: '/dashboards', name: 'DashboardPage', component: DashboardPage },
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/login/signup', name: 'Signup', component: SignupPage },
    { path: '/profile', name: 'Profile', component: ProfilePage }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// validate each route if the user is logged in
router.beforeEach(async (to) => {
    // get the x-user from the localstorage
    const user = localStorage.getItem('x-user')

    
    if( to.name !== 'Signup'){
    // navigate to login page if not authenticated
    if (!user && to.name !== 'Login') {
        // redirect the user to the login page
        return { name: 'Login' }
    }
    }

})

export default router
