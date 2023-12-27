<template>
  <div class="page-wrapper">
    <Head>
      <Title>Dashboard | New Category</Title>
    </Head>
    <div class="category-title">
      <div class="text-4xl">New Category</div>
    </div>
    <form>
      <TextInput
        type="text"
        label="Category Name"
        required
        placeholder="Category Name"
        v-model="categoryTitle"
        class="textInput"
        inputFull
      />
      <ButtonInput
        @click.prevent="createCategory()"
        text="Create Category"
        class="bg-blue-500 hover:bg-blue-700"
        rounded
        type="submit"
      />
    </form>
    <ModalComponent ref="pageModal" />
  </div>
</template>


<style lang="scss" scoped>
.textInput {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 10px;
  margin-block: 20px 30px;
}
.categories {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  flex-direction: column;
  .categories-buttons {
    display: flex;
    gap: 10px;
    flex-direction: column;
    align-items: flex-start;
  }
  .button-group {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 40px;
    span {
      min-width: 150px;
    }
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      padding: 8px 10px;
    }
  }
}
</style>
  

<script>
export default {
  setup() {
    definePageMeta({
      layout: "dashboard",
    });
  },
  data() {
    return {
      categoryTitle: "",
    };
  },
  methods: {
    async createCategory() {
      await this.$useFetch("categories", "POST", { name: this.categoryTitle });
      const data = {
        title: "Success!",
        message: "The category was created succesfully!",
        isConfirm: false,
      };
      await this.$refs.pageModal.openModal(data);
    },
  },
};
</script>
