<template>
    <div :class=" !disabled ? '' : 'opacity-50 pointer-events-none' ">
    <label for="label-input">
        {{label}}:
    </label>
    <select @input="$emit('update:modelValue', $event.target.value)" :value="modelValue" :disabled="disabled" class="" :name="label">
        <option v-for="option in options" :key="option.id" :value="option.id">
            {{ option.name }}
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
        options: Array
    }
}
</script>

