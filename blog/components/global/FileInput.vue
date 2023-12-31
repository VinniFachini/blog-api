<template>
  <div class="max-w-md">
    <label v-if="required && label" for="required-email">
      {{ label }}:
      <span class="text-red-500 required-dot"> * </span>
    </label>
    <label v-else-if="label" for="label-input"> {{ label }}: </label>
    <input
      @change="uploadImage"
      :v-model="image"
      type="file"
      class="w-full text-black text-sm bg-white border file:cursor-pointer cursor-pointer file:border-0 file:py-2.5 file:px-4 file:bg-gray-100 file:hover:bg-gray-200 file:text-black rounded"
      id="upload"
      :accept="accept"
    />
    <p class="text-xs text-gray-400 mt-2">
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      image: null,
    };
  },
  props: {
    required: Boolean,
    label: String,
    modelValue: String,
    description: String,
    accept: String
  },
  methods: {
    uploadImage(e) {
      const file = e.target.files[0];
      const reader = new FileReader();
      this.$emit("update:modelValue", this.image);

      reader.onloadend = () => {
        // The result contains the Base64 encoded string
        this.image = reader.result;
      };
      if (file) {
        reader.readAsDataURL(file); // This will trigger the onloadend callback once the file is read.
      }
    },
  },
};
</script>