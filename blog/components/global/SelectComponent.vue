<template>
  <div :class="!disabled ? '' : 'opacity-50 pointer-events-none'">
    <label v-if="required && label" for="required-email">
      {{ label }}:
      <span class="text-red-500 required-dot"> * </span>
    </label>
    <label v-else-if="label" for="label-input"> {{ label }}: </label>
    <select
      @input="$emit('update:modelValue', $event.target.value)"
      :value="modelValue"
      :disabled="disabled"
      :name="label"
      class="py-3 px-4 max-w-md pe-9 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
    >
      <option v-for="(option, index) in options" :disabled="index==0" :key="index" :value="option">
        {{ option }}
      </option>
    </select>
  </div>
</template>
<script>
export default {
  data() {},
  props: {
    label: String,
    modelValue: String,
    options: Array,
    required: Boolean,
    disabled: Boolean,
  },
};
</script>

