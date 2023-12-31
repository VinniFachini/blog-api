<template>
  <div class="page-container">
    <Head>
      <Title>Dashboard | User</Title>
    </Head>
    <h1 class="text-4xl">User: {{ userInfo.username }}</h1>
    <div class="user-container">
      <div class="user-info">
        <div
          class="input-group"
          :class="field"
          v-for="(value, field) in userInfo"
          :key="value"
        >
          <TextInput
            v-if="field != 'user_image'"
            :type="getFieldType(field)"
            :label="getFieldLabel(field)"
            noBorder
            :disabled="true"
            :modelValue="setProperValue(field, value)"
          />
        </div>
      </div>
      <div class="user-image">
        <img :src="userImage()" alt="" />
      </div>
    </div>
    <ModalComponent :data="item" ref="pageModal" @confirm="handleConfirm" />
  </div>
</template>
  
<style lang="scss" scoped>
img {
  max-width: 350px;
  width: 100%;
  border-radius: 50%;
  aspect-ratio: 1/1;
  object-fit: cover;
  margin-top: 20px;
}
</style>    
  
<script>
export default {
  setup() {
    definePageMeta({
      layout: "dashboard",
      name: "users",
    });
  },
  data() {
    return {
      userInfo: [],
      created_at: "",
    };
  },
  methods: {
    async fetchUserInfo() {
      const response = await this.$useFetch(`users/${this.$route.params.id}`);
      this.userInfo = await response;
      this.created_at = this.formatDates(await response.created_at);
    },
    getFieldLabel(field) {
      return field.charAt(0).toUpperCase() + field.slice(1).replace("_", " ");
    },
    getFieldType(givenField) {
      {
        if (givenField === "created_at" || givenField === "updated_at") {
          return "datetime-local";
        } else {
          return "text";
        }
      }
    },
    userImage() {
      if (this.userInfo.user_image == null) {
        return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
      } else if (this.userInfo.user_image != null) {
        return `http://localhost:3001/uploads/${this.userInfo.user_image}`;
      }
    },
    setProperValue(field, value) {
      if (field === "updated_at" || field === "created_at") {
        const newValue = new Date(value);
        newValue.setMinutes(
          newValue.getMinutes() - newValue.getTimezoneOffset()
        );
        return newValue.toISOString().slice(0, 16);
      } else {
        return value;
      }
    },
    // async fetchPostComments() {
    //   const response = await this.$useFetch(
    //     `posts/${this.$route.params.id}/comments`
    //   );
    //   this.postComments = await response;
    //   console.log(this.postComments)
    // },
    formatDates(a) {
      const dateObject = new Date(a);
      return dateObject.toLocaleString("pt-BR");
    },
    // formatContent() {
    //   let formatedPost = this.post.content
    //     .split("\n")
    //     .filter((item) => item != "");
    //   this.postContent = formatedPost;
    // },
    // goToCategory(cat) {
    //   this.$router.push(`/admin/categories/${cat}`)
    // },
    // removeTag(item, delimeter) {
    //   let size = delimeter.length;
    //   return item.slice(size);
    // },
    // async handleHeadings(item, index) {
    //   let paragraphElement = await this.$el.querySelector(".postContent");
    //   paragraphElement = await Array.from(paragraphElement.children)[index];

    //   if (paragraphElement.innerText.startsWith("#text-left")) {
    //     paragraphElement.classList.add("text-left", "indent-6");
    //     paragraphElement.innerText = paragraphElement.innerText.replace(
    //       "#text-left ",
    //       ""
    //     );
    //   } else if (paragraphElement.innerText.startsWith("#text-right")) {
    //     paragraphElement.classList.add("text-right", "indent-6");
    //     paragraphElement.innerText = paragraphElement.innerText.replace(
    //       "#text-right ",
    //       ""
    //     );
    //   } else if (paragraphElement.innerText.startsWith("#text-center")) {
    //     paragraphElement.classList.add("text-center", "indent-6");
    //     paragraphElement.innerText = paragraphElement.innerText.replace(
    //       "#text-center ",
    //       ""
    //     );
    //   } else if (paragraphElement.innerText.startsWith("#text-justify")) {
    //     paragraphElement.classList.add("text-justify", "indent-6");
    //     paragraphElement.innerText = paragraphElement.innerText.replace(
    //       "#text-justify ",
    //       ""
    //     );
    //   } else if (paragraphElement.innerText.startsWith("###")) {
    //     paragraphElement.classList.add("text-xl", "font-bold");
    //     paragraphElement.innerText = paragraphElement.innerText.replace(
    //       "###",
    //       ""
    //     );
    //   } else if (paragraphElement.innerText.startsWith("##")) {
    //     paragraphElement.classList.add("text-2xl", "font-bold");
    //     paragraphElement.innerText = paragraphElement.innerText.replace(
    //       "##",
    //       ""
    //     );
    //   } else if (paragraphElement.innerText.startsWith("#")) {
    //     paragraphElement.classList.add("text-3xl", "font-bold");
    //     paragraphElement.innerText = paragraphElement.innerText.replace(
    //       "#",
    //       ""
    //     );
    //   }
    // },
  },
  async created() {
    await this.fetchUserInfo();
  },
  mounted() {},
};
</script>