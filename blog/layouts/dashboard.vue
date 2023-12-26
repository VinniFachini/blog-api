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
  height: 100%;
  grid-template-rows: 60px 1fr;
  width: 100%;
}
.sidebar-container {
  grid-area: sidebar;
  position: fixed;
  top: 0;
  width: 250px;
  height: 100vh;
  left: 0;
}

.header {
  grid-area: header;
}

.content {
  grid-area: content;
  padding: 20px;
}
</style>

<script setup>

</script>

<script>
export default {
  methods: {
    async verify() {
      const result = await this.$validateToken()
      const router = useRoute()
      if(!result) {
        router.push('/login')
      }
    },
  },
  updated() {
    this.verify();
  },
  mounted() {
    this.verify();
  },
  created() {
    this.verify();
  },
};
</script>