<template lang="">
    <div class="loginpage">
        <div class="page-title">
            <img width="120" height="120" src="../../assets/palms.png" alt="" />
            <h1>StaySmart</h1>
            <h4>Login</h4>
        </div>
        <form class="login-panel" @submit="login($event)">
            <div>
                <h3>Please enter your email</h3>
            </div>
            <div>
                <input
                    type="email"
                    v-model="emailAddress"
                    name="email"
                    placeholder="name@company.com"
                />
            </div>
            <div>
                <h3>Please enter your password</h3>
            </div>
            <div>
                <input
                    class="passwordfield"
                    type="password"
                    v-model="password"
                    name="password"
                    placeholder="password"
                />
                <span class="error-msg" v-if="errorMessage != ''">{{
                    errorMessage
                }}</span>
            </div>
            <div class="actions">
                <input
                    :disabled="emailAddress == '' || password == ''"
                    class="btn btn-primary"
                    type="submit"
                    value="Login"
                />
            </div>
        </form>
        <div class="forgot-password">
            <a href="#" @click='signup()'>New User</a> | <a>Forgot Password</a>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            emailAddress: '',
            password: '',
            errorMessage: '',
        }
    },
    methods: {
        async login(e) {
            this.errorMessage = ''
            e.preventDefault()
            if (this.validateEmailAddress(this.emailAddress)) {
                try {
                    const payload = {
                        "email": this.emailAddress,
                        "password": this.password
                    }
                    const response = await axios.post('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/users/login', payload);
                    
                    console.error(response);
                    localStorage.setItem('x-user', this.emailAddress)
                    localStorage.setItem('x-auth-token', response.data.data.token)
                    this.$router.push('/')   
                } catch (error) {
                    console.error(error);
                    this.errorMessage = error.response.data.message;
                }
            } else {
                this.errorMessage = 'Please enter an valid emaill address'
            }
        },
        signup(e) {
            this.$router.push('/login/signup');
        },
        validateEmailAddress(email) {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
        },
    },
}
</script>
<style scoped>
.loginpage {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

.page-title{
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.forgot-password {
    margin-top: 20px;
}

.actions {
    display: flex;
    justify-content: center;
}

.error-msg {
    color: rgb(255, 128, 128);
}

.login-panel {
    background-color: #242424;
    padding: 15px;
    border-radius: 10px;
    width: 500px;
    display: flex;
    flex-direction: column;
    border: 1px solid grey;
}

input {
    padding: 12px 20px 12px 20px;
}

input[type='email'], input[type='password'] {
    width: 100%;
    display: flex;
    margin: 10px 0px 20px 0px;
    box-sizing: border-box;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}
</style>
