
<template>
  <div
    class="bg-slate-700 flex h-screen items-center flex-col justify-center w-screen"
  >
    <Head>
      <Title>Login</Title>
    </Head>
    <form
      @submit.prevent="handleLogin(this.loginUsername, this.loginPassword)"
      method="POST"
      class="bg-slate-900 p-10 rounded-md"
    >
      <h1 class="text-white text-2xl text-center w-full mb-5">Login</h1>
      <TextInput
        class="my-4 text-white"
        v-model="loginUsername"
        label="Username"
        type="text"
        placeholder="Your Username"
        :required="true"
        inputFull
      />
      <TextInput
        class="my-4 text-white"
        v-model="loginPassword"
        label="Password"
        type="password"
        placeholder="Your Password"
        :required="true"
        inputFull
      />
      <ButtonInput
        text="Login"
        type="submit"
        rounded
        class="mt-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200"
        buttonFull
      />
    </form>
  </div>
</template>

<script>
import { useAuth } from "~/composables/auth";
const { session, refresh, update, reset } = await useSession();
const validateToken = async () => {
  const router = useRouter();
  const { session, update, reset } = await useSession();
  const dateString = session.value.createdAt;
  let dateObject = new Date(dateString);
  dateObject.setHours(
    dateObject.getHours() + session.value.expiresIn / 3600
  );
  const dateNow = new Date();
  const isTokenValid = !dateObject > dateNow;
  if (isTokenValid) {
    router.push("/login");
    reset();
    return false;
  } else {
    update(isTokenValid);
    return true;
  }
};
export default {
  data() {
    return {
      loginUsername: "",
      loginPassword: "",
    };
  },
  methods: {
    async handleLogin(username, password) {
      const { login } = await useAuth();
      const loginResponse = await login({ username, password });
      update(loginResponse);
      this.redirect();
    },
    async redirect() {
      const result = validateToken();
      if (result) {
        this.$router.push("/admin");
      } else {
        this.$router.push("/login");
      }
    },
  },
};
</script>