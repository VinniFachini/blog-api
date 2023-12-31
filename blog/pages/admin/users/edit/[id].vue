<template>
  <div class="page-container">
    <Head>
      <Title>Dashboard | Edit User</Title>
    </Head>
    <h1 class="text-4xl mb-8">
      Currently editing user: {{ userInfo.username }}
    </h1>
    <div class="user-info-form">
      <form>
        <div
          class="input-group"
          :class="field"
          v-for="(value, field) in userInfo"
          :key="value"
        >
          <TextInput
            v-if="field == 'created_at' || field == 'updated_at'"
            :label="getFieldLabel(field)"
            :required="false"
            :disabled="getDisabledFields(field)"
            :modelValue="setProperValue(field, value)"
            :type="getFieldType(field)"
            noBorder
          />

          <TextInput
            v-if="field == 'id'"
            :label="getFieldLabel(field)"
            :required="false"
            :disabled="getDisabledFields(field)"
            :modelValue="setProperValue(field, value)"
            :type="getFieldType(field)"
            noBorder
          />

          <TextInput
            v-else-if="field == 'name'"
            :label="getFieldLabel(field)"
            :required="true"
            :placeholder="getFieldLabel(field)"
            :disabled="getDisabledFields(field)"
            :modelValue="setProperValue(field, value)"
            :type="getFieldType(field)"
            :inputFull="true"
            :noBorder="false"
            v-model="name"
          />
          <TextInput
            v-else-if="field == 'username'"
            :label="getFieldLabel(field)"
            :required="true"
            :placeholder="getFieldLabel(field)"
            :disabled="getDisabledFields(field)"
            :modelValue="setProperValue(field, value)"
            :type="getFieldType(field)"
            :inputFull="true"
            :noBorder="false"
            v-model="username"
          />
          <TextInput
            v-else-if="field == 'email'"
            :label="getFieldLabel(field)"
            :required="true"
            :placeholder="getFieldLabel(field)"
            :disabled="getDisabledFields(field)"
            :modelValue="setProperValue(field, value)"
            :type="getFieldType(field)"
            :inputFull="true"
            :noBorder="false"
            v-model="email"
          />

          <SelectComponent
            v-else-if="field == 'role'"
            required
            v-model="role"
            label="Role"
            :options="['Select a Role', 'Reader', 'Admin']"
          />

          <FileInput
            v-else-if="field == 'user_image'"
            accept=".jpg, .jpeg, .png"
            description="PNG, JPG, and JPEG are Allowed."
            label="User Image"
            required
            @change="uploadImage"
          />
        </div>
        <div class="button-wrapper">
          <ButtonInput
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white"
            rounded
            text="Save Changes"
            @click.prevent="editUser"
          />
          <ButtonInput
            type="submit"
            class="bg-red-500 hover:bg-red-700 text-white"
            rounded
            text="Delete User"
            @click.prevent="openConfirm()"
          />
        </div>
      </form>
      <div class="user-preview">
        <h2 class="text-4xl mb-8">User picture preview</h2>
        <img :src="userImage()" alt="" />
      </div>
    </div>
    <ModalComponent :data="item" ref="pageModal" @confirm="handleConfirm" />
  </div>
</template>

<style lang="scss" scoped>
.user-info-form {
  display: flex;
  form {
    width: 100%;
    max-width: 40%;
  }
  .user-preview {
    width: 100%;
    max-width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    img {
      width: 100%;
      max-width: 600px;
      aspect-ratio: 1/1;
      object-fit: cover;
      border-radius: 50%;
    }
  }
}

.button-wrapper {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: flex-start;
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
      userInfo: [],
      created_at: "",
      role: "Reader",
      image: null,
      name: "",
      username: "",
      email: "",
    };
  },
  methods: {
    async fetchUserInfo() {
      const response = await this.$useFetch(`users/${this.$route.params.id}`);
      this.userInfo = await response;
      this.created_at = this.formatDates(await response.created_at);
      this.name = response.name;
      this.username = response.username;
      this.email = response.email;
    },
    async deleteItem(itemId) {
      const data = {
        title: `Deleting: ${itemId}`,
        message: `Deleting item ${itemId}. Are you sure?`,
        isConfirm: true,
        type: "danger",
        data: itemId,
        method: "DELETE",
      };
      await this.$refs.pageModal.openModal(data);
    },
    async handleConfirm(data) {
      const page =
        this.$route.name.split("-").length > 1
          ? this.$route.name.split("-")[1]
          : this.$route.name;

      if (data.method == "DELETE") {
        await this.$useFetch(`${page}/${data.data}`, data.method);
      } else if (data.method == "PATCH") {
        await this.$useFetch(`${page}/${data.data}/approve`, data.method);
      }

      this.$router.go();
    },
    userImage() {
      if (this.userInfo.user_image == null && this.image == null) {
        return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
      } else if (this.userInfo.user_image != null && this.image == null) {
        return `http://localhost:3001/uploads/${this.userInfo.user_image}`;
      } else if (
        (this.userInfo.user_image != null && this.image != null) ||
        (this.userInfo.user_image == null && this.image != null)
      ) {
        return this.image;
      }
    },
    uploadImage(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.image = reader.result;
      };
      if (file) {
        reader.readAsDataURL(file); // This will trigger the onloadend callback once the file is read.
      }
    },
    formatDates(a) {
      const dateObject = new Date(a);
      return dateObject.toLocaleString("pt-BR");
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
    async openConfirm() {
      const data = {
        title: `Are you sure you want to delete user: ${this.userInfo.id}`,
        message: `By deleting user ${this.userInfo.id} you are going to delete all of its comments and posts. Are you sure?`,
        isConfirm: true,
        type: "danger",
        data: this.userInfo.id,
      };
      await this.$refs.pageModal.openModal(data);
    },
    async handleConfirm({ data }) {
      await this.$useFetch(`users/${data}`, "DELETE");
      this.$router.push("/admin/users");
    },
    async editUser() {
      let data = {
        name: this.name,
        username: this.username,
        email: this.email,
        role: this.role,
      };

      if (this.image !== null && typeof this.image !== "undefined") {
        data.image = this.image;
      }

      console.log(data, this.image);
      await this.$useFetch(`users/${this.$route.params.id}`, "PATCH", data);
    },
    getDisabledFields(givenField) {
      return givenField == "created_at" ||
        givenField == "updated_at" ||
        givenField == "id" ||
        givenField == "author_id"
        ? true
        : false;
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
  },
  async mounted() {
    await this.fetchUserInfo();
  },
  updated() {},
};
</script>