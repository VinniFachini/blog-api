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

<script>
const validateToken = async () => {
  const router = useRouter()
  const { session, update, reset } = await useSession()
  const dateString = session.value.createdAt
  let dateObject = new Date(dateString)
  dateObject.setHours(dateObject.getHours() + session.value.expiresIn / 3600)
  const dateNow = new Date()
  const isTokenValid = !dateObject > dateNow
  if (isTokenValid) {
    router.push('/login')
    reset()
    return false
  } else {
    update(isTokenValid)
    return true
  }
}
export default {
    methods: {
        async verify() {
            const result = await validateToken();
            const route = useRouter()
            if(!result) {
                route.push('/login')
                console.log('Sessão expirada!')
            }
        }
    },
    updated() {
        this.verify()
    },
    mounted() {
        this.verify()
    },
    created() {
      this.verify()
    }
}
</script>