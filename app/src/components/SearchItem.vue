<script>
export default {
    props: {
        searchItem: {
            type: Object,
            required: true,
        },
    },
    methods: {
        openNewTab(hotelUrl) {
            window.open(hotelUrl, '_blank');
        }
    },
}
</script>

<template>
    <div class="search-item" @click="openNewTab(searchItem.hotelUrl)">
        <div class="hotel-img">
            <img :src="searchItem.imgUrl" alt="">
        </div>
        <div class="hotel-info">
            <div class="hotelname">
                {{ searchItem.hotelName }}
                <i> - {{ searchItem.date }}</i>
            </div>
            <div>{{ searchItem.city }}</div>
            <div>{{ searchItem.reviews }}</div>
            <!-- <ul v-if="searchItem.tags.length">
                <li v-for="pair in searchItem.food_pairing">{{ pair }}</li>
            </ul> -->
        </div>
    </div>
</template>

<style scoped>
.hotelname {
    font-size: 18px;
    font-weight: bold;
}

.hotel-img {
    display: flex;
    justify-content: center;
    img {
        width: 200px;
        height: 200px;
    }
}

.hotel-info {
    padding: 0 20px;
}

.search-item {
    cursor: pointer;
    padding: 15px;
    border-radius: 10px;
    background-color: #242424;
    margin-bottom: 10px;
    user-select: none;
    max-width: 1000px;
    display: flex;
    flex-direction: row;
}
</style>
