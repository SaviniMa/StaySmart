<template lang="">
    <div class="signuppage">
        <div class="page-title">
            <img width="120" height="120" src="../../assets/palms.png" alt="" />
            <h1>StaySmart</h1>
            <h4>New User</h4>
        </div>
        <form class="signup-panel" @submit="signup($event)">
            <div class="names">
                <div class="name-spans">
                    <h3>Enter your first name</h3>
                    <h3>Enter your last name</h3>
                </div>
                <div class="name-fields">
                    <input
                        type="text"
                        v-model="firstName"
                        name="firstName"
                        placeholder="first name"
                    />
                    <input
                        type="text"
                        v-model="lastName"
                        name="lastName"
                        placeholder="last name"
                    />
                </div>
            </div>
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
            </div>
            <div>
                <h3>Please confirm your password</h3>
            </div>
            <div>
                <input
                    class="confirmPasswordfield"
                    type="password"
                    v-model="confirmPassword"
                    name="confirmPassword"
                    placeholder="confirm password"
                />
            </div>
            <div>
                <h3>Please enter your preferences</h3>
            </div>
            <div class="checkboxs">
                <div class="checkbox" v-for="(option, index) in preferences" :key="index">
                    <input
                        type="checkbox"
                        :id="'checkbox' + index"
                        :value="option"
                        v-model="selectedPreferences"
                    />
                    <label :for="'checkbox' + index">{{ option }}</label>
                </div>
                <span class="error-msg" v-if="errorMessage != ''">{{
                    errorMessage
                }}</span>
            </div>
            <div class="actions">
                <input
                    :disabled="emailAddress == '' || password == ''"
                    class="btn btn-primary"
                    type="submit"
                    value="Register"
                />
            </div>
        </form>
        <div class="forgot-password">
            <a href="#" @click="back()">Back</a>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            firstName: '',
            lastName: '',
            emailAddress: '',
            password: '',
            confirmPassword: '',
            errorMessage: '',
            preferences: [],
            selectedPreferences: []
        }
    },
    async created() {
        await this.getPreferences();
    },
    methods: {
        async signup(e) {
            this.errorMessage = ''
            e.preventDefault()
            if (this.validateEmailAndPassword(this.emailAddress, this.password, this.confirmPassword)) {
                
                const payload = {
                    "email": this.emailAddress,
                    "firstname": this.firstName,
                    "lastname": this.lastName,
                    "password": this.password,
                    "preferences": this.selectedPreferences
                }
                try {
                    const response = await axios.post('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/users', payload);
                    alert(response.data.message);
                    localStorage.setItem('x-user', this.emailAddress)
                    this.$router.push('/login')
                } catch (error) {
                    console.error(error);
                    this.errorMessage = error.response.data.message;
                }
            }
        },
        async getPreferences () {
            const response = await axios.get('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/tags/top');
                this.preferences = response.data.data.map(item => { 
                    return item.tag});
        },
        back(e) {
            this.$router.push('/login');
        },
        validatePasswords(password, confirmPassword) {
            if (password == '' || confirmPassword == '') {
                this.errorMessage = 'Password and Confirm passwords fields cannot be empty'
                return false
            } else if (password != confirmPassword) {
                this.errorMessage = 'Password and Confirm passwords must match'
                return false
            } else {
                return true
            }
        },
        validateEmailAndPassword(email, password, confirmPassword) {
            if (this.validateEmailAddress(email) && this.validatePasswords(password, confirmPassword)) {
                return true
            } else {
                return false
            }
        },
        validateEmailAddress(email) {
            this.errorMessage = 'Please enter an valid emaill address'
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
.signuppage {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}

.checkboxs {
    display: grid;
    justify-content: space-around;
    padding:10px;
    margin-bottom: 20px;
}

.checkbox{
    margin: 5px;

    input{
        margin-right: 10px;
    }
}

.page-title{
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.names {
    display: flex;
    flex-direction: column;
}

.name-spans{
    display: flex;
    flex-direction: row;

    h3 {
        width: 100%;
    }
}

.name-fields {
    display: flex;

    input {
        width: 100%;
    }
}

.actions {
    display: flex;
    justify-content: center;
}

.error-msg {
    color: rgb(255, 128, 128);
}

.signup-panel {
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

input[type='email'], input[type='password'], input[type='text'] {
    width: 100%;
    display: flex;
    margin: 10px 0px 20px 0px;
    box-sizing: border-box;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}
</style>
