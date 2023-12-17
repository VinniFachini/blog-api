<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <span @click="closeModal" class="close-button">&times;</span>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button  class="bg-green-500 py-2 px-5 text-white rounded-md hover:bg-green-700 transition-all" v-if="isConfirm" @click="handleConfirm">Confirm</button>
        <button class="bg-red-500 py-2 px-5 text-white rounded-md hover:bg-red-700 transition-all"  @click="closeModal">Close</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-overlay{
  position: fixed;
  top: 0;
  left: 0;
  width: 100dvw;
  height: 100dvh;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  .modal-container {
    background-color: white;
    padding: 10px 20px 20px 20px;
    border-radius: 10px;
    width: 100%;
    max-width: 500px;
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #c1c1c1;
      position: relative;
      padding-bottom: 10px;
      span {
        font-size: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        position: absolute;
        top: 0px;
        right: 0px;
        cursor: pointer;
      }
      h2 {
        font-size: 20px;
        
      }
    }
    .modal-body {
      font-size: 16px;
      line-height: 1;
      padding: 16px 0;
    }
    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
    }
  }
}
</style>
  
<script>
export default {
  data() {
    props: {
      data: String;
    }
    return {
      showModal: false,
      title: "",
      message: "",
      isConfirm: false,
      data: null,
      type: ''
    };
  },
  methods: {
    openModal({ title, message, isConfirm, data, type }) {
      this.title = title;
      this.message = message;
      this.isConfirm = isConfirm;
      this.type = type
      this.showModal = true;
      this.data = data;
    },
    closeModal() {
      this.showModal = false;
    },
    handleConfirm() {
      this.showModal = false;
      // Additional arguments
      // Emit the 'confirm' event with the current data and additional arguments
      this.$emit("confirm", {
        title: this.title,
        message: this.message,
        isConfirm: this.isConfirm,
        // Additional arguments are spread into the object
        data: this.data,
      });
    },
  },
};
</script>