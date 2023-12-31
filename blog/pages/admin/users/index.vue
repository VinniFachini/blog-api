<template>
  <div class="content">
    <Head>
      <Title>Dashboard | Users</Title>
    </Head>
    <div class="users-header">
      <h1 class="text-4xl">Users</h1>
      <NuxtLink to="/admin/users/new">
        <ButtonInput
          class="custom-button bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 mt-4 transition-all duration-300 ease-in-out"
        >
          <!-- SVG for New Post Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="none"
            class="w-6 h-6"
          >
            <path
              d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 8a3.91 3.91 0 0 0 4 4 3.91 3.91 0 0 0 4-4 3.91 3.91 0 0 0-4-4 3.91 3.91 0 0 0-4 4zm6 0a1.91 1.91 0 0 1-2 2 1.91 1.91 0 0 1-2-2 1.91 1.91 0 0 1 2-2 1.91 1.91 0 0 1 2 2zM4 18a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1h2v-1a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v1h2z"
            ></path>
          </svg>
          <span>New User</span>
        </ButtonInput>
      </NuxtLink>
    </div>
    <!-- Display the paginated posts using DashboardTable component -->
    <DashboardTable
      :data="users"
      :fields="usersFields"
      :editAble="true"
      :approvable="false"
    />
  </div>
</template>

<script setup>
definePageMeta({
  layout: "dashboard",
});
</script>

<script>
export default {
  data() {
    return {
      users: [],
      usersFields: [],
    };
  },
  async mounted() {
    const response = await this.$useFetch("users");
    this.users = response;
    this.usersFields = Object.keys(response[0]);
  },
};
</script>

<style lang="scss" scoped>
.custom-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 !important;
}

.users-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  button {
    padding: 8px;
    margin: 0 4px;
    border: 1px solid #4a90e2;
    border-radius: 3px;
    cursor: pointer;
    min-height: 40px;
    max-height: 40px;
    line-height: 1 !important;
    transition: all 0.2s linear;
  }

  button:hover {
    background-color: #4a90e2;
    color: #fff;
  }

  .numbered-buttons {
    display: flex;

    button {
      padding: 8px;
      transition: all 0.2s linear;
      margin: 0 4px;
      border: 1px solid #4a90e2;
      border-radius: 3px; // Square border-radius
      cursor: pointer;
      aspect-ratio: 1/1 !important;
      width: 40px;
    }

    button:hover {
      background-color: #4a90e2;
      color: #fff;
    }

    .active {
      background-color: #4a90e2;
      color: #fff;
    }
  }
}
</style>
