<template>
  <div class="page-wrapper">
    <Head>
      <Title>Dashboard | New User</Title>
    </Head>
    <div class="post-title">
      <div class="text-4xl">New User</div>
    </div>
    <form @submit.prevent="createUser">
      <TextInput
        type="text"
        label="Name"
        required
        placeholder="Name"
        v-model="name"
        class="textInput"
        inputFull
      />
      <TextInput
        type="text"
        label="Username"
        required
        placeholder="Username"
        v-model="username"
        inputFull
        class="textInput"
      />
      <TextInput
        type="text"
        label="Email"
        required
        placeholder="Email"
        v-model="email"
        inputFull
        class="textInput"
      />
      <TextInput
        type="text"
        label="Email Confirmation"
        required
        placeholder="Email Confirmation"
        v-model="confirmEmail"
        inputFull
        class="textInput"
      />
      <TextInput
        type="text"
        label="Password"
        required
        placeholder="Password"
        v-model="password"
        class="textInput"
        inputFull
      />

      <FileInput accept=".jpg, .jpeg, .png" description="PNG, JPG, and JPEG are Allowed." label="User Image" required @change="uploadImage" />

      <SelectComponent required v-model="role" label="Role" :options="['Reader', 'Admin']" />

      <ButtonInput
        text="Create User"
        class="bg-blue-500 hover:bg-blue-700 w-full max-w-md mt-5"
        rounded
        type="submit"
        @click.prevent="createUser"
      />
    </form>
    <ModalComponent ref="pageModal" />
  </div>
</template>

<script>
export default {
  setup() {
    definePageMeta({
      layout: "dashboard",
    });
  },
  data() {
    return {
      name: "",
      username: "",
      email: "",
      confirmEmail: "",
      role: "Reader",
      password: "",
      image: null,
    };
  },
  methods: {
    async createUser() {
      const userReady = await this.checkFields();

      console.log("clicado");
      console.log(userReady);

      if (userReady) {
        const userData = {
          name: this.name,
          username: this.username,
          email: this.email,
          password: this.password,
          role: this.role,
          image: this.image,
        };
        console.log(userData);
        try {
          const response = await this.$useFetch(
            "auth/register",
            "POST",
            userData
          );
          console.log(response);
          // Handle success logic here
          if (response.status == 201) {
            const data = {
              title: "User Created Successfully",
              message: "The user was created successfully!",
              isConfirm: false,
            };
            await this.$refs.pageModal.openModal(data);
          }
        } catch (err) {
          let errorMessage = "Failed to create user";
          if (err.response && err.response.data && err.response.data.error) {
            errorMessage = err.response.data.error;
          }
          const data = {
            title: "Error",
            message: errorMessage,
            isConfirm: false,
          };
          await this.$refs.pageModal.openModal(data);
        }
      }
    },
    uploadImage(e) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        // The result contains the Base64 encoded string
        this.image = reader.result;
      };
      if (file) {
        reader.readAsDataURL(file); // This will trigger the onloadend callback once the file is read.
      }
    },
    async checkFields() {
      if (this.name.length <= 0) {
        const data = {
          title: "Name",
          message: "The user must have a name!",
          isConfirm: false,
        };
        await this.$refs.pageModal.openModal(data);
        return false;
      } else if (this.username.length <= 0) {
        const data = {
          title: "Username",
          message: "The user must have a username!",
          isConfirm: false,
        };
        await this.$refs.pageModal.openModal(data);
        return false;
      } else if (this.email.length <= 0) {
        const data = {
          title: "Email",
          message: "The user must have an e-mail",
          isConfirm: false,
        };
        await this.$refs.pageModal.openModal(data);
        return false;
      } else if (this.role.length <= 0) {
        const data = {
          title: "Role",
          message: "The user must have a role",
          isConfirm: false,
        };
        await this.$refs.pageModal.openModal(data);
        return false;
      } else if (this.password.length <= 0) {
        const data = {
          title: "Password",
          message: "The user must have a password",
          isConfirm: false,
        };
        await this.$refs.pageModal.openModal(data);
        return false;
      } else {
        const data = {
          title: "User Created successfully",
          message: "The user was created successfully!",
          isConfirm: false,
        };
        await this.$refs.pageModal.openModal(data);
        return true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// Your existing styles remain unchanged
.text-input {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
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
