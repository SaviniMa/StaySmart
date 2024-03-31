<template lang="">
    <div class="profilepage">
        <form class="profile-panel" @submit="update($event)">
            <div>
                <h3>Please select your preferences</h3>
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
                    class="btn btn-primary"
                    type="submit"
                    value="Update"
                />
            </div>
        </form>
    </div>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            errorMessage: '',
            preferences: [],
            selectedPreferences: []
        }
    },
    async created() {
        await this.getUserPreferences();
        await this.getPreferences();
    },
    methods: {
        async update(e) {
            this.errorMessage = ''
            e.preventDefault()
            const payload = {
                "email": this.emailAddress,
                "preferences": this.selectedPreferences
            }
            try {
                const response = await axios.put('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/users', payload);
                alert(response.data.message);

            } catch (error) {
                console.error(error);
                this.errorMessage = error.message;
            }
        },
        async getPreferences() {
            const response = await axios.get('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/tags/top');
            this.preferences = response.data.data.map(item => {
                return item.tag
            });
        },
        async getUserPreferences() {
            this.emailAddress = localStorage.getItem('x-user');
            const response = await axios.get('https://jr0m39z7w3.execute-api.ca-central-1.amazonaws.com/Prod/users/preferences?email=' + this.emailAddress);
            this.selectedPreferences = response.data.data;
        }
    },
}
</script>
<style scoped>
.profilepage {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    margin-top: 120px;
}

.checkboxs {
    display: grid;
    justify-content: space-around;
    padding: 10px;
    margin-bottom: 20px;
}

.checkbox {
    margin: 5px;

    input {
        margin-right: 10px;
    }
}

.page-title {
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

.name-spans {
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

.profile-panel {
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

input[type='email'],
input[type='password'],
input[type='text'] {
    width: 100%;
    display: flex;
    margin: 10px 0px 20px 0px;
    box-sizing: border-box;
    border: 2px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}
</style>
