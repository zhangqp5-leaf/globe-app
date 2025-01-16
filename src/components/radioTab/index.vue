<template>
  <div
    class="radio-tab"
    v-for="item in options"
  >
    <div
      :class="activeKey === item.value ? 'active' : ''"
      class="btn"
      @click="() => changeTab(item.value)"
      :key="item.value"
    >{{item.label}}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const emit = defineEmits(['changeTab']);

const options = [
  {
    label: 'o',
    value: 1,
  },
  {
    label: '-',
    value: 0,
  },
];
const activeKey = ref(1);
const changeTab = (key) => {
  activeKey.value = key;
  emit('changeTab', key);
};
</script>

<style scoped>
.radio-tab {
  display: flex;
  flex: 1;
}
.btn {
  padding: 0.6rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  cursor: pointer;
  /* border-radius: 12px; */
}
.btn:hover {
  color: #eee;
}
.active {
  color: #fff;
}
</style>