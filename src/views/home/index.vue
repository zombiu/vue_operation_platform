<template>
    <el-card>
        <!-- 如果只是将user设置到card上 优先级不够 -->
        <div class="user">
            <img :src="userStore.avatar" alt="" class="avatar">
            <div class="username">
                <h3>{{ getTime() }}{{ userStore.username }}</h3>
                <span>甄选商城运营平台</span>
            </div>
        </div>
    </el-card>

    <div class="bottom">
        <SvgIcon name="welcome" width="500px" height="500px" class="svgImg"></SvgIcon>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { getTime } from '@/utils/time';
const userStore = useUserStore()

</script>

<style scoped lang="scss">
.user {
    display: flex;

}

.svgImg {
    width: 500px;
    height: 500px;

}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: aquamarine;
}

.bottom {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>