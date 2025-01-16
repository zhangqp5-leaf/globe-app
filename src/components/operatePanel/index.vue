<template>
  <div class="operate-panel">
    <section class="panel-item">
      <div>公转：</div>
      <RadioTab @changeTab="changeRevolutionStatus" />
    </section>
    <section class="panel-item">
      自转：
      <RadioTab @changeTab="changeRotationStatus" />
    </section>
  </div>
</template>

<script setup>
import RadioTab from '@/components/radioTab/index.vue';

const emit = defineEmits(['changeRevolutionStatus', 'changeRotationStatus']);

const changeRevolutionStatus = (status) => {
  console.log(status);
  emit('changeRevolutionStatus', status);
};
const changeRotationStatus = (status) => {
  emit('changeRotationStatus', status);
};
</script>

<style scoped>
.operate-panel {
  position: absolute;
  top: 1rem;
  left: 1rem;
  height: min-content;
  width: 15rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(1px);

  border-radius: 0.6rem;
  padding: 1rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.panel-item {
  display: flex;
  align-items: center;
}
</style>