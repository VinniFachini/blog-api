<template>
  <div class="content">
    <Head>
      <Title>Dashboard | Categories</Title>
    </Head>
    <div class="categories-header">
      <h1 class="text-4xl">Categories</h1>
      <NuxtLink to="/admin/categories/new">
        <ButtonInput
          class="custom-button bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 mt-4 transition-all duration-300 ease-in-out"
        >
          <!-- SVG for New Post Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 6h.008v.008H6V6z"
            />
          </svg>
          <span>New Category</span>
        </ButtonInput>
      </NuxtLink>
    </div>
    <!-- Display the paginated posts using DashboardTable component -->
    <DashboardTable
      :data="categories"
      :fields="categorieFields"
      :canRead="true"
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
      categories: [],
      categorieFields: [],
    };
  },
  async mounted() {
    const response = await this.$useFetch("categories");
    this.categories = response;
    this.categorieFields = Object.keys(response[0]);
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

.categories-header {
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
