<template>
  <header class="header">
    <TextInput class="search" type="text" noBorder placeholder="Search Here..." />
    <ButtonInput>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 text-gray-500 hover:text-blue-500"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </ButtonInput>
  </header>
</template>

<style lang="scss" scoped>
.header {
  background: #f1f1f1;
  display: flex;
  align-items: center;
  justify-content: center;
  .search {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 400px;
  }
  button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 !important;
    justify-content: center;
    box-shadow: none;
    position: unset;
  }
}
</style>