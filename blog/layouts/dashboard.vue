<template>
    <div class="dashboard">
        <DashboardSideBar /> 
        <DashboardHeader class="header" />
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.dashboard {
    display: grid;
    grid-template-areas: 
    "sidebar header header"
    "sidebar content content";
    grid-template-columns: 250px 1fr;
    height: 100dvh;
    grid-template-rows: 60px 1fr;
    width: 100dvw;
}
.sidebar-container {
    grid-area: sidebar;
}

.header {
    grid-area: header;
}

.content {
    grid-area: content;
    padding: 20px;
}
</style>

<script>

import { useAuth } from '~/composables/auth';

export default {
    setup() {
        const {loggedIn, user, logout} = useAuth()

        return {loggedIn, user, logout}
    }
}

</script>