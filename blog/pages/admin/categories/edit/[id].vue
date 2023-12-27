<template>
  <div class="page-container">
    <Head>
      <Title>Dashboard | Edit Category</Title>
    </Head>
    <h1 class="text-4xl mb-8">
      Editing Category: {{ categoryInfo.name }}
    </h1>
    <form>
      <div
        class="input-group"
        :class="field"
        v-for="(value, field) in categoryInfo"
        :key="value"
      >
        <TextInput
          v-if="field == 'id'"
          :label="getFieldLabel(field)"
          :required="false"
          :placeholder="getFieldLabel(field)"
          :disabled="getDisabledFields(field)"
          :modelValue="value"
          :type="text"
          :inputFull="true"
          :noBorder="true"
          class="idField"
        />
        <TextInput
          v-if="field == 'name'"
          :label="getFieldLabel(field)"
          :required="true"
          :placeholder="getFieldLabel(field)"
          :disabled="getDisabledFields(field)"
          :modelValue="value"
          v-model="categoryTitle"
          :type="text"
          :inputFull="true"
          :noBorder="false"
          class="titleField"
        />
      </div>
      <div class="button-wrapper">
        <ButtonInput
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white"
          rounded
          text="Save Changes"
          @click.prevent="editCategory(field)"
        />
        <ButtonInput
          type="submit"
          class="bg-red-500 hover:bg-red-700 text-white"
          rounded
          text="Delete Category"
          @click.prevent="openConfirm()"
        />
      </div>
    </form>
    <ModalComponent :data="item" ref="pageModal" @confirm="handleConfirm" />
  </div>
</template>

<style lang="scss" scoped>
.categories {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;

  .categories-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  .button-group {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    .buttons {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
    }
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

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .button-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 10px;
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
      categoryInfo: [],
      categoryTitle: ''
    };
  },
  methods: {
    getFieldLabel(field) {
      return field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ");
    },
    async openConfirm() {
      const data = {
        title: `Are you sure you want to delete Post: ${this.categoryInfo.id}`,
        message: `By deleting Post ${this.categoryInfo.id} you are going to delete this category for all posts. Are you sure?`,
        isConfirm: true,
        type: "danger",
        data: this.categoryInfo.id,
      };
      await this.$refs.pageModal.openModal(data);
    },
    async handleConfirm({ data }) {
      await this.$useFetch(`categories/${data}`, "DELETE");
      this.$router.push("/admin/categories");
    },
    async editCategory() {
      const done = await this.$useFetch(`categories/${this.$route.params.id}`, "PATCH", {name: this.categoryTitle});
      await this.fetchCategoryInfo()
      console.log(done)
    },
    async excludeCategory() {
      await this.$useFetch(`categories/${this.$route.params.id}`, "DELETE");
      this.$router.push("/admin/categories");
    },
    getDisabledFields(givenField) {
      return givenField == "id" ? true : false;
    },
    async fetchCategoryInfo() {
      const response = await this.$useFetch(
        `categories/${this.$route.params.id}`
      );
      this.categoryInfo = response;
    },
  },
  async created() {
    this.fetchCategoryInfo();
  },
  mounted() {
    console.log(this.categoryInfo)
  }
};
</script>